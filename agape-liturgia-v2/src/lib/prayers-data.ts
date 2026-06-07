export interface Prayer {
  id: string;
  titulo: string;
  tituloLa?: string;
  tipo: string;
  pt: string;
  la: string;
  isLista?: boolean;
  instrucoesPt?: string;
  instrucoesLa?: string;
}

export const dbOracoes: Record<string, Prayer> = {
  "sinal-cruz": {
    id: "sinal-cruz",
    titulo: "Sinal da Cruz",
    tituloLa: "Signum Crucis",
    tipo: "Fundamental",
    pt: "Pelo sinal da Santa Cruz, livrai-nos, Deus, nosso Senhor, dos nossos inimigos. Em nome do Pai, e do Filho, e do Espírito Santo. Amém.",
    la: "Per signum Sanctæ Crucis de inimícis nostris líbera nos, Deus noster. In nómine Patris, et Fílii, et Spíritus Sancti. Amen."
  },
  "pai-nosso": {
    id: "pai-nosso",
    titulo: "Pai Nosso",
    tituloLa: "Pater Noster",
    tipo: "Fundamental",
    pt: "Pai nosso, que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu.\nO pão nosso de cada dia nos dai hoje; perdoai-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
    la: "Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum cotidiánum da nobis hódie. Et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen."
  },
  "ave-maria": {
    id: "ave-maria",
    titulo: "Ave Maria",
    tituloLa: "Ave María",
    tipo: "Fundamental",
    pt: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus.\nSanta Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.",
    la: "Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen."
  },
  "gloria": {
    id: "gloria",
    titulo: "Glória ao Pai",
    tituloLa: "Gloria Patri",
    tipo: "Doxologia",
    pt: "Glória ao Pai, ao Filho e ao Espírito Santo.\nComo era no princípio, agora e sempre. Amém.",
    la: "Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen."
  },
  "credo": {
    id: "credo",
    titulo: "Credo dos Apóstolos",
    tituloLa: "Symbolum Apostolorum",
    tipo: "Profissão de Fé",
    pt: "Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra; e em Jesus Cristo, seu único Filho, nosso Senhor; que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado.\nDesceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos.\nCreio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.",
    la: "Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ. Et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos. Credo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen."
  },
  "salve-rainha": {
    id: "salve-rainha",
    titulo: "Salve Rainha",
    tituloLa: "Salve Regína",
    tipo: "Mariana",
    pt: "Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.\nEia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria.\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo. Amém.",
    la: "Salve Regína, Mater misericórdiæ, vita, dulcédo et spes nostra, salve. Ad te clamámus, éxsules fílii Evæ. Ad te suspirámus geméntes et flentes in hac lacrimárum valle.\nEia ergo, advocáta nostra, illos tuos misericórdes óculos ad nos convérte. Et Iesum, benedíctum fructum ventris tui, nobis, post hoc exsílium, osténde. O clemens, o pia, o dulcis Virgo María.\n\nV. Ora pro nobis, sancta Dei Génetrix.\nR. Ut digni efficiámur promissiónibus Christi. Amen."
  },
  "santo-anjo": {
    id: "santo-anjo",
    titulo: "Santo Anjo",
    tituloLa: "Angele Dei",
    tipo: "Proteção",
    pt: "Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém.",
    la: "Angele Dei, qui custos es mei, me, tibi commissum pietáte supérna, illúmina, custódi, rege et gubérna. Amen."
  },
  "sao-miguel": {
    id: "sao-miguel",
    titulo: "São Miguel Arcanjo",
    tituloLa: "Sancte Michaël Archangele",
    tipo: "Batalha Espiritual",
    pt: "São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a satanás e a todos os espíritos malignos, que andam pelo mundo para perder as almas. Amém.",
    la: "Sancte Michaël Archangele, defende nos in prœlio; contra nequitiam et insidias diaboli esto præsidium. Imperet illi Deus, supplices deprecamur: tuque, Princeps militiæ cælestis, Satanam aliosque spiritus malignos, qui ad perditionem animarum pervagantur in mundo, divina virtute in infernum detrude. Amen."
  },
  "angelus": {
    id: "angelus",
    titulo: "O Angelus",
    tituloLa: "Angelus",
    tipo: "Mariana",
    pt: "V. O Anjo do Senhor anunciou a Maria.\nR. E ela concebeu do Espírito Santo.\n(Ave Maria)\n\nV. Eis aqui a serva do Senhor.\nR. Faça-se em mim segundo a vossa palavra.\n(Ave Maria)\n\nV. E o Verbo divino se fez carne.\nR. E habitou entre nós.\n(Ave Maria)\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo.\n\nOremos: Infundi, Senhor, como Vos pedimos, a Vossa graça em nossas almas, para que nós, que pela Anunciação do Anjo conhecemos a Encarnação de Jesus Cristo, Vosso Filho, pela sua Paixão e Morte na Cruz, sejamos conduzidos à glória da ressurreição. Por Nosso Senhor Jesus Cristo. Amém.",
    la: "V. Angelus Domini nuntiavit Mariae.\nR. Et concepit de Spiritu Sancto.\n(Ave Maria)\n\nV. Ecce ancilla Domini.\nR. Fiat mihi secundum verbum tuum.\n(Ave Maria)\n\nV. Et Verbum caro factum est.\nR. Et habitavit in nobis.\n(Ave Maria)\n\nV. Ora pro nobis, sancta Dei Genetrix.\nR. Ut digni efficiamur promissionibus Christi.\n\nOremus: Gratiam tuam, quaesumus, Domine, mentibus nostris infunde; ut qui, Angelo nuntiante, Christi Filii tui incarnationem cognovimus, per passionem eius et crucem, ad resurrectionis gloriam perducamur. Per eundem Christum Dominum nostrum. Amen."
  },
  "fica-senhor-comigo": {
    id: "fica-senhor-comigo",
    titulo: "Fica, Senhor, Comigo",
    tituloLa: "Mane Mecum, Domine",
    tipo: "Piedade (S. Padre Pio)",
    pt: "Fica Senhor comigo, pois preciso da tua presença para não te esquecer. Sabes quão facilmente posso te abandonar.\nFica Senhor comigo, porque sou fraco e preciso da tua força para não cair.\nFica Senhor comigo, porque és minha vida, e sem ti perco o fervor.\nFica Senhor comigo, porque és minha luz, e sem ti reina a escuridão.\nFica Senhor comigo, para me mostrar tua vontade.\nFica Senhor comigo, para que ouça tua voz e te siga.\nFica Senhor comigo, pois desejo amar-te e permanecer sempre em tua companhia.\nFica comigo, Jesus, pois se faz tarde e o dia chega ao fim; a vida passa, e a morte, o julgamento e a eternidade se aproximam. Preciso de ti para renovar minhas energias e não parar no caminho.\nFica comigo, Senhor, porque na hora da morte quero estar unido a ti, se não pela Comunhão, ao menos pela graça e pelo amor.\nFica Senhor comigo, pois é só a ti que procuro... porque te amo, e a única recompensa que te peço é poder amar-te sempre mais. Amém.",
    la: "Mane mecum, Domine, quoniam necessarius es mihi ne te obliviscar. Scis quam facile te derelinquam.\nMane mecum, Domine, quia infirmus sum et robore tuo indigeo ne cadam.\nMane mecum, Domine, quia tu es vita mea et sine te fervorem amitto.\nMane mecum, Domine, quia tu es lux mea et sine te in tenebris versor.\nMane mecum, Domine, ut mihi voluntatem tuam ostendas.\nMane mecum, Domine, ut vocem tuam audiam et te sequar.\nMane mecum, Domine, quia te amare et semper tecum manere desidero.\nMane mecum, Iesu, quoniam advesperascit et dies declinat; vita fugit, mors, iudicium et aeternitas appropinquant.\nMane mecum, Domine, quia in hora mortis tecum uniri volo, si non per sacram Communionem, saltem per gratiam et amorem.\nMane mecum, Domine, quia te solum quaero... quia te amo, et unica merces quam a te posco est ut te magis in dies amem. Amen."
  },
  "vinde-espirito-santo": {
    id: "vinde-espirito-santo",
    titulo: "Vinde Espírito Santo",
    tituloLa: "Veni Sancte Spiritus",
    tipo: "Fundamental",
    pt: "Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.\n\nV. Enviai, Senhor, o vosso Espírito, e tudo será criado.\nR. E renovareis a face da terra.\n\nOremos: Ó Deus, que instruístes os corações dos vossos fiéis com a luz do Espírito Santo, fazei que apreciemos retamente todas as coisas segundo o mesmo Espírito e gozemos sempre de sua consolação. Por Cristo, Senhor nosso. Amém.",
    la: "Veni, Sancte Spiritus, reple tuorum corda fidelium, et tui amoris in eis ignem accende.\n\nV. Emitte Spiritum tuum et creabuntur.\nR. Et renovabis faciem terrae.\n\nOremus: Deus, qui corda fidelium Sancti Spiritus illustratione docuisti: da nobis in eodem Spiritu recta sapere; et de eius semper consolatione gaudere. Per Christum Dominum nostrum. Amen."
  },
  "oracao-sao-francisco": {
    id: "oracao-sao-francisco",
    titulo: "Oração pela Paz",
    tituloLa: "Oratio Pro Pace",
    tipo: "Piedade (S. Francisco)",
    pt: "Senhor, fazei-me instrumento de vossa paz.\nOnde houver ódio, que eu leve o amor;\nOnde houver ofensa, que eu leve o perdão;\nOnde houver discórdia, que eu leve a união;\nOnde houver dúvida, que eu leve a fé;\nOnde houver erro, que eu leve a verdade;\nOnde houver desespero, que eu leve a esperança;\nOnde houver tristeza, que eu leve a alegria;\nOnde houver trevas, que eu leve a luz.\n\nÓ Mestre, fazei que eu procure mais consolar, que ser consolado; compreender, que ser compreendido; amar, que ser amado.\nPois é dando que se recebe, é perdoando que se é perdoado, e é morrendo que se vive para a vida eterna. Amém.",
    la: "Domine, fac me instrumentum pacis tuae.\nUbi odium, ibi amem;\nubi offensa, ibi ignoscam;\nubi discordia, ibi coniungam;\nubi dubium, ibi credam;\nubi error, ibi veritatem;\nubi desperatio, ibi sperem;\nubi tristitia, ibi gaudeam;\nubi tenebrae, ibi illuminem.\n\nO Magister, fac ut non tam quaeram consolari, quam consolari; intelligi, quam intelligere; amari, quam amare.\nQuoniam dando accipimus, ignoscendo ignoscimur, et moriendo nascimur in vitam aeternam. Amen."
  },
  "magnificat": {
    id: "magnificat",
    titulo: "Magnificat",
    tituloLa: "Magnificat",
    tipo: "Mariana",
    pt: "A minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humildade de sua serva.\nDoravante todas as gerações me chamarão bem-aventurada, porque o Todo-Poderoso fez grandes coisas em meu favor. O seu nome é santo, e sua misericórdia se estende, de geração em geração, a todos os que o temem.\nEle mostrou a força de seu braço: dispersou os soberbos de coração. Derrubou do trono os poderosos e exaltou os humildes.\nEncheu de bens os famintos, e despediu os ricos de mãos vazias.\nSocorreu Israel, seu servo, lembrando-se de sua misericórdia, conforme prometera aos nossos pais, em favor de Abraão e de sua descendência, para sempre.\n\nGlória ao Pai, ao Filho e ao Espírito Santo.\nComo era no princípio, agora e sempre. Amém.",
    la: "Magnificat anima mea Dominum, et exsultavit spiritus meus in Deo salutari meo, quia respexit humilitatem ancillae suae.\nEcce enim ex hoc beatam me dicent omnes generationes, quia fecit mihi magna, qui potens est, et sanctum nomen eius, et misericordia eius in progenies et progenies timentibus eum.\nFecit potentiam in brachio suo, dispersit superbos mente cordis sui. Deposuit potentes de sede et exaltavit humiles.\nEsurientes implevit bonis et divites dimisit inanes.\nSuscepit Israel puerum suum, recordatus misericordiae, sicut locutus est ad patres nostros, Abraham et semini eius in saecula.\n\nGloria Patri, et Filio, et Spiritui Sancto.\nSicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen."
  }
};