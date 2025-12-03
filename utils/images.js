

export const rarities = {
  comum:    { label: 'Comum 🟩',    color: '#10c400' }, 
  raro:     { label: 'Raro 🔷',     color: '#0099ff' },
  epico:    { label: 'Épico 🟣',    color: '#b700ff' },
  lendario: { label: 'Lendário ⭐', color: '#ffdf5d' },
  supremo:  { label: 'SUPREMO 👹', color: '#fd0000' },
};


export const rarityWeights = {
  comum: 90,     // 80%
  raro: 25,      // 15%
  epico: 10,      // 4%
  lendario: 1,   // 0,5%
  supremo: 0.02 // 0,1%
};

function pickRarityByWeight() {
  const entries = Object.entries(rarityWeights); 
  const total = entries.reduce((acc, [, w]) => acc + w, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of entries) {
    if (roll < weight) return rarity;
    roll -= weight;
  }

  return 'comum';
}

export function getRarityMeta(card) {
  return rarities[card.rarity] ?? rarities.comum;
}

const BASE_URL = 'https://raw.githubusercontent.com/GstvPmagalhaes/mirbot-cards/refs/heads/main/cards'

export const cardsPool = [
  {
    id: 'muie_pm',
    name: 'PM TONHAO',
    imageUrl: `${BASE_URL}/muie_pm.png`, 
    rarity: 'raro'
  },
  {
    id: 'nanico_peruca',
    name: 'Nanico PERUCA',
    imageUrl: `${BASE_URL}/nanico_peruca.jpeg`, 
    rarity: 'comum'
  },
   {
    id: 'blue_gem',
    name: 'KARAMBIT BLUE GEM',
    imageUrl: `${BASE_URL}/blue_gem.png`, 
    rarity: 'supremo'
  },
  {
    id: 'prostata',
    name: 'MINHA PROSTATA AMIGO',
    imageUrl: `${BASE_URL}/prostata.png`, 
    rarity: 'raro'
  },
  {
    id: 'patati_7mil',
    name: 'E O PATATA?',
    imageUrl: `${BASE_URL}/patati_7mil.png`, 
    rarity: 'comum'
  },
  {
    id: 'caminhoneiro_dosbon',
    name: 'SONHOOOO 😍',
    imageUrl: `${BASE_URL}/caminhoneiro_dosbon.png`, 
    rarity: 'epica'
  },
  {
    id: 'cachorro_mumu',
    name: 'MEU CACHORRO SUMIU 😥😥',
    imageUrl: `${BASE_URL}/cachorro_mumu.png`, 
    rarity: 'raro'
  },
  {
    id: 'bizarro_3200',
    name: 'BIZARRO',
    imageUrl: `${BASE_URL}/bizarro_3200.png`, 
    rarity: 'lendario'
  },
  {
    id: 'caminhao_calcinha',
    name: 'CAMINHAO VIADO',
    imageUrl: `${BASE_URL}/caminhao_calcinha.png`, 
    rarity: 'epico'
  },
  {
    id: 'rafaelanao_verao',
    name: 'RAFAEL CURTINDO VERAO',
    imageUrl: `${BASE_URL}/rafaelanao_verao.png`, 
    rarity: 'raro'
  },
  {
    id: 'deus_maravilhoso',
    name: 'DEUS ESTA EM TODAS AS COISAS',
    imageUrl: `${BASE_URL}/deus_maravilhoso.png`, 
    rarity: 'raro'
  },
  {
    id: 'peixe_queanda',
    name: 'ATERRORIZANTE!!!',
    imageUrl: `${BASE_URL}/peixe_queanda.png`, 
    rarity: 'comum'
  },
  {
    id: 'pizza_media',
    name: 'Sandra atualizou sua foto',
    imageUrl: `${BASE_URL}/pizza_media.png`, 
    rarity: 'epico'
  },
  {
    id: 'ditado',
    name: 'EXISTE',
    imageUrl: `${BASE_URL}/ditado.png`, 
    rarity: 'raro'
  },
  {
    id: 'nao_pergunte',
    name: 'NAO PERGUNTE',
    imageUrl: `${BASE_URL}/nao_pergunte.png`, 
    rarity: 'comum'
  },
  {
    id: 'fato_assustador',
    name: 'EXISTE UM LUGAR',
    imageUrl: `${BASE_URL}/fato_assustador.png`, 
    rarity: 'lendario'
  },
  {
    id: 'tattoo_grau',
    name: 'É OS D VIDA',
    imageUrl: `${BASE_URL}/tattoo_grau.png`, 
    rarity: 'comum'
  },
  {
    id: 'afelelicidade',
    name: 'LUIZ CURTIU',
    imageUrl: `${BASE_URL}/afelelicidade.png`, 
    rarity: 'raro'
  },
  {
    id: 'noget',
    name: 'frita meu noget :(',
    imageUrl: `${BASE_URL}/noget.png`, 
    rarity: 'raro'
  },
  {
    id: 'filhonasceu',
    name: 'PASTELARIA MEU FILHO NASCEU',
    imageUrl: `${BASE_URL}/filhonasceu.png`, 
    rarity: 'epico'
  },
  {
    id: 'cuzinhos_pelucia',
    name: 'CUZINHOS DE PELUCIA',
    imageUrl: `${BASE_URL}/cuzinhos_pelucia.png`, 
    rarity: 'comum'
  },
  {
    id: 'usaracao',
    name: 'JA USA RAÇAO E COME AREIA',
    imageUrl: `${BASE_URL}/usaracao.png`, 
    rarity: 'comum'
  },
  {
    id: 'aparelho_refri',
    name: 'APAELHO REFRIGERAÇAO COMPLETA',
    imageUrl: `${BASE_URL}/aparelho_refri.png`, 
    rarity: 'comum'
  },
  {
    id: 'degue',
    name: 'TEM DE QUE',
    imageUrl: `${BASE_URL}/degue.png`, 
    rarity: 'supremo'
  },
  {
    id: 'cudogustavo',
    name: 'MANO ONDE EU TO',
    imageUrl: `${BASE_URL}/cudogustavo.png`, 
    rarity: 'raro'
  },
  {
    id: 'maisumfds',
    name: 'E LA SE FOI...',
    imageUrl: `${BASE_URL}/maisumfds.png`, 
    rarity: 'raro'
  },
  {
    id: 'jaoemo',
    name: 'JAO EMO',
    imageUrl: `${BASE_URL}/jaoemo.png`, 
    rarity: 'raro'
  },
  {
    id: 'rafael',
    name: 'RAFAEL ANAO',
    imageUrl: `${BASE_URL}/rafael.png`, 
    rarity: 'epico'
  },
  {
    id: 'belle_belinha',
    name: 'Belle belinha',
    imageUrl: `${BASE_URL}/belle_belinha.png`, 
    rarity: 'comum'
  },
  {
    id: 'manda_foto',
    name: 'PVF MANDA PFV PFV',
    imageUrl: `${BASE_URL}/manda_foto.png`,
    rarity: 'raro'
  },
  {
    id: 'nanico_blue',
    name: 'NANICO AZUL',
    imageUrl: `${BASE_URL}/nanico_blue.png`,
    rarity: 'raro'
  },
  {
    id: 'desonline',
    name: 'DESOLINE 🙄',
    imageUrl: `${BASE_URL}/desonline.png`,
    rarity: 'epico'
  },
  {
    id: 'nanico_careca',
    name: 'NANICO CARECA',
    imageUrl: `${BASE_URL}/nanico_careca.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_kick',
    name: 'LUIZ DO KICK',
    imageUrl: `${BASE_URL}/luiz_kick.png`,
    rarity: 'raro'
  },
  {
    id: 'mucei',
    name: 'MUCEI CARAI',
    imageUrl: `${BASE_URL}/mucei.png`,
    rarity: 'comum'
  },
  {
    id: 'nanico_sol',
    name: 'NANICO CLT',
    imageUrl: `${BASE_URL}/nanico_sol.png`,
    rarity: 'raro'
  },
  {
    id: 'fab_godawn',
    name: 'VALE DOS MACHADOS',
    imageUrl: `${BASE_URL}/fab_godawn.png`,
    rarity: 'comum'
  },
  {
    id: 'gustavo_metafora',
    name: 'gugu metaforando',
    imageUrl: `${BASE_URL}/gustavo_metafora.png`,
    rarity: 'comum'
  },
  {
    id: 'luqinha_god',
    name: 'luqinha amem',
    imageUrl: `${BASE_URL}/luqinha_god.png`,
    rarity: 'epico'
  },
  {
    id: 'andriew',
    name: 'nossa como voce esta bela',
    imageUrl: `${BASE_URL}/andriew.png`,
    rarity: 'epico'
  },
  {
    id: 'danivaquez',
    name: 'Dani Vaquez',
    imageUrl: `${BASE_URL}/danivaquez.png`,
    rarity: 'comum'
  },
  {
    id: 'mini_messi',
    name: 'Mini messi',
    imageUrl: `${BASE_URL}/mini_messi.png`,
    rarity: 'comum'
  },
  {
    id: 'deus_cuida',
    name: 'Deus cuida de mim',
    imageUrl: `${BASE_URL}/deus_cuida.png`,
    rarity: 'comum'
  },
  {
    id: 'marea_turbo',
    name: 'MAREA TURBO',
    imageUrl: `${BASE_URL}/marea_turbo.png`,
    rarity: 'raro'
  },
  {
    id: 'ford_ka',
    name: 'FORDKA TUNADO',
    imageUrl: `${BASE_URL}/ford_ka.png`,
    rarity: 'comum'
  },
  {
    id: 'gol_skyline',
    name: 'GOL SKYLINE',
    imageUrl: `${BASE_URL}/gol_skyline.png`,
    rarity: 'raro'
  },
  {
    id: 'fox_hulk',
    name: 'FOX HULK',
    imageUrl: `${BASE_URL}/fox_hulk.png`,
    rarity: 'comum'
  },
  {
    id: 'pig_kombi',
    name: 'PIG KOMBI',
    imageUrl: `${BASE_URL}/pig_kombi.png`,
    rarity: 'epico'
  },
  {
    id: 'cachorro_cururu',
    name: 'CACHORRO CURURU',
    imageUrl: `${BASE_URL}/cachorro_cururu.png`,
    rarity: 'raro'
  },
  {
    id: 'gol_quadrado',
    name: 'GOL QUADRADO',
    imageUrl: `${BASE_URL}/gol_quadrado.png`,
    rarity: 'epico'
  },
  {
    id: 'luiz_barriga',
    name: 'LUIZ CURTINDO VERAO',
    imageUrl: `${BASE_URL}/luiz_barriga.png`,
    rarity: 'raro'
  },
  {
    id: 'lora',
    name: 'LORA LIGANO',
    imageUrl: `${BASE_URL}/lora.png`,
    rarity: 'lendario'
  },
  {
    id: 'murilo_morto',
    name: '🪨',
    imageUrl: `${BASE_URL}/murilo_morto.png`,
    rarity: 'lendario'
  },
  {
    id: 'jao_cria',
    name: 'JOAO CV 🚩😡',
    imageUrl: `${BASE_URL}/jao_cria.png`,
    rarity: 'epico'
  },
  {
    id: 'sofomaniaco',
    name: '@luiz',
    imageUrl: `${BASE_URL}/sofomaniaco.png`,
    rarity: 'raro'
  },
  {
    id: 'ops',
    name: '🤤🤤',
    imageUrl: `${BASE_URL}/ops.png`,
    rarity: 'epico'
  },
  {
    id: 'coelho',
    name: '🐰🐰',
    imageUrl: `${BASE_URL}/coelho.png`,
    rarity: 'raro'
  },
  {
    id: 'mamaco',
    name: 'RAFIKI 🐵',
    imageUrl: `${BASE_URL}/mamaco.png`,
    rarity: 'raro'
  },
  {
    id: 'murilin_role',
    name: 'MUMU CASA SAPUCAI',
    imageUrl: `${BASE_URL}/murilin_role.png`,
    rarity: 'raro'
  },
  {
    id: 'menorzin_envolvido',
    name: 'CRIME ORGANIZADO',
    imageUrl: `${BASE_URL}/menorzin_envolvido.png`,
    rarity: 'epico'
  },
  {
    id: 'macaco_sargento',
    name: 'mamaco sargento 22 🫡',
    imageUrl: `${BASE_URL}/macaco_sargento.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_estranho',
    name: 'OIE SOLTEIRA??',
    imageUrl: `${BASE_URL}/luiz_estranho.png`,
    rarity: 'raro'
  },
  {
    id: 'jhow_kkkk',
    name: 'eu vi minha foto',
    imageUrl: `${BASE_URL}/jhow_kkkk.png`,
    rarity: 'epico'
  },
  {
    id: 'jotinha',
    name: 'F JOTINHA',
    imageUrl: `${BASE_URL}/jotinha.png`,
    rarity: 'raro'
  },
  {
    id: 'eu_de',
    name: 'eu de oculos ae kkk',
    imageUrl: `${BASE_URL}/eu_de.png`,
    rarity: 'raro'
  },
  {
    id: 'gugu_mtoemo',
    name: 'voces nao me entendem',
    imageUrl: `${BASE_URL}/gugu_mtoemo.png`,
    rarity: 'raro'
  },
  {
    id: 'moises',
    name: 'Na reliquia do moises',
    imageUrl: `${BASE_URL}/moises.png`,
    rarity: 'epico'
  },
  {
    id: 'gabriel_mine',
    name: 'gabriel quadrado',
    imageUrl: `${BASE_URL}/gabriel_mine.png`,
    rarity: 'raro'
  },
  {
    id: 'jao_dog',
    name: 'jao dog mal 😈',
    imageUrl: `${BASE_URL}/jao_dog.png`,
    rarity: 'epico'
  },
  {
    id: 'taquinho',
    name: 'TACO???',
    imageUrl: `${BASE_URL}/taquinho.png`,
    rarity: 'epico'
  },
  {
    id: 'mumu_zika',
    name: 'MUMUZIKA 😁',
    imageUrl: `${BASE_URL}/mumu_zika.png`,
    rarity: 'raro'
  },
  {
    id: 'mano_meuvo',
    name: 'mano meu vo morreu',
    imageUrl: `${BASE_URL}/mano_meuvo.png`,
    rarity: 'raro'
  },
  {
    id: 'thanos',
    name: 'Thanos.',
    imageUrl: `${BASE_URL}/thanos.png`,
    rarity: 'epico'
  },
  {
    id: 'jhow_verao',
    name: 'JHOW CURTINDO VERAO',
    imageUrl: `${BASE_URL}/jhow_verao.png`,
    rarity: ''
  },
  {
    id: 'murilin_dnv',
    name: 'MURILO COVID',
    imageUrl: `${BASE_URL}/murilin_dnv.png`,
    rarity: 'raro'
  },
  {
    id: 'murilo_verao',
    name: 'Murilo curtindo verao',
    imageUrl: `${BASE_URL}/murilo_verao.png`,
    rarity: ''
  },
  {
    id: 'muri_espelho',
    name: 'muri no espelho',
    imageUrl: `${BASE_URL}/muri_espelho.png`,
    rarity: 'comum'
  },
  {
    id: 'murilo_vaqueiro',
    name: 'Murilo vaqueiro',
    imageUrl: `${BASE_URL}/murilo_vaqueiro.png`,
    rarity: 'epico'
  },
  {
    id: 'nanico_skol',
    name: 'NANICO E A LORA',
    imageUrl: `${BASE_URL}/nanico_skol.png`,
    rarity: 'comum'
  },
  {
    id: 'davy_jones',
    name: 'DAVY JONES',
    imageUrl: `${BASE_URL}/davy_jones.png`,
    rarity: 'comum'
  },
  {
    id: 'jhow_rato',
    name: 'JHOW RATO',
    imageUrl: `${BASE_URL}/jhow_rato.png`,
    rarity: 'comum'
  },
  {
    id: 'jhow_kfc',
    name: 'JHOW KFC EDITION',
    imageUrl: `${BASE_URL}/jhow_kfc.png`,
    rarity: 'raro'
  },
  {
    id: 'nanico_ifood',
    name: 'NANICO IFOOD',
    imageUrl: `${BASE_URL}/nanico_ifood.png`,
    rarity: 'epico'
  },
  {
    id: 'gugos_tec',
    name: 'tecnologia nenhuma',
    imageUrl: `${BASE_URL}/gugos_tec.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_smurf',
    name: 'luiz chupou um smurf',
    imageUrl: `${BASE_URL}/luiz_smurf.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_tranca',
    name: 'WAGNER LOVE',
    imageUrl: `${BASE_URL}/luiz_tranca.png`,
    rarity: 'comum'
  },
  {
    id: 'gugu_emo',
    name: 'gugu emo',
    imageUrl: `${BASE_URL}/gugu_emo.png`,
    rarity: 'comum'
  },
  {
    id: 'gugu_covid',
    name: 'gugu pandemico 🤧',
    imageUrl: `${BASE_URL}/gugu_covid.png`,
    rarity: 'comum'
  },
  {
    id: 'gugu_egirl',
    name: 'UIIIII',
    imageUrl: `${BASE_URL}/gugu_egirl.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_bebun',
    name: 'o luiz bebo kkkkk',
    imageUrl: `${BASE_URL}/luiz_bebun.png`,
    rarity: 'epico'
  },
  {
    id: 'gugu_verao',
    name: 'GUGU CURTINDO VERAO',
    imageUrl: `${BASE_URL}/gugu_verao.png`,
    rarity: 'epico'
  },
  {
    id: 'jao_festa',
    name: 'JAO FESTINHA',
    imageUrl: `${BASE_URL}/jao_festa.png`,
    rarity: 'comum'
  },
  {
    id: 'aphyr',
    name: 'APHYR',
    imageUrl: `${BASE_URL}/aphyr.png`,
    rarity: 'epico'
  },
  {
    id: 'igor_dabola',
    name: 'INGOLA DA BOLA',
    imageUrl: `${BASE_URL}/igor_dabola.png`,
    rarity: 'raro'
  },
  {
    id: 'zoio_bolso',
    name: 'ZOIO BORSONARO',
    imageUrl: `${BASE_URL}/zoio_bolso.png`,
    rarity: 'epico'
  },
  {
    id: 'gugu_gay',
    name: 'minha nossa senhora',
    imageUrl: `${BASE_URL}/gugu_gay.png`,
    rarity: 'raro'
  },
  {
    id: 'gugu_juju',
    name: 'gugu de juju',
    imageUrl: `${BASE_URL}/gugu_juju.png`,
    rarity: 'epico'
  },
  {
    id: 'luiz_dente',
    name: 'dentição sinistra',
    imageUrl: `${BASE_URL}/luiz_dente.png`,
    rarity: 'raro'
  },
  {
    id: 'jao_gold',
    name: 'JOASINEO GOLD VARIOS',
    imageUrl: `${BASE_URL}/jao_gold.png`,
    rarity: 'raro'
  },
  {
    id: 'luiz_aut',
    name: 'luiz autisto',
    imageUrl: `${BASE_URL}/luiz_aut.png`,
    rarity: 'comum'
  },
  {
    id: 'nanico_kog',
    name: 'nanico kogmaw',
    imageUrl: `${BASE_URL}/nanico_kog.png`,
    rarity: 'lendario'
  },
  {
    id: 'ritmo_fatal',
    name: 'eu sei disso',
    imageUrl: `${BASE_URL}/ritmo_fatal.png`,
    rarity: 'lendario'
   },
  {
    id: 'jhow_morto',
    name: 'JHOW MORREU!!!',
    imageUrl: `${BASE_URL}/jhow_morto.png`,
    rarity: 'raro'
   },
  {
    id: 'jhow_desaparecido',
    name: 'JHOW DESAPARECEU!!!',
    imageUrl: `${BASE_URL}/jhow_desaparecido.png`,
    rarity: 'raro'
   },
   {
    id: 'santa_ceia',
    name: 'judas esta entre nós...',
    imageUrl: `${BASE_URL}/santa_ceia.png`,
    rarity: 'comum'
   },
   {
    id: 'luiz_peitin',
    name: 'adoro quando chupam meu peitinho',
    imageUrl: `${BASE_URL}/luiz_peitin.png`,
    rarity: 'comum'
   },
  {
    id: 'murilo_fla',
    name: '😱😱😱',
    imageUrl: `${BASE_URL}/murilo_fla.png`,
    rarity: 'raro'
   },
   {
    id: 'muri_corte',
    name: 'murilo indiano',
    imageUrl: `${BASE_URL}/muri_corte.png`,
    rarity: 'lendario'
   },
   {
    id: 'tetas_lcs',
    name: 'luqinha boobs',
    imageUrl: `${BASE_URL}/tetas_lcs.png`,
    rarity: 'raro'
   },
   {
    id: 'luiz_davi',
    name: 'ta molhadinho é?',
    imageUrl: `${BASE_URL}/luiz_davi.png`,
    rarity: 'raro'
   },
   {
    id: 'gugu_gozo',
    name: 'quer leitinho ?',
    imageUrl: `${BASE_URL}/gugu_gozo.png`,
    rarity: 'comum'
    },
    {
     id: 'mumu_pidao',
     name: 'mimda um prato de comida',
     imageUrl: `${BASE_URL}/mumu_pidao.png`,
     rarity: 'raro'
    },
    {
     id: 'murilo_uber',
     name: 'MURILAO PRE UBER',
     imageUrl: `${BASE_URL}/murilo_uber.png`,
     rarity: 'comum'
    },
    {
     id: 'mumu_bert',
     name: 'MURILO BERT',
     imageUrl: `${BASE_URL}/mumu_bert.png`,
     rarity: 'raro'
    },
    {
     id: 'mumu_jardas',
     name: 'OLHAR DE MIL JARDAS',
     imageUrl: `${BASE_URL}/mumu_jardas.png`,
     rarity: 'raro'
    },
    {
     id: 'taco_calvo',
     name: 'NEM TENHO ENTRADA MAN',
     imageUrl: `${BASE_URL}/taco_calvo.png`,
     rarity: 'raro'
    },
    {
     id: 'familia_unida',
     name: 'familia unida',
     imageUrl: `${BASE_URL}/familia_unida.png`,
     rarity: 'raro'
    },
    {
      id: 'luiz_gozado',
      name: 'quer leitinho???',
      imageUrl: `${BASE_URL}/luiz_gozado.png`, 
      rarity: 'raro'
    },
    {
      id: 'itarare',
      name: 'Salto do itarare',
      imageUrl: `${BASE_URL}/itarare.png`, 
      rarity: 'raro',
    },
    {
      id: 'gugu_tial',
      name: 'hur dur nao bebo',
      imageUrl: `${BASE_URL}/gugu_tial.png`, 
      rarity: 'raro',
    },
    {
      id: 'trio_lendario',
      name: 'QUE RANÇOOOH',
      imageUrl: `${BASE_URL}/trio_lendario.png`, 
      rarity: 'epico',
    },
    {
      id: 'joao_doka',
      name: 'sidoka muito branco',
      imageUrl: `${BASE_URL}/joao_doka.png`, 
      rarity: 'epico',
    },
    {
      id: 'luiz_ejao',
      name: 'luiz e a branquinha',
      imageUrl: `${BASE_URL}/luiz_ejao.png`, 
      rarity: 'comum',
    },
    {
      id: 'gordo_branco',
      name: 'gordinho e a branquinha',
      imageUrl: `${BASE_URL}/gordo_branco.png`, 
      rarity: 'comum',
    },
    {
      id: 'obeso',
      name: 'OBESO',
      imageUrl: `${BASE_URL}/obeso.png`, 
      rarity: 'epico',
    },
    {
      id: 'chefe',
      name: 'chefe do nanico kkkkkk',
      imageUrl: `${BASE_URL}/chefe.png`, 
      rarity: 'raro',
    },
     {
      id: 'gugu_mijo',
      name: 'gugu mijano',
      imageUrl: `${BASE_URL}/gugu_mijo.png`, 
      rarity: 'comum',
    },
     {
      id: 'encontrado_morto',
      name: 'encontrado morto!! hoje cedo..',
      imageUrl: `${BASE_URL}/encontrado_morto.png`, 
      rarity: 'comum',
    },
     {
      id: 'celso_machado',
      name: 'OBRIGADO CELSO MACHADO',
      imageUrl: `${BASE_URL}/celso_machado.png`, 
      rarity: 'epico',
    },
     {
      id: 'clarinha',
      name: 'clarinha um poquinhjo',
      imageUrl: `${BASE_URL}/clarinha.png`, 
      rarity: 'comum',
    },
     {
      id: 'cavalo_foto',
      name: 'cavalo celular foto selfie',
      imageUrl: `${BASE_URL}/cavalo_foto.png`, 
      rarity: 'comum',
    },
     {
      id: 'luis_coringa',
      name: 'luis coringa HAHAHAHAH',
      imageUrl: `${BASE_URL}/luis_coringa.png`, 
      rarity: 'comum',
    },
    {
      id: 'luis_coringa',
      name: 'luis coringa HAHAHAHAH',
      imageUrl: `${BASE_URL}/luis_coringa.png`, 
      rarity: 'comum',
    },
     {
      id: 'cachorro_animal',
      name: 'O cachorro e o animal',
      imageUrl: `${BASE_URL}/cachorro_animal.png`, 
      rarity: 'comum',
    },
     {
      id: 'clarinha_jupiter',
      name: 'clarinha e jupiter',
      imageUrl: `${BASE_URL}/clarinha_jupiter.png`, 
      rarity: 'comum',
    },
      {
      id: 'luiz_lost',
      name: 'luiz lost midia',
      imageUrl: `${BASE_URL}/luiz_lost.png`, 
      rarity: 'comum',
    },
      {
      id: 'nesquik_luiz',
      name: 'NAPOLITANO',
      imageUrl: `${BASE_URL}/nesquik_luiz.png`, 
      rarity: 'epico',
    },
      {
      id: 'jao_chapeu',
      name: 'jao de shapeu',
      imageUrl: `${BASE_URL}/jao_chapeu.png`, 
      rarity: 'raro',
    },
      {
      id: 'jao_flo',
      name: 'jao flozinha',
      imageUrl: `${BASE_URL}/jao_flo.png`, 
      rarity: 'raro',
    },
      {
      id: 'gugu_xota',
      name: 'gugu shoshotero',
      imageUrl: `${BASE_URL}/gugu_xota.png`, 
      rarity: 'raro',
    },
      {
      id:'bolsonaro_',
      name: 'AINN BOLSONARO',
      imageUrl: `${BASE_URL}/bolsonaro_.png`, 
      rarity: 'raro',
    },
    {
      id: 'menor',
      name: 'GRANDE MENOR',
      imageUrl: `${BASE_URL}/menor.png`, 
      rarity: 'lendario',
    },
      {
      id: 'leo_taca',
      name: 'LAMPIAO DE JESUS CRISTO',
      imageUrl: `${BASE_URL}/leo_taca.png`, 
      rarity: 'raro',
    },
    {
      id: 'clara_maconha',
      name: 'CLARINHA MAKONHA 🍁🍁🍁',
      imageUrl: `${BASE_URL}/clara_maconha.png`, 
      rarity: 'raro',
    },
    {
      id: 'davi_brito',
      name: 'ARE WE STILL GUE',
      imageUrl: `${BASE_URL}/davi_brito.png`, 
      rarity: 'epico',
    },
    {
      id: 'gugu_demaua',
      name: 'GUGU DE MAUA',
      imageUrl: `${BASE_URL}/gugu_demaua.png`, 
      rarity: 'comum',
    },
    {
      id: 'rafiki_uber',
      name: 'RAFIKI UBER',
      imageUrl: `${BASE_URL}/rafiki_uber.png`, 
      rarity: 'raro',
    },
    {
      id: 'leo_carnaval',
      name: 'LEO CARNAVAL',
      imageUrl: `${BASE_URL}/leo_carnaval.png`, 
      rarity: 'raro',
    },
    {
      id: 'prende_passa',
      name: 'PRENDE E PASSA',
      imageUrl: `${BASE_URL}/prende_passa.png`, 
      rarity: 'raro',
    },
    {
      id: 'gabriel_garcom',
      name: 'GABRIEL GARÇÃO',
      imageUrl: `${BASE_URL}/gabriel_garcom.png`, 
      rarity: 'epico',
    },
];

export function drawUniqueCards(qtd, pool = cardsPool) {
  if (qtd > pool.length) {
    throw new Error('Quantidade maior que o número de cartas disponíveis.');
  }

  // agrupa cartas por raridade
  const byRarity = pool.reduce((acc, card) => {
    if (!acc[card.rarity]) acc[card.rarity] = [];
    acc[card.rarity].push(card);
    return acc;
  }, {});

  const usedIds = new Set();
  const result = [];

  for (let i = 0; i < qtd; i++) {
    let chosen = null;
    let attempts = 0;

    while (!chosen && attempts < 10) {
      const rarity = pickRarityByWeight();
      const list = (byRarity[rarity] || []).filter(
        (c) => !usedIds.has(c.id)
      );

      if (list.length > 0) {
        chosen = list[Math.floor(Math.random() * list.length)];
        break;
      }

      attempts++;
    }

    if (!chosen) {
      const remaining = pool.filter((c) => !usedIds.has(c.id));
      if (remaining.length === 0) break;
      chosen = remaining[Math.floor(Math.random() * remaining.length)];
    }

    usedIds.add(chosen.id);
    result.push(chosen);
  }

  return result;
}
