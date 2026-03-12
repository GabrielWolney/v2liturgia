export interface Prayer {
  id: string;
  titulo: string;
  texto: string;
}

export const dbOracoes: Record<string, Prayer> = {
  "pai-nosso": {
    id: "pai-nosso",
    titulo: "Pai Nosso",
    texto: "Pai Nosso que estais nos Céus, santificado seja o vosso Nome, venha a nós o vosso Reino, seja feita a vossa vontade assim na terra como no Céu.\n\nO pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do Mal.\n\nAmém."
  },
  "ave-maria": {
    id: "ave-maria",
    titulo: "Ave Maria",
    texto: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.\n\nSanta Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte.\n\nAmém."
  },
  "gloria-pai": {
    id: "gloria-pai",
    titulo: "Glória ao Pai",
    texto: "Glória ao Pai, ao Filho e ao Espírito Santo.\n\nComo era no princípio, agora e sempre.\n\nAmém."
  },
  "credo": {
    id: "credo",
    titulo: "Credo (Símbolo dos Apóstolos)",
    texto: "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado.\n\nDesceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos.\n\nCreio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna.\n\nAmém."
  },
  "salve-rainha": {
    id: "salve-rainha",
    titulo: "Salve Rainha",
    texto: "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.\n\nEia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria.\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo."
  },
  "santo-anjo": {
    id: "santo-anjo",
    titulo: "Santo Anjo",
    texto: "Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina.\n\nAmém."
  },
  "sao-miguel": {
    id: "sao-miguel",
    titulo: "São Miguel Arcanjo",
    texto: "São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a satanás e aos outros espíritos malignos, que andam pelo mundo para perder as almas.\n\nAmém."
  }
};