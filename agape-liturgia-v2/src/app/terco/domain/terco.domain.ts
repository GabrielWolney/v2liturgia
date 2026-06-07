export type MisterioKey = "mGozosos" | "mDolorosos" | "mGloriosos" | "mLuminosos";

export const ORACOES = {
  SINAL_CRUZ: {
    pt: "Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai, e do Filho, e do Espírito Santo. Amém.",
    la: "Per signum Sanctæ Crucis de inimícis nostris líbera nos, Deus noster. In nómine Patris, et Fílii, et Spíritus Sancti. Amen.",
  },
  CREDO: {
    pt: "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.",
    la: "Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ. Et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.",
  },
  PAI_NOSSO: {
    pt: "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
    la: "Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum cotidiánum da nobis hódie. Et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.",
  },
  AVE_MARIA: {
    pt: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.",
    la: "Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.",
  },
  GLORIA: {
    pt: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
    la: "Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.",
  },
  FATIMA: {
    pt: "Ó meu Jesus, perdoai-nos e livrai-nos do fogo do inferno, levai as almas todas para o céu e socorrei principalmente as que mais precisarem.",
    la: "O mi Iesu, dimítte nobis débitas nostra, salva nos ab igne inferni, perduc in cælum omnes ánimas, præsértim eas, quæ misericórdiæ tuæ máximé índigent.",
  },
  SALVE_RAINHA: {
    pt: "Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus. Para que sejamos dignos das promessas de Cristo. Amém.",
    la: "Salve Regína, Mater misericórdiæ, vita, dulcédo et spes nostra, salve. Ad te clamámus, éxsules fílii Evæ. Ad te suspirámus geméntes et flentes in hac lacrimárum valle. Eia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis, post hoc exsílium, osténde. O clemens, o pia, o dulcis Virgo María. Ora pro nobis, sancta Dei Génetrix. Ut digni efficiámur promissiónibus Christi. Amen.",
  },
};

interface Misterio {
  t: string;
  p: string;
}

interface MisteriosInfo {
  nomeKey: MisterioKey;
  lista: Misterio[];
}

export function getMisteriosInfo(): MisteriosInfo {
  const dia = new Date().getDay();
  let tipo: "GOZOSOS" | "DOLOROSOS" | "GLORIOSOS" | "LUMINOSOS" = "GOZOSOS";
  let keyTipo: MisterioKey = "mGozosos";

  if (dia === 0 || dia === 3) {
    tipo = "GLORIOSOS";
    keyTipo = "mGloriosos";
  } else if (dia === 2 || dia === 5) {
    tipo = "DOLOROSOS";
    keyTipo = "mDolorosos";
  } else if (dia === 4) {
    tipo = "LUMINOSOS";
    keyTipo = "mLuminosos";
  }

  const base = {
    GOZOSOS: [
      { t: "A Anunciação", p: "O anjo entrou onde ela estava e disse: 'Alegra-te, cheia de graça! O Senhor está contigo' (Lc 1, 28)." },
      { t: "A Visitação", p: "Apenas Isabel ouviu a saudação de Maria, a criança estremeceu no seu seio e Isabel ficou cheia do Espírito Santo (Lc 1, 41)." },
      { t: "O Nascimento", p: "E ela deu à luz o seu filho primogênito, envolveu-o em faixas e deitou-o numa manjedoura (Lc 2, 7)." },
      { t: "A Apresentação", p: "Levaram o menino a Jerusalém para o apresentarem ao Senhor, conforme está escrito na Lei do Senhor (Lc 2, 22)." },
      { t: "Jesus entre os Doutores", p: "Três dias depois, encontraram-no no Templo, sentado no meio dos doutores, ouvindo-os e interrogando-os (Lc 2, 46)." },
    ],
    DOLOROSOS: [
      { t: "Agonia no Horto", p: "Entrou em agonia e rezava mais instantemente. O seu suor tornou-se como gotas de sangue a escorrer pela terra (Lc 22, 44)." },
      { t: "A Flagelação", p: "Pilatos mandou prender Jesus e flagelá-lo (Jo 19, 1)." },
      { t: "Coroa de Espinhos", p: "Os soldados teceram uma coroa de espinhos e puseram-lha na cabeça (Jo 19, 2)." },
      { t: "Caminho do Calvário", p: "Levando a sua cruz, Jesus saiu para o lugar chamado Calvário (Jo 19, 17)." },
      { t: "A Crucificação", p: "Jesus deu um forte grito: 'Pai, em tuas mãos entrego o meu espírito' (Lc 23, 46)." },
    ],
    GLORIOSOS: [
      { t: "A Ressurreição", p: "O anjo disse: 'Não tenhais medo. Ressuscitou, não está aqui' (Mc 16, 6)." },
      { t: "A Ascensão", p: "O Senhor Jesus, depois de lhes ter falado, foi elevado ao céu (Mc 16, 19)." },
      { t: "Pentecostes", p: "Apareceram-lhes umas línguas, como que de fogo, e todos ficaram cheios do Espírito Santo (At 2, 3-4)." },
      { t: "A Assunção", p: "És toda bela, minha amiga, e não há mancha em ti (Ct 4, 7)." },
      { t: "A Coroação", p: "Apareceu no céu um grande sinal: uma Mulher revestida de sol, com a lua sob os pés e uma coroa de doze estrelas (Ap 12, 1)." },
    ],
    LUMINOSOS: [
      { t: "O Batismo", p: "Uma voz vinda do céu dizia: 'Este é o meu Filho muito amado' (Mt 3, 17)." },
      { t: "Bodas de Caná", p: "Sua mãe disse aos serventes: 'Fazei tudo o que Ele vos disser' (Jo 2, 5)." },
      { t: "Anúncio do Reino", p: "Jesus dizia: 'O tempo está cumprido e o Reino de Deus está próximo; arrependei-vos' (Mc 1, 15)." },
      { t: "Transfiguração", p: "O seu rosto ficou resplandecente como o sol e as suas vestes brancas como a luz (Mt 17, 2)." },
      { t: "A Eucaristia", p: "Jesus tomou o pão e disse: 'Tomai e comei, isto é o meu corpo' (Mt 26, 26)." },
    ],
  };

  return {
    nomeKey: keyTipo,
    lista: base[tipo],
  };
}

export const UI_TEXTS = {
  pt: {
    inicio: "Início",
    profissao: "Profissão de Fé",
    intencoes: "Intenções",
    virtudes: "Virtudes Teologais",
    louvor: "Louvor",
    misterio: "Mistério",
    oracaoSenhor: "Oração do Senhor",
    doxologia: "Doxologia",
    encerramento: "Encerramento",
    concluido: "Concluído",
    aveMaria: "Ave Maria",
    pulsar: "Pulsar",
    registro: "Registrar Missão",
    tSinal: "Sinal da Cruz",
    tCredo: "Credo",
    tPaiNosso: "Pai Nosso",
    tGloria: "Glória ao Pai",
    tGloriaFatima: "Glória & Fátima",
    tSalveRainha: "Salve Rainha",
    tDeoGratias: "Ação de Graças",
    mGozosos: "Gozosos",
    mDolorosos: "Dolorosos",
    mGloriosos: "Gloriosos",
    mLuminosos: "Luminosos",
  },
  la: {
    inicio: "Initium",
    profissao: "Professio Fidei",
    intencoes: "Intentiones",
    virtudes: "Virtutes Theologicæ",
    louvor: "Laus",
    misterio: "Mysterium",
    oracaoSenhor: "Oratio Dominica",
    doxologia: "Doxologia",
    encerramento: "Conclusio",
    concluido: "Absolutum",
    aveMaria: "Ave María",
    pulsar: "Pulsáre",
    registro: "In Tabulis Referre",
    tSinal: "Signum Crucis",
    tCredo: "Symbolum Apostolorum",
    tPaiNosso: "Pater Noster",
    tGloria: "Gloria Patri",
    tGloriaFatima: "Gloria et Meménto",
    tSalveRainha: "Salve Regína",
    tDeoGratias: "Deo Gratias",
    mGozosos: "Gaudiósa",
    mDolorosos: "Dolorósa",
    mGloriosos: "Gloriósa",
    mLuminosos: "Luminósa",
  },
};
