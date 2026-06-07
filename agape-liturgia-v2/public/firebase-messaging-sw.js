importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Nota de Boas Práticas: Estas chaves são PÚBLICAS por design no Firebase Web SDK.
// Elas apenas identificam o projeto para o serviço de mensageria e não concedem acesso administrativo.
const firebaseConfig = {
  apiKey: "AIzaSyA8HrJeZ-QHGQHHGTn5-N7L_2CpSUd42gM",
  authDomain: "agape-avisos.firebaseapp.com",
  projectId: "agape-avisos",
  storageBucket: "agape-avisos.firebasestorage.app",
  messagingSenderId: "556421268172",
  appId: "1:556421268172:web:b9cb0955e3e95dd8e8f869"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// ─── Mensagem recebida em segundo plano ─────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Ágape Liturgia';

  // ✅ Imagem (se vier no payload) com URL resolvida para o origin do SW
  const imageUrl = payload.notification?.image || null;

  const notificationOptions = {
    body: payload.notification?.body || '',
    // ✅ Ícone com URL absoluta para funcionar corretamente em todos os contextos
    icon: self.registration.scope + 'icon-192x192.png',
    // ✅ badge removido — path PNG é ignorado pelos browsers e iOS
    ...(imageUrl && { image: imageUrl }),
    data: payload.data || {},
    actions: [
      { action: 'open_app', title: '📖 Abrir' },
      { action: 'close', title: '✕ Fechar' },
    ],
    requireInteraction: false,
    vibrate: [200, 100, 200],
    // ✅ tag por tipo de notificação para evitar duplicatas mas permitir múltiplos canais
    tag: payload.data?.tag || 'agape-notificacao',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
// ────────────────────────────────────────────────────────────────────────────

// ─── Clique na notificação ────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data || {};

  // Ação "close" não navega para lugar nenhum
  if (action === 'close') return;

  // URL de destino vem do data.url ou cai no padrão /jornada
  const urlToOpen = data.url || '/jornada';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Se já houver uma janela aberta do Ágape, foca nela e navega
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'navigate', url: urlToOpen });
          return;
        }
      }
      // Se não houver janela aberta, abre o PWA na URL correta
      if (clients.openWindow) {
        return clients.openWindow(self.registration.scope + urlToOpen.replace(/^\//, ''));
      }
    })
  );
});
// ────────────────────────────────────────────────────────────────────────────