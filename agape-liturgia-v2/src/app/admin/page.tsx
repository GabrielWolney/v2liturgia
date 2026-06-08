"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/hooks/useAuth";
import { subscribeToAvisos, subscribeToAvisosGerais, Aviso } from "@/services/db-home";
import { adicionarAviso, deletarAviso, adicionarAvisoGeral, deletarAvisoGeral, getProposito, updateProposito, Proposito, promoverUsuario, getJovensPendentes, atualizarStatusJovem, getConfigComunidade, updateConfigComunidade, getEstatisticasComunidade, EstatisticasComunidade, JovemPendente } from "@/services/db-admin";
import { useUserStore } from "@/store/useUserStore";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { useAlertStore } from "@/store/useAlertStore";

const COMUNIDADES_DISPONIVEIS = [
  "Emaús",
  "Cafarnaum",
  "Jerusalém"
];

const IconeTerco = (
  <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-[28px] h-[28px] mb-2 drop-shadow-sm text-[#2F6BFF]/50 fill-current">
    <g transform="matrix(.1 0 0 -.1 0 512)">
      <path d="m4074.7 4995.1c-377.8-136.9-564.8-534-412.5-875.2 67.5-152.3 233.2-308.4 387.5-366.3 348.9-131.1 747.9 94.5 846.2 480 36.6 146.5 19.3 269.9-57.8 420.2-57.8 115.7-215.9 266-335.4 318.1-119.6 54-314.2 63.7-428 23.2zm347-339.3c111.8-57.8 163.8-146.5 163.8-285.3 0-198.5-107.9-312.3-304.6-323.8-142.7-7.7-231.3 30.8-296.9 129.1-55.9 82.9-61.7 266-9.6 368.2 40.5 82.9 171.6 154.2 283.4 154.2 42.5 0 117.6-19.3 163.9-42.4z"/>
      <path d="m5535.9 4823.5c-104.1-38.6-233.2-133-302.6-219.8-161.9-204.3-192.8-439.5-82.9-661.2 119.5-242.9 347-391.3 593.7-391.3 456.9 3.9 780.7 497.3 589.9 906-115.7 244.8-343.1 397.1-591.8 393.2-73.3.1-167.8-13.4-206.3-26.9zm385.5-337.3c106-65.5 142.7-142.6 134.9-298.8-9.6-214-106-306.5-314.2-308.4-215.9 0-325.8 111.8-325.8 331.6 0 136.9 30.8 194.7 142.6 271.8 84.9 57.8 270 59.7 362.5 3.8z"/>
      <path d="m2740.8 4495.8c-362.4-133-547.5-541.7-395.2-867.4 90.6-196.6 242.9-327.7 447.2-387.5 206.3-59.8 431.8 7.7 603.4 179.3 131.1 131.1 185.1 250.6 192.8 433.7 7.7 127.2 1.9 161.9-42.4 260.2-67.5 146.5-204.3 285.3-348.9 354.7-94.5 46.3-138.8 55.9-250.6 54-73.3 0-167.8-13.5-206.3-27zm370.1-333.5c104.1-52.1 154.2-142.7 154.2-279.5 0-215.9-109.9-329.6-318.1-331.6-214 0-327.7 113.7-327.7 331.6 0 133 32.8 194.7 144.6 271.8 81 54 248.7 57.9 347 7.7z"/>
      <path d="m6995.1 4486.2c-144.6-57.8-285.3-190.8-360.5-343.1-55.9-111.8-63.6-148.4-63.6-273.7 0-181.2 46.3-287.2 185-433.7 138.8-148.4 273.7-210.1 460.7-210.1 179.3-1.9 320 57.8 453 190.8 258.3 256.4 269.9 618.8 28.9 882.9-138.8 152.3-262.1 212-453 219.8-119.4 3.7-175.3-2.1-250.5-32.9zm428-339.3c79-57.8 121.4-154.2 121.4-279.5 0-119.5-42.4-202.4-140.7-275.6-75.2-55.9-266-55.9-360.5-1.9-82.9 48.2-154.2 181.2-154.2 291.1 0 106 71.3 235.2 154.2 281.4 90.6 50.1 302.7 42.3 379.8-15.5z"/>
      <path d="m1994.8 3368.1c-111.8-23.1-279.5-125.3-360.5-219.8-108-125.3-150.4-235.2-158.1-401-7.7-134.9-1.9-161.9 50.1-275.7 246.7-526.2 927.2-535.9 1183.6-13.5 54 109.9 63.6 148.4 63.6 264.1-3.8 397.3-399 723-778.7 645.9zm312.3-362.4c90.6-54 138.8-152.3 138.8-283.4 0-208.2-115.7-320-329.6-320-198.5 0-316.1 115.7-316.1 314.2 0 169.6 73.2 279.5 212 321.9 84.7 23.2 223.5 7.8 294.9-32.7z"/>
      <path d="m7891.5 3358.5c-188.9-52.1-343.1-183.1-445.3-375.9-38.6-73.3-46.3-113.7-46.3-260.2 0-204.3 32.8-283.4 185-445.3 266-279.5 672.8-275.6 929.1 11.6 134.9 150.4 175.4 250.6 177.3 433.7 0 192.8-59.7 327.7-202.4 460.7-179.1 167.7-395 229.4-597.4 175.4zm337.3-354.7c73.2-40.5 144.6-179.3 144.6-281.4 0-104.1-71.3-241-150.4-285.3-84.8-50.1-269.9-50.1-352.8 0-94.5 54-138.8 127.2-148.4 242.9-15.4 185.1 48.2 296.9 202.4 352.8 86.8 30.8 219.8 19.2 304.6-29z"/>
      <path d="m7342.1 2028.4c-113.7-42.4-260.2-161.9-333.5-267.9-175.4-262.2-148.4-555.2 73.3-790.3 138.8-146.5 279.5-212 462.6-212 181.2-1.9 321.9 57.8 458.8 194.7 144.6 144.6 187 250.6 187 458.8 0 200.5-32.8 281.4-175.4 433.7-133 140.7-256.4 198.5-441.4 206.3-102.2 3.7-181.3-4-231.4-23.3zm408.7-348.9c79-57.8 121.4-154.2 121.4-279.5 0-181.2-109.9-300.7-291.1-318.1-217.8-21.2-377.8 136.9-356.6 352.8 19.3 206.3 131.1 300.7 343.1 291.1 92.6-5.8 144.6-17.4 183.2-46.3z"/>
      <path d="m1800.1 1878.1c-121.4-34.7-208.2-92.5-316.1-206.3-133-142.7-175.4-246.7-175.4-433.7 0-138.8 5.8-165.8 65.5-275.6 167.7-308.5 499.2-443.4 801.9-329.7 160 59.8 333.5 233.3 393.2 393.2 175.4 466.5-294.9 987-769.1 852.1zm345-356.6c102.2-75.2 127.2-133 127.2-279.5 0-115.7-7.7-150.4-46.3-204.3-57.8-81-144.6-117.6-275.7-117.6-212 0-335.4 136.9-318.1 354.7 11.6 136.9 52.1 198.6 169.6 258.3 69.4 36.6 104.1 42.4 188.9 34.7 60-5.9 127.4-25.2 154.4-46.3z"/>
      <path d="m6179.7 1033.7c-146.5-57.8-312.3-217.8-379.8-368.2-106-237.1-57.8-481.9 136.9-690.1 133-142.7 268-202.4 460.7-202.4 192.8 0 327.7 59.8 460.7 202.4 165.8 177.3 227.5 379.8 177.3 576.4-36.6 146.5-96.4 241-221.7 354.7-181.1 162-418.2 210.1-634.1 127.2zm414.5-339.2c127.2-94.5 171.6-310.4 90.6-451.1-46.3-81-181.2-152.3-287.2-152.3-98.3 1.9-229.4 59.8-269.9 123.4-109.9 167.7-57.8 414.5 106 499.3 92.5 48.1 287.2 36.6 360.5-19.3z"/>
      <path d="m2066.1 374.5c-198.5-84.8-356.6-256.4-414.4-454.9-79-277.6 75.2-595.6 364.3-747.9 88.7-46.3 123.4-54 266-54 202.4 0 306.5 44.3 464.6 202.4 142.6 140.7 196.6 279.5 187 472.3-21.3 429.8-487.8 742.1-867.5 582.1zm383.6-323.9c106-52.1 160-148.4 160-291.1 0-194.7-125.3-321.9-314.2-323.8-233.2 0-372 167.7-331.6 404.8 34.7 208.2 275.7 312.3 485.8 210.1z"/>
      <path d="m5032.8 44.8c-356.6-150.3-522.4-497.3-395.2-834.7 57.8-156.1 233.2-329.6 391.3-389.4 306.5-115.6 667 42.4 815.4 360.5 73.3 156.1 73.3 354.7 0 505-158.1 322-520.5 482-811.5 358.6zm331.5-300.7c206.3-57.8 281.4-362.4 134.9-530.1-71.3-81-163.8-113.8-296.9-102.2-179.3 15.4-279.5 131.1-279.5 321.9.1 243 196.7 381.8 441.5 310.4z"/>
      <path d="m2789-919c-123.4-40.5-241-115.6-321.9-206.2-242.9-266-233.2-626.5 21.2-880.9 131.1-131.1 250.6-185.1 433.7-192.8 127.2-7.7 161.9-1.9 260.2 42.4 148.4 67.5 296.9 217.9 362.4 362.4 44.3 100.2 52.1 134.9 44.3 264.1-7.7 181.2-61.7 300.7-192.8 431.8-165.7 165.7-420.1 240.9-607.1 179.2zm339.2-350.8c86.7-52 136.9-158 136.9-289.1 0-204.3-111.8-316.1-316.1-316.1-129.2 0-237.1 50.1-287.2 133-71.3 121.5-57.8 316.1 30.8 416.4 88.7 104 308.4 131 435.6 55.8z"/>
      <path d="m4219.3-1366.2c-383.6-214-453-267.9-453-348.9 0-27 73.2-179.3 163.9-335.4 90.6-158 163.8-293 163.8-302.6s-133-92.5-296.9-185.1c-310.4-177.3-360.5-225.5-329.6-320 21.2-69.4 433.7-778.8 466.5-803.8 67.5-52.1 144.6-27 435.6 140.7 266 152.3 293 163.8 314.2 133 13.5-17.4 181.2-310.4 374-647.7 289.2-510.8 360.5-624.6 420.2-661.2 94.5-61.7 225.5-94.5 310.4-79 77.1 13.5 460.7 221.7 508.9 275.6 67.5 75.2 113.7 217.8 106 323.8-7.7 90.6-48.2 171.6-343.1 686.3-185 321.9-350.8 611.1-368.2 641.9l-34.7 57.8 298.8 169.6c163.8 94.5 306.5 187 316.1 206.3 11.6 19.3 19.3 59.7 19.3 88.7 0 54-383.6 757.6-447.2 821.2-65.5 65.5-150.3 44.3-404.8-102.2-129.2-75.2-260.2-148.4-287.2-163.9l-52-25-167.7 298.8c-92.5 163.8-183.1 306.5-202.4 316.1-79.1 42.5-150.4 17.4-510.9-185zm528.2-472.3c88.7-158.1 181.2-302.6 202.4-318.1 75.2-52 140.7-30.8 429.9 134.9 156.1 90.6 289.2 160 296.8 154.2 19.3-11.6 235.2-395.2 225.5-401-1.9-3.9-138.8-82.9-300.7-175.4-293-167.7-331.6-200.5-331.6-283.4 0-23.1 187-372 416.4-773 348.9-613 412.5-734.5 391.3-755.6-15.4-13.5-104.1-69.4-200.5-123.4-134.9-77.1-177.3-92.5-196.6-73.2-11.6 11.6-185 310.4-381.7 659.3-198.5 350.8-381.7 672.8-406.7 715.1-57.8 100.3-136.9 135-225.5 96.4-34.7-13.5-177.3-92.5-320-173.5-142.6-80.9-260.2-144.6-262.2-142.6-32.8 54-221.7 401-221.7 406.7 0 5.8 119.5 79 266 162 287.2 161.9 370.1 229.4 370.1 298.8 0 25.1-77.1 181.2-171.6 347l-171.6 302.6 206.3 115.7c111.8 65.5 208.2 117.6 214 117.6 5.9 0 83-131.1 171.7-291.1z"/>
    </g>
  </svg>
);

export default function AdminPage() {
  const router = useRouter(); 
  const { user } = useAuth();
  const { tamanhoFonte, permissoes } = useUserStore();
  const { showAlert } = useAlertStore();
  const { playPop, playSuccess, playError, playClick } = useSound();
  const { triggerHaptic } = useHaptics();
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  const isMasterAdmin = permissoes?.isMasterAdmin || false;
  const isIntercessao = permissoes?.isCoordenadorIntercessao || false;
  const isLiturgia = permissoes?.isCoordenadorLiturgia || false;
  const comunidadeCoordenador = permissoes?.coordenadorComunidade || null;

  const temAlgumaPermissao = isMasterAdmin || isIntercessao || isLiturgia || !!comunidadeCoordenador;

  const [selectedRole, setSelectedRole] = useState<string>('');
  const availableRoles: {key: string, label: string}[] = [];
  
  if (isMasterAdmin) {
    availableRoles.push({key: 'master_admin', label: 'Master Admin'});
    availableRoles.push({key: 'coordenador_intercessao', label: 'Intercessão (Simulador)'});
    availableRoles.push({key: 'coordenador_liturgia', label: 'Liturgia (Simulador)'});
    COMUNIDADES_DISPONIVEIS.forEach(c => {
      availableRoles.push({key: `coordenador_comunidade_${c}`, label: `${c} (Simulador)`});
    });
  } else {
    if (isIntercessao) availableRoles.push({key: 'coordenador_intercessao', label: 'Coordenador Intercessão'});
    if (isLiturgia) availableRoles.push({key: 'coordenador_liturgia', label: 'Equipe de Liturgia'});
    if (comunidadeCoordenador) availableRoles.push({key: `coordenador_comunidade_${comunidadeCoordenador}`, label: `Coordenador ${comunidadeCoordenador}`});
  }

  const activeRoleKey = selectedRole || (availableRoles.length > 0 ? availableRoles[0].key : '');
  const activeViewMaster = activeRoleKey === 'master_admin';
  const activeViewIntercessao = activeRoleKey === 'coordenador_intercessao';
  const activeViewLiturgia = activeRoleKey === 'coordenador_liturgia';
  const activeViewComunidade = activeRoleKey.startsWith('coordenador_comunidade_');
  const activeComunidadeName = activeViewComunidade ? activeRoleKey.replace('coordenador_comunidade_', '') : null;

  const [avisosComunidade, setAvisosComunidade] = useState<Aviso[]>([]);
  const [avisosGerais, setAvisosGerais] = useState<Aviso[]>([]);
  const [jovensPendentes, setJovensPendentes] = useState<JovemPendente[]>([]);
  
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [novoAvisoData, setNovoAvisoData] = useState("");
  
  const [novoAvisoGeralTexto, setNovoAvisoGeralTexto] = useState("");
  const [novoAvisoGeralData, setNovoAvisoGeralData] = useState("");

  const [propAtivo, setPropAtivo] = useState(false);
  const [propTema, setPropTema] = useState("");
  const [propTexto, setPropTexto] = useState("");

  const [propLocalTexto, setPropLocalTexto] = useState("");
  const [dataVivencia, setDataVivencia] = useState("");
  const [localVivencia, setLocalVivencia] = useState("");

  const [estatisticas, setEstatisticas] = useState<EstatisticasComunidade | null>(null);

  const [emailGestao, setEmailGestao] = useState("");
  const [cargoGestao, setCargoGestao] = useState<"jovem" | "coordenador_comunidade" | "coordenador_intercessao" | "coordenador_liturgia" | "master_admin">("coordenador_comunidade");
  const [comunidadeGestao, setComunidadeGestao] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [gerandoPartilha, setGerandoPartilha] = useState(false);

  const carregarPendentes = useCallback(async () => {
    if (activeComunidadeName) {
      try {
        const lista = await getJovensPendentes(activeComunidadeName);
        setJovensPendentes(lista);
      } catch (error) {
        console.warn("Sem permissão para ler jovens pendentes:", error);
        setJovensPendentes([]);
      }
    }
  }, [activeComunidadeName]);

  const carregarConfigComunidade = useCallback(async () => {
    if (activeComunidadeName) {
      try {
        const config = await getConfigComunidade(activeComunidadeName);
        if (config) {
          setPropLocalTexto(config.propositoLocal || "");
          setDataVivencia(config.dataVivencia || "");
          setLocalVivencia(config.localVivencia || "");
        } else {
          setPropLocalTexto("");
          setDataVivencia("");
          setLocalVivencia("");
        }
      } catch (error) {
        console.warn("Sem permissão para ler configs da comunidade:", error);
      }
    }
  }, [activeComunidadeName]);

  const carregarEstatisticas = useCallback(async () => {
    if (activeComunidadeName) {
      try {
        const stats = await getEstatisticasComunidade(activeComunidadeName);
        setEstatisticas(stats);
      } catch (error) {
        console.warn("Sem permissão para ler estatísticas:", error);
      }
    }
  }, [activeComunidadeName]);

  useEffect(() => {
    if (!temAlgumaPermissao) return;

    let unsubAvisosComunidade = () => {};
    let unsubAvisosGerais = () => {};

    if (activeViewIntercessao || isMasterAdmin) {
      getProposito().then((p: Proposito | null) => {
        if (p) {
          setPropAtivo(p.ativo === true || String(p.ativo) === "true");
          setPropTema(p.tema || "");
          setPropTexto(p.texto || "");
        }
      });
    }

    if (activeViewMaster) {
      unsubAvisosGerais = subscribeToAvisosGerais(setAvisosGerais);
    }

    if (activeComunidadeName) {
      unsubAvisosComunidade = subscribeToAvisos(activeComunidadeName, setAvisosComunidade);
      carregarPendentes();
      carregarConfigComunidade();
      carregarEstatisticas();
    }

    return () => {
      unsubAvisosComunidade();
      unsubAvisosGerais();
    };
  }, [temAlgumaPermissao, activeViewIntercessao, isMasterAdmin, activeViewMaster, activeComunidadeName, carregarPendentes, carregarConfigComunidade, carregarEstatisticas]);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  if (!user || !temAlgumaPermissao) {
    return (
      <div className={`min-h-[100dvh] flex flex-col transition-colors duration-300 bg-background text-foreground ${fontClass}`}>
        <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[600px] mx-auto w-full bg-background/90 border-border">
          <button onClick={() => { playClick(); router.back(); }} className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-muted/20 hover:text-foreground active:scale-95 transition-colors">
            <span className="material-symbols-rounded text-[26px]">arrow_back</span>
          </button>
          <h1 className="font-extrabold tracking-tight text-foreground text-lg">Acesso Restrito</h1>
          <div className="w-10 h-10"></div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <span className="material-symbols-rounded text-[48px]">lock</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted font-medium mb-8 max-w-[300px]">
            Sua conta não possui permissões administrativas.
          </p>
        </main>
      </div>
    );
  }

  // ====================== HANDLERS ======================

  const handleSalvarAvisoComunidade = async () => {
    if (!comunidadeCoordenador) return;
    if (!novoAvisoTexto) { return showAlert("Campo Vazio", "Preencha o texto do aviso!", "error"); }
    setCarregando(true);
    // Usa uma data futura para não expirar automaticamente, pois o coordenador apaga manualmente
    await adicionarAviso(comunidadeCoordenador, novoAvisoTexto, "2099-12-31");
    setCarregando(false);
    showAlert("Sucesso", "Aviso postado para a comunidade.", "success");
    setNovoAvisoTexto("");
  };

  const handleSalvarAvisoGeral = async () => {
    if (!novoAvisoGeralTexto || !novoAvisoGeralData) { return showAlert("Campos Vazios", "Preencha texto e data!", "error"); }
    setCarregando(true);
    await adicionarAvisoGeral(novoAvisoGeralTexto, novoAvisoGeralData);
    setCarregando(false);
    showAlert("Sucesso", "Aviso global disparado.", "success");
    setNovoAvisoGeralTexto(""); setNovoAvisoGeralData("");
  };

  const handleSalvarPropositos = async () => {
    setCarregando(true);
    try {
      await updateProposito({ ativo: propAtivo, tema: propTema, texto: propTexto });
      showAlert("Atualizado", "Propósito Global atualizado com sucesso!", "success");
    } catch (error: any) {
      console.error(error);
      showAlert("Erro", "Erro ao atualizar Propósito Global: " + error.message, "error");
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarConfigComunidade = async () => {
    if (!activeComunidadeName) return;
    setCarregando(true);
    try {
      await updateConfigComunidade(activeComunidadeName, {
        propositoLocal: propLocalTexto,
        dataVivencia: dataVivencia,
        localVivencia: localVivencia
      });
      showAlert("Atualizado", "Configurações da comunidade atualizadas!", "success");
    } catch (error: any) {
      console.error(error);
      showAlert("Erro", "Erro ao atualizar Configurações da Comunidade: " + error.message, "error");
    } finally {
      setCarregando(false);
    }
  };

  const handleResponderJovem = async (uid: string, status: "aprovado" | "recusado") => {
    await atualizarStatusJovem(uid, status);
    if (status === "aprovado") { playSuccess(); triggerHaptic("success"); }
    else { playPop(); triggerHaptic("light"); }
    carregarPendentes();
  };

  const handleMudarCargo = async () => {
    if (!emailGestao) { return showAlert("Erro", "Digite o e-mail do usuário!", "error"); }
    if (cargoGestao === "coordenador_comunidade" && !comunidadeGestao) { return showAlert("Erro", "Selecione a comunidade!", "error"); }
    setCarregando(true);

    const payload = { isMasterAdmin: false, isCoordenadorIntercessao: false, isCoordenadorLiturgia: false, coordenadorComunidade: null as string | null };

    if (cargoGestao === "master_admin") payload.isMasterAdmin = true;
    if (cargoGestao === "coordenador_intercessao") payload.isCoordenadorIntercessao = true;
    if (cargoGestao === "coordenador_liturgia") payload.isCoordenadorLiturgia = true;
    if (cargoGestao === "coordenador_comunidade") payload.coordenadorComunidade = comunidadeGestao;

    const sucesso = await promoverUsuario(emailGestao.trim(), payload);
    if (sucesso) {
      showAlert("Sucesso", "Permissões atualizadas com sucesso!", "success");
      setEmailGestao("");
    } else {
      showAlert("Não Encontrado", "Nenhum usuário encontrado com este e-mail.", "error");
    }
    setCarregando(false);
  };

  const handleGerarPartilha = async () => {
    setGerandoPartilha(true);
    try {
      const liturgia = await getLiturgiaDoDia();
      if (!liturgia || !liturgia.leituras) return showAlert("Atenção", "Liturgia não disponível ainda.", "error");
      
      const leituras = liturgia.leituras;
      let textoZap = `*${liturgia.liturgia}*\n\n`;
      if (leituras.primeiraLeitura?.[0]) textoZap += `*${(leituras.primeiraLeitura[0].titulo || 'PRIMEIRA LEITURA').toUpperCase()}*\n${leituras.primeiraLeitura[0].referencia || ''}\n\n${leituras.primeiraLeitura[0].texto}\n\n`;
      if (leituras.salmo?.[0]) textoZap += `*SALMO RESPONSORIAL*\n${leituras.salmo[0].referencia || ''}\n\nREFRÃO\n— ${leituras.salmo[0].refrao || ''}\n\n${leituras.salmo[0].texto}\n\n`;
      if (leituras.segundaLeitura?.[0]) textoZap += `*${(leituras.segundaLeitura[0].titulo || 'SEGUNDA LEITURA').toUpperCase()}*\n${leituras.segundaLeitura[0].referencia || ''}\n\n${leituras.segundaLeitura[0].texto}\n\n`;
      if (leituras.evangelho?.[0]) textoZap += `*${(leituras.evangelho[0].titulo || 'EVANGELHO').toUpperCase()}*\n${leituras.evangelho[0].referencia || ''}\n\n${leituras.evangelho[0].texto}`;

      if (navigator.share) await navigator.share({ title: 'Liturgia do Dia', text: textoZap });
      else { await navigator.clipboard.writeText(textoZap); showAlert("Copiado!", "A liturgia foi copiada para sua área de transferência.", "success"); }
    } catch (e) { console.error(e); showAlert("Erro", "Erro ao gerar partilha.", "error"); } finally { setGerandoPartilha(false); }
  };

  // NATIVE DESIGN TOKENS (Settings Style)
  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted focus:border-[#2F6BFF] outline-none transition-colors";
  const selectClass = "w-full bg-background border border-border rounded-xl pl-4 pr-10 py-3 text-sm font-bold text-foreground focus:border-[#2F6BFF] hover:border-[#2F6BFF]/50 outline-none transition-colors appearance-none cursor-pointer shadow-sm";
  const buttonPrimaryClass = "w-full bg-[#2F6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#1E4BCC] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2";

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-300 bg-background text-foreground ${fontClass}`}>
      
      {/* HEADER PADRÃO */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[600px] mx-auto w-full bg-background/90 border-border">
        <button onClick={() => { playClick(); router.back(); }} className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-muted/20 hover:text-foreground active:scale-95 transition-colors">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="font-extrabold tracking-tight text-foreground text-lg">Painel Ágape</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 pb-32 animate-fade-in flex flex-col">
        
        {/* ================= SELETOR DE PERFIL ================= */}
        {availableRoles.length > 1 && (
          <section className="mb-8">
            <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Acesso Administrativo</p>
            <div className="rounded-[1.5rem] shadow-sm border p-5 transition-colors duration-300 bg-card border-border">
              <label className="block mb-2 font-bold text-sm text-foreground">Visualizando Como</label>
              <div className="relative group">
                <select
                  value={selectedRole || availableRoles[0].key}
                  onChange={e => { playClick(); setSelectedRole(e.target.value); }}
                  className={selectClass}
                >
                  {availableRoles.map(r => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-[#2F6BFF] transition-colors flex items-center justify-center">
                  <span className="material-symbols-rounded">expand_more</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= MASTER ADMIN ================= */}
        {activeViewMaster && (
          <>
            <section className="mb-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-[#2F6BFF]">Delegação de Cargos</p>
              <div className="rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-4 transition-colors duration-300 bg-card border-border">
                <div>
                  <label className="block mb-1.5 font-bold text-sm text-foreground">E-mail do Usuário</label>
                  <input type="email" placeholder="email@jovem.com" value={emailGestao} onChange={e => setEmailGestao(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-sm text-foreground">Novo Cargo</label>
                  <div className="relative group">
                    <select value={cargoGestao} onChange={e => setCargoGestao(e.target.value as any)} className={selectClass}>
                      <option value="coordenador_comunidade">Coordenador Local</option>
                      <option value="coordenador_intercessao">Coordenador Intercessão</option>
                      <option value="coordenador_liturgia">Equipe de Liturgia</option>
                      <option value="master_admin">Mestre Admin</option>
                      <option value="jovem">Remover Privilégios</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-[#2F6BFF] transition-colors flex items-center justify-center">
                      <span className="material-symbols-rounded">expand_more</span>
                    </div>
                  </div>
                </div>
                
                {cargoGestao === "coordenador_comunidade" && (
                  <div>
                    <label className="block mb-1.5 font-bold text-sm text-foreground">Comunidade</label>
                    <div className="relative group">
                      <select value={comunidadeGestao} onChange={e => setComunidadeGestao(e.target.value)} className={selectClass}>
                        <option value="" disabled>Selecione...</option>
                        {COMUNIDADES_DISPONIVEIS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover:text-[#2F6BFF] transition-colors flex items-center justify-center">
                        <span className="material-symbols-rounded">expand_more</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button onClick={handleMudarCargo} disabled={carregando} className={buttonPrimaryClass}>
                  ATUALIZAR PERMISSÕES
                </button>
              </div>
            </section>

            <section className="mb-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-red-500">Avisos Globais</p>
              <div className="rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-4 transition-colors duration-300 bg-card border-border">
                <input type="text" placeholder="Escreva o comunicado..." value={novoAvisoGeralTexto} onChange={e => setNovoAvisoGeralTexto(e.target.value)} className={inputClass} />
                <input type="date" value={novoAvisoGeralData} onChange={e => setNovoAvisoGeralData(e.target.value)} className={inputClass} />
                <button onClick={handleSalvarAvisoGeral} disabled={carregando} className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#B91C1C] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                  DISPARAR AVISO
                </button>
              </div>

              {avisosGerais.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {avisosGerais.map(a => (
                    <div key={a.id} className="rounded-[1.5rem] shadow-sm border p-4 flex justify-between items-center transition-colors duration-300 bg-card border-border">
                      <div className="pr-3">
                        <span className="inline-block bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded px-2 py-0.5 mb-1.5">Aviso Geral</span>
                        <p className="font-medium text-sm text-foreground">{a.texto}</p>
                      </div>
                      <button onClick={() => {
                        showAlert("Apagar Aviso", "Tem certeza que deseja apagar este aviso geral?", "error", () => deletarAvisoGeral(a.id), true);
                      }} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 active:scale-95 transition-all">
                        <span className="material-symbols-rounded text-[20px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ================= INTERCESSÃO ================= */}
        {activeViewIntercessao && (
          <section className="mb-8">
            <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-[#6E3AA5]">Propósito Global</p>
            <div className="rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 bg-card border-border flex flex-col p-5 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={propAtivo} onChange={e => { playClick(); setPropAtivo(e.target.checked); }} className="w-6 h-6 rounded-lg border-2 border-border/60 text-[#6E3AA5] focus:ring-[#6E3AA5] transition-all bg-background accent-[#6E3AA5]" />
                <span className="font-bold text-foreground">Propósito Ativo</span>
              </label>
              
              <input type="text" placeholder="Tema principal..." value={propTema} onChange={e => setPropTema(e.target.value)} className={inputClass} />
              <textarea placeholder="Descreva o foco espiritual..." value={propTexto} onChange={e => setPropTexto(e.target.value)} className={`${inputClass} h-32 resize-none`} />
              
              <button onClick={handleSalvarPropositos} className="w-full bg-[#6E3AA5] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#4A2673] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                ATUALIZAR PROPÓSITO
              </button>
            </div>
          </section>
        )}

        {/* ================= COMUNIDADE DE SERVOS ================= */}
        {activeViewComunidade && activeComunidadeName && (
          <>
            {estatisticas && (
              <section className="mb-8">
                <h2 className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Saúde da Comunidade</h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="material-symbols-rounded text-primary/50 text-[28px] mb-2">groups</span>
                    <p className="text-2xl font-black text-foreground leading-none">{estatisticas.totalJovens}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Total de Jovens</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="material-symbols-rounded text-orange-500/50 text-[28px] mb-2">local_fire_department</span>
                    <p className="text-2xl font-black text-foreground leading-none">{estatisticas.jovensAtivos}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Ativos (7 Dias)</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="material-symbols-rounded text-[#2F6BFF]/50 text-[28px] mb-2">menu_book</span>
                    <p className="text-2xl font-black text-foreground leading-none">{estatisticas.totalLeiturasFeitas}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Leituras Feitas</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    {IconeTerco}
                    <p className="text-2xl font-black text-foreground leading-none">{estatisticas.totalTercosRezados}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Terços Rezados</p>
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="material-symbols-rounded text-amber-500/50 text-[28px] mb-2">wb_twilight</span>
                  <p className="text-2xl font-black text-foreground leading-none">{estatisticas.totalOficiosRezados}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-1">Ofícios Rezados</p>
                </div>
              </section>
            )}

            <section className="mb-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-emerald-500">Aprovações Pendentes</p>
              {jovensPendentes.length === 0 ? (
                <div className="rounded-[1.5rem] shadow-sm border p-6 text-center transition-colors duration-300 bg-card border-border">
                  <span className="material-symbols-rounded text-[32px] text-muted opacity-30 mb-2">task_alt</span>
                  <p className="text-sm font-medium text-muted">Nenhum jovem aguardando.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {jovensPendentes.map((jovem) => (
                    <div key={jovem.id} className="rounded-[1.5rem] shadow-sm border p-4 flex justify-between items-center transition-colors duration-300 bg-card border-border">
                      <div className="pr-3">
                        <p className="font-bold text-sm text-foreground leading-tight">{jovem.nomeUsuario || "Jovem"}</p>
                        <p className="text-xs font-medium text-muted mt-0.5">{jovem.email}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleResponderJovem(jovem.id, "aprovado")} className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center active:scale-95 transition-all w-full px-4"><span className="material-symbols-rounded text-[20px] mr-2">check</span> Aprovar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mb-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-[#2F6BFF]">Configurações da Comunidade</p>
              <div className="rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-4 transition-colors duration-300 bg-card border-border">
                <div>
                  <label className="block mb-1.5 font-bold text-sm text-foreground">Propósito da Comunidade</label>
                  <textarea placeholder="Propósito da sua comunidade..." value={propLocalTexto} onChange={e => setPropLocalTexto(e.target.value)} className={`${inputClass} h-24 resize-none`} />
                </div>
                
                <div>
                  <label className="block mb-1.5 font-bold text-sm text-foreground">Próxima Vivência: Data</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ex: 25/12 às 19h" value={dataVivencia} onChange={e => setDataVivencia(e.target.value)} className={inputClass} />
                    <button onClick={() => setDataVivencia('A definir')} className="px-4 rounded-xl border border-border text-xs font-bold text-muted hover:bg-muted/10 transition-colors shrink-0">Reset</button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 font-bold text-sm text-foreground">Próxima Vivência: Local</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Ex: Capela central" value={localVivencia} onChange={e => setLocalVivencia(e.target.value)} className={inputClass} />
                    <button onClick={() => setLocalVivencia('A definir')} className="px-4 rounded-xl border border-border text-xs font-bold text-muted hover:bg-muted/10 transition-colors shrink-0">Reset</button>
                  </div>
                </div>

                <button onClick={handleSalvarConfigComunidade} disabled={carregando} className={buttonPrimaryClass}>
                  SALVAR CONFIGURAÇÕES
                </button>
              </div>
            </section>

            <section className="mb-8">
              <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-amber-500">Avisos da Comunidade</p>
              <div className="rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-4 transition-colors duration-300 bg-card border-border">
                <input type="text" placeholder="Mensagem para a comunidade..." value={novoAvisoTexto} onChange={e => setNovoAvisoTexto(e.target.value)} className={inputClass} />
                <button onClick={handleSalvarAvisoComunidade} disabled={carregando} className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#D97706] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2">
                  POSTAR AVISO
                </button>
              </div>

              {avisosComunidade.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  {avisosComunidade.map(a => (
                    <div key={a.id} className="rounded-[1.5rem] shadow-sm border p-4 flex justify-between items-center transition-colors duration-300 bg-card border-border">
                      <div className="pr-3">
                        <span className="inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded px-2 py-0.5 mb-1.5">Aviso Fixo</span>
                        <p className="font-medium text-sm text-foreground">{a.texto}</p>
                      </div>
                      <button onClick={() => {
                        showAlert("Apagar Aviso", "Tem certeza que deseja apagar este aviso da comunidade?", "error", () => deletarAviso(activeComunidadeName, a.id), true);
                      }} className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 active:scale-95 transition-all">
                        <span className="material-symbols-rounded text-[20px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ================= EQUIPE DE LITURGIA ================= */}
        {activeViewLiturgia && (
          <section className="mb-8">
            <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-[#25D366]">Equipe de Liturgia</p>
            <div className="rounded-[1.5rem] shadow-sm border p-5 transition-colors duration-300 bg-card border-border">
              <button onClick={handleGerarPartilha} disabled={gerandoPartilha} className="w-full flex items-center justify-between p-4 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors rounded-xl text-left font-bold active:scale-95">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded">chat</span>
                  <span className="text-[15px]">Gerar Partilha (WhatsApp)</span>
                </div>
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}