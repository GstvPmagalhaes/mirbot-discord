

export const rarities = {
  comum:    { label: 'Comum 🟩',    color: '#10c400' }, 
  raro:     { label: 'Raro 🔷',     color: '#0099ff' },
  epico:    { label: 'Épico 🟣',    color: '#b700ff' },
  lendario: { label: 'Lendário ⭐', color: '#ffdf5d' },
  supremo:  { label: 'SUPREMO 👹', color: '#fd0000' },
  daily:  { label: 'MITICO 👑', color: '#00fdf0' },
};


export const rarityWeights = {
  comum: 70,
  raro: 15,   
  epico: 10,
  lendario: 1,
  supremo: 0.5
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
    id: 'hojenao',
    name: 'Hoje nao amigao, tenta amanha',
    imageUrl: `${BASE_URL}/hojenao.png`, 
    rarity: 'comum'
  },
  {
    id: 'dragon_lore',
    name: 'DRAGON LORE',
    imageUrl: `${BASE_URL}/dragon_lore.png`, 
    rarity: 'daily'
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
    id: 'jao_ovo',
    name: 'COMO É Q CES TA VIADO ÓO OS CARA',
    imageUrl: `${BASE_URL}/jao_ovo.png`, 
    rarity: 'epico'
  },
  {
    id: 'andriew2',
    name: 'KKKKKKKKKKKKKK',
    imageUrl: `${BASE_URL}/andriew2.png`, 
    rarity: 'raro'
  },
  {
    id: 'igortalaras',
    name: 'ALMOCO NA CASA DO AMIGO E A ESPOSA ESTAVA UMA DELICIA',
    imageUrl: `${BASE_URL}/igortalaras.png`, 
    rarity: 'raro'
  },
  {
    id: 'meda10centavo',
    name: 'ME DA 10 CENTAVO',
    imageUrl: `${BASE_URL}/meda10centavo.png`, 
    rarity: 'lendario'
  },
  {
    id: 'sim_eujogo',
    name: 'SIM',
    imageUrl: `${BASE_URL}/sim_eujogo.png`, 
    rarity: 'comum'
  },
  {
    id: 'psicopata',
    name: 'psicopata',
    imageUrl: `${BASE_URL}/psicopata.png`, 
    rarity: 'comum'
  },  
  {
    id: 'luto_lilpeep',
    name: 'NGM OUVE LIL PEEP NA QUEBRADA',
    imageUrl: `${BASE_URL}/luto_lilpeep.png`, 
    rarity: 'raro'
  },  
  {
    id: 'vou_ficar',
    name: 'n lembro q imagem q eh kkk',
    imageUrl: `${BASE_URL}/vou_ficar.png`, 
    rarity: 'comum'
  },  
  {
    id: 'smurf_domuca',
    name: 'SMURF DO MUCA',
    imageUrl: `${BASE_URL}/smurf_domuca.png`, 
    rarity: 'raro'
  },
  {
    id: 'galo_macaco',
    name: 'a natureza eh linda',
    imageUrl: `${BASE_URL}/galo_macaco.png`, 
    rarity: 'epico'
  },
  {
    id: 'rato_makonha',
    name: 'RATO MAKONHA',
    imageUrl: `${BASE_URL}/rato_makonha.png`, 
    rarity: 'lendario'
  },  
  {
    id: 'cachorro_honda',
    name: 'novo modelo honda',
    imageUrl: `${BASE_URL}/cachorro_honda.png`, 
    rarity: 'raro'
  },  
  {
    id: 'impressionant',
    name: 'impressionant',
    imageUrl: `${BASE_URL}/impressionant.png`, 
    rarity: 'comum'
  },  
  {
    id: 'saborearo',
    name: 'saborearo',
    imageUrl: `${BASE_URL}/saborearo.png`, 
    rarity: 'comum'
  },
  {
    id: 'macaco_banza',
    name: 'macaco banza',
    imageUrl: `${BASE_URL}/macaco_banza.png`, 
    rarity: 'comum'
  },
  {
    id: 'garotos_viados',
    name: 'garotos viados',
    imageUrl: `${BASE_URL}/garotos_viados.png`, 
    rarity: 'comum'
  },
  {
    id: 'crianca',
    name: 'menino abensoado',
    imageUrl: `${BASE_URL}/crianca.png`, 
    rarity: 'comum'
  },
  {
    id: 'caguei_nascalca',
    name: 'caguei nascalca',
    imageUrl: `${BASE_URL}/caguei_nascalca.png`, 
    rarity: 'comum'
  },
  {
    id: 'idolo',
    name: 'idolo',
    imageUrl: `${BASE_URL}/idolo.png`, 
    rarity: 'comum'
  },
  {
    id: 'adonadessa',
    name: 'FIQUE LIGADO',
    imageUrl: `${BASE_URL}/adonadessa.png`, 
    rarity: 'comum'
  },
  {
    id: 'leoai',
    name: 'LITERALMENTE O LEO',
    imageUrl: `${BASE_URL}/leoai.png`, 
    rarity: 'comum'
  },
  {
    id: 'pradaocu',
    name: 'pra isso eles sao bons',
    imageUrl: `${BASE_URL}/pradaocu.png`, 
    rarity: 'comum'
  },
  {
    id: 'cagueinapia',
    name: 'NOTICIA CHATA',
    imageUrl: `${BASE_URL}/cagueinapia.png`, 
    rarity: 'comum'
  },
  {
    id: 'gayficalonge',
    name: 'MANTENHA DISTANCIA',
    imageUrl: `${BASE_URL}/gayficalonge.png`, 
    rarity: 'comum'
  },
  {
    id: 'falaportugues',
    name: 'faz favor',
    imageUrl: `${BASE_URL}/falaportugues.png`, 
    rarity: 'comum'
  },
  {
    id: 'afaste',
    name: 'fique longe',
    imageUrl: `${BASE_URL}/afaste.png`, 
    rarity: 'comum'
  },
  {
    id: 'gaviaoj5',
    name: 'gaviao do J5',
    imageUrl: `${BASE_URL}/gaviaoj5.png`, 
    rarity: 'epico'
  },
  {
    id: 'perceba',
    name: 'PERCEBA',
    imageUrl: `${BASE_URL}/perceba.png`, 
    rarity: 'comum'
  },
  {
    id: 'medigaentao',
    name: 'ME DIGA ENTAO',
    imageUrl: `${BASE_URL}/medigaentao.png`, 
    rarity: 'lendario'
  },
  {
    id: 'apodreca',
    name: 'APODREÇA',
    imageUrl: `${BASE_URL}/apodreca.png`, 
    rarity: 'comum'
  },
  {
    id: 'vivemos',
    name: 'vivemos em uma sociedade',
    imageUrl: `${BASE_URL}/vivemos.png`, 
    rarity: 'comum'
  },
  {
    id: 'boanoitecaralho',
    name: 'BOA NOITE CARALHO',
    imageUrl: `${BASE_URL}/boanoitecaralho.png`, 
    rarity: 'raro'
  },
  {
    id: 'alisamento',
    name: 'ALISAMENTO',
    imageUrl: `${BASE_URL}/alisamento.png`, 
    rarity: 'comum'
  },
  {
    id: 'taxandoate',
    name: 'TAXANDO ATE O ULTIMO',
    imageUrl: `${BASE_URL}/taxandoate.png`, 
    rarity: 'comum'
  },
  {
    id: 'planetados',
    name: 'PLANETA DOS TAXADOS',
    imageUrl: `${BASE_URL}/planetados.png`, 
    rarity: 'comum'
  },
  {
    id: 'tributage',
    name: 'TRIBUTAGE',
    imageUrl: `${BASE_URL}/tributage.png`, 
    rarity: 'comum'
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
    id: 'ditado',
    name: 'EXISTE',
    imageUrl: `${BASE_URL}/ditado.png`, 
    rarity: 'raro'
  },
  {
    id: 'fato_assustador',
    name: 'EXISTE UM LUGAR',
    imageUrl: `${BASE_URL}/fato_assustador.png`, 
    rarity: 'lendario'
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
    id: 'degue',
    name: 'TEM DE QUE',
    imageUrl: `${BASE_URL}/degue.png`, 
    rarity: 'lendario'
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
    id: 'nanico_sol',
    name: 'NANICO CLT',
    imageUrl: `${BASE_URL}/nanico_sol.png`,
    rarity: 'raro'
  },
  {
    id: 'godzilla',
    name: 'kkkkkkkkkkkkk',
    imageUrl: `${BASE_URL}/godzilla.png`,
    rarity: 'supremo'
  },
  {
    id: 'luqinha_god',
    name: 'luqinha amem',
    imageUrl: `${BASE_URL}/luqinha_god.png`,
    rarity: 'epico'
  },
  {
    id: 'marea_turbo',
    name: 'MAREA TURBO',
    imageUrl: `${BASE_URL}/marea_turbo.png`,
    rarity: 'raro'
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
    id: 'gabriel_mine',
    name: 'gabriel quadrado',
    imageUrl: `${BASE_URL}/gabriel_mine.png`,
    rarity: 'raro'
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
    rarity: 'raro'
  },
  {
    id: 'gatinho_lolo',
    name: 'ENCHE DE LOLO',
    imageUrl: `${BASE_URL}/gatinho_lolo.jpg`,
    rarity: 'raro'
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
    id: 'davy_jones',
    name: 'DAVY JONES',
    imageUrl: `${BASE_URL}/davy_jones.png`,
    rarity: 'comum'
  },
  {
    id: 'jhow_kfc',
    name: 'JHOW KFC EDITION',
    imageUrl: `${BASE_URL}/jhow_kfc.png`,
    rarity: 'raro'
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
    id: 'igor_dabola',
    name: 'INGOLA DA BOLA',
    imageUrl: `${BASE_URL}/igor_dabola.png`,
    rarity: 'raro'
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
    rarity: 'lendario'
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
     id: 'mumu_pidao',
     name: 'mimda um prato de comida',
     imageUrl: `${BASE_URL}/mumu_pidao.png`,
     rarity: 'raro'
    },
    {
     id: 'mumu_jardas',
     name: 'OLHAR DE MIL JARDAS',
     imageUrl: `${BASE_URL}/mumu_jardas.png`,
     rarity: 'raro'
    },
    {
     id: 'x1_cartola',
     name: 'ACORDA AI TU TAMEN FELADAPUTA',
     imageUrl: `${BASE_URL}/x1_cartola.png`,
     rarity: 'supremo'
    },
    {
     id: 'demiurgo',
     name: 'DEMIURGO',
     imageUrl: `${BASE_URL}/demiurgo.png`,
     rarity: 'lendario'
    },
    {
     id: 'cachorro_moto',
     name: 'CARAMELO NA MOTOCA',
     imageUrl: `${BASE_URL}/cachorro_moto.png`,
     rarity: 'raro'
    },
    {
     id: 'onca_pintuda',
     name: 'ONÇA PINTUDA',
     imageUrl: `${BASE_URL}/onca_pintuda.png`,
     rarity: 'epico'
    },
    {
     id: 'mimdepapai',
     name: 'MEU FI QUE CACHAÇA',
     imageUrl: `${BASE_URL}/mimdepapai.png`,
     rarity: 'lendario'
    },
    {
     id: 'fallenzao_aqui',
     name: 'FALLENZAO NA AREA',
     imageUrl: `${BASE_URL}/fallenzao_aqui.png`,
     rarity: 'lendario'
    },
    {
     id: 'goku_20',
     name: 'GOKU SSJ 20',
     imageUrl: `${BASE_URL}/goku_20.png`,
     rarity: 'epico'
    },
    {
     id: 'vodormir',
     name: 'falo vo dormir',
     imageUrl: `${BASE_URL}/vodormir.png`,
     rarity: 'comum'
    },
    {
     id: 'toonline',
     name: 'to online',
     imageUrl: `${BASE_URL}/toonline.png`,
     rarity: 'comum'
    },
    {
     id: 'eutruce',
     name: 'EU TRUCE',
     imageUrl: `${BASE_URL}/eutruce.png`,
     rarity: 'comum'
    },
    {
     id: 'pormim',
     name: 'POR MIM!!',
     imageUrl: `${BASE_URL}/pormim.png`,
     rarity: 'raro'
    },
    {
     id: 'quesefoda',
     name: 'que se foda',
     imageUrl: `${BASE_URL}/pormim.png`,
     rarity: 'comum'
    },
    {
     id: 'eugozei',
     name: 'GOSEI',
     imageUrl: `${BASE_URL}/eugozei.png`,
     rarity: 'comum'
    },
    {
     id: 'apunheta',
     name: 'ela foi..',
     imageUrl: `${BASE_URL}/apunheta.png`,
     rarity: 'comum'
    },
    {
     id: 'oefeito',
     name: 'SOB O EFEITO DO PRODUCT',
     imageUrl: `${BASE_URL}/oefeito.png`,
     rarity: 'comum'
    },
    {
     id: 'aicemalo',
     name: 'AI CE MALO RATON',
     imageUrl: `${BASE_URL}/aicemalo.png`,
     rarity: 'comum'
    },
    {
     id: 'sorria',
     name: 'SURRIA',
     imageUrl: `${BASE_URL}/sorria.png`,
     rarity: 'comum'
    },
    {
     id: 'eutrosse',
     name: 'EU TRUSSE',
     imageUrl: `${BASE_URL}/eutrosse.png`,
     rarity: 'comum'
    },
    {
     id: 'poggers',
     name: 'POGGERS',
     imageUrl: `${BASE_URL}/poggers.png`,
     rarity: 'comum'
    },
    {
     id: 'vapo',
     name: 'EH VAPO CARAI',
     imageUrl: `${BASE_URL}/vapo.png`,
     rarity: 'comum'
    },
    {
     id: 'desista',
     name: 'MORRA',
     imageUrl: `${BASE_URL}/desista.png`,
     rarity: 'comum'
    },
    {
     id: 'duascerveja',
     name: 'QUEM NUNCA',
     imageUrl: `${BASE_URL}/duascerveja.png`,
     rarity: 'comum'
    },
    {
     id: 'umamedica',
     name: 'uma medica',
     imageUrl: `${BASE_URL}/umamedica.png`,
     rarity: 'comum'
    },
    {
     id: 'monark',
     name: 'ACORDA CARA JA COMEÇOU!!',
     imageUrl: `${BASE_URL}/monark.png`,
     rarity: 'raro'
    },
    {
     id: 'hamood',
     name: 'hamood😔',
     imageUrl: `${BASE_URL}/hamood.png`,
     rarity: 'lendario'
    },
    {
     id: 'fodasefilhote',
     name: 'fodasefilhote',
     imageUrl: `${BASE_URL}/fodasefilhote.png`,
     rarity: 'raro'
    },
    {
     id: 'bebeporra',
     name: 'bebeporra',
     imageUrl: `${BASE_URL}/bebeporra.png`,
     rarity: 'raro'
    },
    {
     id: 'kogos_templario',
     name: 'KOGOS TEMPLARIO',
     imageUrl: `${BASE_URL}/kogos_templario.png`,
     rarity: 'epico'
    },
    {
     id: 'bolso_mosquito',
     name: 'BOLSONARIO MOSQUITO',
     imageUrl: `${BASE_URL}/bolso_mosquito.png`,
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
      id: 'cavalo_foto',
      name: 'cavalo celular foto selfie',
      imageUrl: `${BASE_URL}/cavalo_foto.png`, 
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
