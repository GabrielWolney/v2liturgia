export interface Prayer {
  id: string;
  titulo: string;
  texto: string;
}

export const dbOracoes: Record<string, Prayer> = {
  "pai-nosso": {
    id: "pai-nosso",
    titulo: "Pai Nosso",
    texto: `Pai Nosso que estais nos Céus, santificado seja o vosso Nome, venha a nós o vosso Reino, seja feita a vossa vontade assim na terra como no Céu.

O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do Mal.

Amém.`
  },
  "ave-maria": {
    id: "ave-maria",
    titulo: "Ave Maria",
    texto: `Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.

Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.

Amém.`
  },
  "gloria-pai": {
    id: "gloria-pai",
    titulo: "Glória ao Pai",
    texto: `Glória ao Pai, ao Filho e ao Espírito Santo.

Como era no princípio, agora e sempre.

Amém.`
  },
  "credo": {
    id: "credo",
    titulo: "Credo (Símbolo dos Apóstolos)",
    texto: `Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado.

Desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos.

Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna.

Amém.`
  },
  "salve-rainha": {
    id: "salve-rainha",
    titulo: "Salve Rainha",
    texto: `Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.

Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro nos mostrai Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce e sempre Virgem Maria.

V. Rogai por nós, Santa Mãe de Deus.
R. Para que sejamos dignos das promessas de Cristo.
Amém.`
  },
  "santo-anjo": {
    id: "santo-anjo",
    titulo: "Santo Anjo",
    texto: `Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina.

Amém.`
  },
  "sao-miguel": {
    id: "sao-miguel",
    titulo: "São Miguel Arcanjo",
    texto: `São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a satanás e aos outros espíritos malignos, que andam pelo mundo para perder as almas.

Amém.`
  },
  "angelus": {
    id: "angelus",
    titulo: "O Angelus",
    texto: `V. O Anjo do Senhor anunciou a Maria.
R. E ela concebeu do Espírito Santo.
(Reza-se uma Ave Maria)

V. Eis aqui a serva do Senhor.
R. Faça-se em mim segundo a vossa palavra.
(Reza-se uma Ave Maria)

V. E o Verbo divino se fez carne.
R. E habitou entre nós.
(Reza-se uma Ave Maria)

V. Rogai por nós, Santa Mãe de Deus.
R. Para que sejamos dignos das promessas de Cristo.

Oremos:
Infundi, Senhor, como Vos pedimos, a Vossa graça em nossas almas, para que nós, que pela Anunciação do Anjo conhecemos a Encarnação de Jesus Cristo, Vosso Filho, pela sua Paixão e Morte na Cruz, sejamos conduzidos à glória da ressurreição. Por Nosso Senhor Jesus Cristo. 
Amém.`
  },
  "fica-senhor-comigo": {
    id: "fica-senhor-comigo",
    titulo: "Fica, Senhor, Comigo (S. Padre Pio)",
    texto: `Fica Senhor comigo, pois preciso da tua presença para não te esquecer. Sabes quão facilmente posso te abandonar.

Fica Senhor comigo, porque sou fraco e preciso da tua força para não cair.

Fica Senhor comigo, porque és minha vida, e sem ti perco o fervor.

Fica Senhor comigo, porque és minha luz, e sem ti reina a escuridão.

Fica Senhor comigo, para me mostrar tua vontade.

Fica Senhor comigo, para que ouça tua voz e te siga.

Fica Senhor comigo, pois desejo amar-te e permanecer sempre em tua companhia.

Fica Senhor comigo, se queres que te seja fiel.

Fica Senhor comigo, porque, por mais pobre que seja minha alma, quero que se transforme num lugar de consolação para ti, um ninho de amor.

Fica comigo, Jesus, pois se faz tarde e o dia chega ao fim; a vida passa, e a morte, o julgamento e a eternidade se aproximam. Preciso de ti para renovar minhas energias e não parar no caminho. Está ficando tarde, a morte avança e eu tenho medo da escuridão, das tentações, da falta de fé, da cruz, das tristezas. Oh, quanto preciso de ti, meu Jesus, nesta noite de exílio.

Fica comigo nesta noite, Jesus, pois ao longo da vida, com todos os seus perigos, eu preciso de ti. Faze, Senhor, que te reconheça como te reconheceram teus discípulos ao partir do pão, a fim de que a Comunhão Eucarística seja a luz a dissipar a escuridão, a força a me sustentar, a única alegria do meu coração.

Fica comigo, Senhor, porque na hora da morte quero estar unido a ti, se não pela Comunhão, ao menos pela graça e pelo amor.

Fica comigo, Jesus. Não peço consolações divinas, porque não as mereço, mas apenas o presente da tua presença, ah, isso sim te suplico!

Fica Senhor comigo, pois é só a ti que procuro, teu amor, tua graça, tua vontade, teu coração, teu Espírito, porque te amo, e a única recompensa que te peço é poder amar-te sempre mais. Com este amor resoluto desejo amar-te de todo o coração enquanto estiver na terra, para continuar a te amar perfeitamente por toda a eternidade. Amém.

São Padre Pio, rogai por nós!`
  },
  "vinde-espirito-santo": {
    id: "vinde-espirito-santo",
    titulo: "Vinde Espírito Santo",
    texto: `Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.

V. Enviai, Senhor, o vosso Espírito, e tudo será criado.
R. E renovareis a face da terra.

Oremos:
Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre de sua consolação. Por Cristo, Senhor nosso. Amém.`
  },
  "oracao-sao-francisco": {
    id: "oracao-sao-francisco",
    titulo: "Oração pela Paz (São Francisco)",
    texto: `Senhor, fazei-me instrumento de vossa paz.

Onde houver ódio, que eu leve o amor;
Onde houver ofensa, que eu leve o perdão;
Onde houver discórdia, que eu leve a união;
Onde houver dúvida, que eu leve a fé;
Onde houver erro, que eu leve a verdade;
Onde houver desespero, que eu leve a esperança;
Onde houver tristeza, que eu leve a alegria;
Onde houver trevas, que eu leve a luz.

Ó Mestre,
Fazei que eu procure mais
Consolar, que ser consolado;
Compreender, que ser compreendido;
Amar, que ser amado.

Pois é dando que se recebe,
É perdoando que se é perdoado,
E é morrendo que se vive para a vida eterna.
Amém.`
  },
  "magnificat": {
    id: "magnificat",
    titulo: "Magnificat (Cântico de Maria)",
    texto: `A minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva.

Doravante todas as gerações me chamarão bem-aventurada, porque o Todo-Poderoso fez grandes coisas em meu favor. O seu nome é santo, e sua misericórdia se estende, de geração em geração, a todos os que o temem.

Ele mostrou a força de seu braço: dispersou os soberbos de coração. Derrubou do trono os poderosos e exaltou os humildes.

Encheu de bens os famintos, e despediu os ricos de mãos vazias.

Socorreu Israel, seu servo, lembrando-se de sua misericórdia, conforme prometera aos nossos pais, em favor de Abraão e de sua descendência, para sempre.

Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Amém.`
  }
};