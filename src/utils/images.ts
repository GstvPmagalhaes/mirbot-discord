export const rarities = {
  comum:    { label: 'Comum 🟩',    color: '#15ff00' }, 
  raro:     { label: 'Raro 🔷',     color: '#00ccff' },
  epico:    { label: 'Épico 🟣',    color: '#c637ff' },
  lendario: { label: 'Lendário ⭐', color: '#fcac00' },
  supremo:  { label: 'SUPREMO 👹', color: '#fd0000' },
  manos:    { label: 'MANOS 😶‍🌫️', color: '#ffffff' },
  daily:   { label: 'MITICO 👑', color: '#00fdf0' },
  mitico:  { label: 'MÍTICO 👑', color: '#00fdf0' },
} as const;

export type Rarity = keyof typeof rarities | '';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  rarity: Rarity;
}


export const rarityWeights = {
  comum: 70,
  raro: 15,   
  epico: 10,
  manos: 7,
  lendario: 1.5,
  supremo: 0.8
};

function pickRarityByWeight(): Rarity {
  const entries = Object.entries(rarityWeights); 
  const total = entries.reduce((acc, [, w]) => acc + w, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of entries) {
    if (roll < weight) return rarity as Rarity;
    roll -= weight;
  }

  return 'comum';
}

export function getRarityMeta(card: Card) {
  if (card.rarity in rarities) {
    return rarities[card.rarity as keyof typeof rarities];
  }

  return rarities.comum;
}

export const CARD_ASSET_BASE_URL = 'https://raw.githubusercontent.com/GstvPmagalhaes/mirbot-cards/refs/heads/main/cards';
const BASE_URL = CARD_ASSET_BASE_URL;

export const cardsPool: Card[] = [
  {
    id: 'howl',
    name: 'M4 HOWL',
    imageUrl: `${BASE_URL}/howl.png`,
    rarity: 'supremo'
  },
  {
    id: 'tiraamaodomeucabelo',
    name: 'TIRA A MAO DO MEU CABELO',
    imageUrl: `${BASE_URL}/tiraamaodomeucabelo.png`,
    rarity: 'lendario'
  },
    {
    id: 'criansachinesa',
    name: 'criansa chinesa',
    imageUrl: `${BASE_URL}/criansachinesa.png`,
    rarity: 'supremo'
  },
  {
    id: 'essecaraaiehfoda',
    name: 'esse cara ai eh foda',
    imageUrl: `${BASE_URL}/essecaraaiehfoda.png`,
    rarity: 'raro'
  },
  {
    id: 'falamaisalto',
    name: 'falamaisalto',
    imageUrl: `${BASE_URL}/falamaisalto.png`,
    rarity: 'comum'
  },
  {
    id: 'pombosupremo',
    name: 'pombo supremo',
    imageUrl: `${BASE_URL}/pombosupremo.png`,
    rarity: 'supremo'
  },
  {
    id: 'cachorrocabelo',
    name: 'cachorro cabelo',
    imageUrl: `${BASE_URL}/cachorrocabelo.png`,
    rarity: 'comum'
  },
  {
    id: 'heisenberg',
    name: 'heisenberg',
    imageUrl: `${BASE_URL}/heisenberg.png`,
    rarity: 'comum'
  },
  {
    id: 'analise',
    name: 'analise...',
    imageUrl: `${BASE_URL}/analise.png`,
    rarity: 'epico'
  },
  {
    id: 'vcsentemeunegro',
    name: 'vc me sente?',
    imageUrl: `${BASE_URL}/vcsentemeunegro.png`,
    rarity: 'comum'
  },
  {
    id: 'paromano',
    name: 'T',
    imageUrl: `${BASE_URL}/paromano.png`,
    rarity: 'epico'
  },
  {
    id: 'butterfly_doppler',
    name: 'butterfly_doppler',
    imageUrl: `${BASE_URL}/butterfly_doppler.png`,
    rarity: 'lendario'
  },
  {
    id: 'awp_gungnir',
    name: 'awp_gungnir',
    imageUrl: `${BASE_URL}/awp_gungnir.png`,
    rarity: 'lendario'
  },
  {
    id: 'evitocagar',
    name: 'evito cagar p nao ficar de barriga vazia',
    imageUrl: `${BASE_URL}/evitocagar.png`,
    rarity: 'comum'
  },
  {
    id: '5000videos',
    name: 'VIRGINIA CARLINHOS MAIA E NEYMAR',
    imageUrl: `${BASE_URL}/5000videos.png`,
    rarity: 'raro'
  },
  {
    id: 'bluezaopai',
    name: 'papai e mamae *-*',
    imageUrl: `${BASE_URL}/bluezaopai.png`,
    rarity: 'epico'
  },
  {
    id: 'parabenscemig',
    name: 'PARABENS CORTADOR DE LUZ',
    imageUrl: `${BASE_URL}/parabenscemig.png`,
    rarity: 'comum'
  },
  {
    id: 'caiunapiscina',
    name: 'VO PULA DE TENIS E TUDO MANÉ',
    imageUrl: `${BASE_URL}/caiunapiscina.png`,
    rarity: 'lendario'
  },
  {
    id: 'pqpitaipava',
    name: 'PQP DNV ITAIPAVA',
    imageUrl: `${BASE_URL}/pqpitaipava.png`,
    rarity: 'comum'
  },
  {
    id: 'tempaoai',
    name: 'TEM PAO AI????',
    imageUrl: `${BASE_URL}/tempaoai.png`,
    rarity: 'lendario'
  },
  {
    id: 'awp_asiimov',
    name: 'awp_asiimov',
    imageUrl: `${BASE_URL}/awp_asiimov.png`,
    rarity: 'supremo'
  },
  {
    id: 'marca_nao_randola',
    name: 'marca_nao_randola',
    imageUrl: `${BASE_URL}/marca_nao_randola.png`,
    rarity: 'comum'
  },
  {
    id: 'hoje_estareinoplantao',
    name: 'hoje estarei no plantas',
    imageUrl: `${BASE_URL}/hoje_estareinoplantao.png`,
    rarity: 'comum'
  },
  {
    id: 'naoseiondeestarei',
    name: 'apenas nao sei',
    imageUrl: `${BASE_URL}/naoseiondeestarei.png`,
    rarity: 'comum'
  },
  {
    id: 'apenasonline',
    name: 'somente via whatsapp',
    imageUrl: `${BASE_URL}/apenasonline.png`,
    rarity: 'comum'
  },
  {
    id: 'estareinaadega',
    name: 'hoje eh dia',
    imageUrl: `${BASE_URL}/estareinaadega.png`,
    rarity: 'comum'
  },
  {
    id: 'seupai',
    name: 'isso eh corintias',
    imageUrl: `${BASE_URL}/seupai.png`,
    rarity: 'comum'
  },
  {
    id: 'issoehcoringao',
    name: 'isso eh corintias2',
    imageUrl: `${BASE_URL}/issoehcoringao.png`,
    rarity: 'raro'
  },
  {
    id: 'mandataxar',
    name: 'mandataxar',
    imageUrl: `${BASE_URL}/mandataxar.png`,
    rarity: 'comum'
  },
  {
    id: 'tomajack',
    name: 'tomajacklanches',
    imageUrl: `${BASE_URL}/tomajack.png`,
    rarity: 'epico'
  },
  {
    id: 'impostossa',
    name: 'impostos SA',
    imageUrl: `${BASE_URL}/impostossa.png`,
    rarity: 'comum'
  },
  {
    id: 'bomsabado',
    name: 'fala galera',
    imageUrl: `${BASE_URL}/bomsabado.png`,
    rarity: 'comum'
  },
  {
    id: 'maisvcehchato',
    name: 'maisvcehchatoheinbot',
    imageUrl: `${BASE_URL}/maisvcehchato.png`,
    rarity: 'raro'
  },
  {
    id: 'estounofrifas',
    name: 'estarei no frifas',
    imageUrl: `${BASE_URL}/estounofrifas.png`,
    rarity: 'comum'
  },
  {
    id: 'pavilhao',
    name: 'pavilhao',
    imageUrl: `${BASE_URL}/pavilhao.png`,
    rarity: 'comum'
  },
  {
    id: 'nessedomingo',
    name: 'AMEM',
    imageUrl: `${BASE_URL}/nessedomingo.png`,
    rarity: 'comum'
  },
  {
    id: 'vegetacria',
    name: 'vegeta cria',
    imageUrl: `${BASE_URL}/vegetacria.png`,
    rarity: 'epico'
  },
  {
    id: 'vegetacria',
    name: 'vegeta cria',
    imageUrl: `${BASE_URL}/vegetacria.png`,
    rarity: 'epico'
  },
  {
    id: 'atentese',
    name: 'cuidado',
    imageUrl: `${BASE_URL}/atentese.png`,
    rarity: 'comum'
  },
  {
    id: 'xerecarefri',
    name: 'xereca',
    imageUrl: `${BASE_URL}/xerecarefri.png`,
    rarity: 'comum'
  },
  {
    id: 'loucosmanutencao',
    name: 'loucos da manutencao',
    imageUrl: `${BASE_URL}/loucosmanutencao.png`,
    rarity: 'lendario'
  },
  {
    id: 'sucatapinto',
    name: 'sucatapinto',
    imageUrl: `${BASE_URL}/sucatapinto.png`,
    rarity: 'comum'
  },
  {
    id: 'vendo2penis',
    name: 'vendo2penis',
    imageUrl: `${BASE_URL}/vendo2penis.png`,
    rarity: 'comum'
  },
  {
    id: 'animaisagua',
    name: 'MEU DEUS!!! :O',
    imageUrl: `${BASE_URL}/animaisagua.png`,
    rarity: 'comum'
  },
  {
    id: 'umhomem',
    name: 'kkkkkkkkkkkkkkkk',
    imageUrl: `${BASE_URL}/umhomem.png`,
    rarity: 'epico'
  },
  {
    id: 'naoseinadadepassaros',
    name: 'essa é boa',
    imageUrl: `${BASE_URL}/naoseinadadepassaros.png`,
    rarity: 'comum'
  },
   {
    id: 'seprostituino',
    name: 'seprostituino',
    imageUrl: `${BASE_URL}/seprostituino.png`,
    rarity: 'comum'
  },
  {
    id: 'depressaomata',
    name: 'depressao mata',
    imageUrl: `${BASE_URL}/depressaomata.png`,
    rarity: 'comum'
  },
  {
    id: 'oquevcfariamcgui',
    name: 'seja sincero',
    imageUrl: `${BASE_URL}/oquevcfariamcgui.png`,
    rarity: 'comum'
  },
  {
    id: 'euesuamae',
    name: 'eu e suamae',
    imageUrl: `${BASE_URL}/euesuamae.png`,
    rarity: 'comum'
  },
  {
    id: 'vemdepv',
    name: 'luiz ai kkkkkkk',
    imageUrl: `${BASE_URL}/vemdepv.png`,
    rarity: 'comum'
  },
  {
    id: 'delegadodacu',
    name: 'delegadodacu',
    imageUrl: `${BASE_URL}/delegadodacu.png`,
    rarity: 'comum'
  },
  {
    id: 'emsuahouse',
    name: 'hein',
    imageUrl: `${BASE_URL}/emsuahouse.png`,
    rarity: 'comum'
  },
  {
    id: 'quemsorriu',
    name: 'VAI CHORAR NA MINHA.',
    imageUrl: `${BASE_URL}/quemsorriu.png`,
    rarity: 'raro'
  },
  {
    id: 'comediantessao',
    name: 'eles são',
    imageUrl: `${BASE_URL}/comediantessao.png`,
    rarity: 'raro'
  },
  {
    id: 'curasenhor',
    name: 'curasenhor',
    imageUrl: `${BASE_URL}/curasenhor.png`,
    rarity: 'raro'
  },
  {
    id: 'eutenhoansiedade',
    name: 'primeiramente vadia',
    imageUrl: `${BASE_URL}/eutenhoansiedade.png`,
    rarity: 'epico'
  },
  {
    id: 'tamoscano',
    name: 'EAI BROWN tamoscano',
    imageUrl: `${BASE_URL}/tamoscano.png`,
    rarity: 'epico'
  },
  {
    id: 'itachi',
    name: 'itachi',
    imageUrl: `${BASE_URL}/itachi.png`,
    rarity: 'comum'
  },
  {
    id: 'mtotriste',
    name: 'mtotriste',
    imageUrl: `${BASE_URL}/mtotriste.png`,
    rarity: 'comum'
  },
  {
    id: 'vcehasitaico',
    name: 'vcehasitaico',
    imageUrl: `${BASE_URL}/vcehasitaico.png`,
    rarity: 'comum'
  },
  {
    id: 'loucoesonhador',
    name: 'loucoesonhador',
    imageUrl: `${BASE_URL}/loucoesonhador.png`,
    rarity: 'comum'
  },
  {
    id: 'ronca_puta',
    name: 'ronca_puta',
    imageUrl: `${BASE_URL}/ronca_puta.png`,
    rarity: 'raro'
  },
  {
    id: 'cachorro_safado',
    name: 'cachorro_safado',
    imageUrl: `${BASE_URL}/cachorro_safado.png`,
    rarity: 'comum'
  },
  {
    id: 'sperma_fumante',
    name: 'sperma_fumante',
    imageUrl: `${BASE_URL}/sperma_fumante.png`,
    rarity: 'epico'
  },
  {
    id: 'lagarta_fumante',
    name: 'lagarta_fumante',
    imageUrl: `${BASE_URL}/lagarta_fumante.png`,
    rarity: 'raro'
  },
  {
    id: 'minion_bolado',
    name: 'minion_bolado',
    imageUrl: `${BASE_URL}/minion_bolado.png`,
    rarity: 'comum'
  },
  {
    id: 'lebron_james',
    name: 'lebron_james',
    imageUrl: `${BASE_URL}/lebron_james.png`,
    rarity: 'comum'
  },
  {
    id: 'trump',
    name: 'trump',
    imageUrl: `${BASE_URL}/trump.png`,
    rarity: 'comum'
  },
  {
    id: 'ememen',
    name: 'ememen',
    imageUrl: `${BASE_URL}/ememen.png`,
    rarity: 'comum'
  },
  {
    id: 'sofico_comloiras',
    name: 'sofico_comloiras',
    imageUrl: `${BASE_URL}/sofico_comloiras.png`,
    rarity: 'comum'
  },
  {
    id: 'flor_preta',
    name: 'flor_preta',
    imageUrl: `${BASE_URL}/flor_preta.png`,
    rarity: 'epico'
  },
  {
    id: 'reflita',
    name: 'reflita',
    imageUrl: `${BASE_URL}/reflita.png`,
    rarity: 'comum'
  },
  {
    id: 'josias_tog',
    name: 'josias_tog',
    imageUrl: `${BASE_URL}/josias_tog.png`,
    rarity: 'epico'
  },
  {
    id: 'bolso_gordinha',
    name: 'bolso_gordinha',
    imageUrl: `${BASE_URL}/bolso_gordinha.png`,
    rarity: 'comum'
  },
  {
    id: 'macaco_gang',
    name: 'macaco_gang',
    imageUrl: `${BASE_URL}/macaco_gang.png`,
    rarity: 'lendario'
  },
  {
    id: 'nao_raspe',
    name: 'nao_raspe',
    imageUrl: `${BASE_URL}/nao_raspe.png`,
    rarity: 'comum'
  },
  {
    id: 'saudade_dezoa',
    name: 'saudade_dezoa',
    imageUrl: `${BASE_URL}/saudade_dezoa.png`,
    rarity: 'epico'
  },
  {
    id: 'era_umjeferson',
    name: 'era_umjeferson',
    imageUrl: `${BASE_URL}/era_umjeferson.png`,
    rarity: 'comum'
  },
  {
    id: 'riram_dele',
    name: 'riram_dele',
    imageUrl: `${BASE_URL}/riram_dele.png`,
    rarity: 'comum'
  },
  {
    id: 'me_leve',
    name: 'me_leve',
    imageUrl: `${BASE_URL}/me_leve.png`,
    rarity: 'comum'
  },
  {
    id: 'obgd_khazix',
    name: 'obgd_khazix',
    imageUrl: `${BASE_URL}/obgd_khazix.png`,
    rarity: 'comum'
  },
  {
    id: 'kendrick',
    name: 'kendrick',
    imageUrl: `${BASE_URL}/kendrick.png`,
    rarity: 'comum'
  },
  {
    id: 'goku_tatuage',
    name: 'goku_tatuage',
    imageUrl: `${BASE_URL}/goku_tatuage.png`,
    rarity: 'lendario'
  },
  {
    id: 'galo_vinganca',
    name: 'galo_vinganca',
    imageUrl: `${BASE_URL}/galo_vinganca.png`,
    rarity: 'supremo'
  },
  {
    id: 'caguei_protime',
    name: 'caguei_protime',
    imageUrl: `${BASE_URL}/caguei_protime.png`,
    rarity: 'comum'
  },
  {
    id: 'hoje_oceu',
    name: 'hoje_oceu',
    imageUrl: `${BASE_URL}/hoje_oceu.png`,
    rarity: 'comum'
  },
  {
    id: 'estacionamento',
    name: 'estacionamento',
    imageUrl: `${BASE_URL}/estacionamento.png`,
    rarity: 'raro'
  },
  {
    id: 'estudano_patch',
    name: 'estudano_patch',
    imageUrl: `${BASE_URL}/estudano_patch.png`,
    rarity: 'comum'
  },
  {
    id: 'temnei_mortadela',
    name: 'temnei_mortadela',
    imageUrl: `${BASE_URL}/temnei_mortadela.png`,
    rarity: 'raro'
  },
  {
    id: 'mc_respeito',
    name: 'mc_respeito',
    imageUrl: `${BASE_URL}/mc_respeito.png`,
    rarity: 'comum'
  },
  {
    id: 'semquerer_ansioso',
    name: 'semquerer_ansioso',
    imageUrl: `${BASE_URL}/semquerer_ansioso.png`,
    rarity: 'comum'
  },
  {
    id: 'ja_fragueize',
    name: 'ja_fragueize',
    imageUrl: `${BASE_URL}/ja_fragueize.png`,
    rarity: 'epico'
  },
  {
    id: 'essa_mulekada',
    name: 'essa_mulekada',
    imageUrl: `${BASE_URL}/essa_mulekada.png`,
    rarity: 'epico'
  },
  {
    id: 'foi_odiddy',
    name: 'foi_odiddy',
    imageUrl: `${BASE_URL}/foi_odiddy.png`,
    rarity: 'raro'
  },
  {
    id: 'nasus_level',
    name: 'nasus_level',
    imageUrl: `${BASE_URL}/nasus_level.png`,
    rarity: 'raro'
  },
  {
    id: 'pm_fdp',
    name: 'pm_fdp',
    imageUrl: `${BASE_URL}/pm_fdp.png`,
    rarity: 'comum'
  },
  {
    id: 'amanha_sereimorto',
    name: 'amanha_sereimorto',
    imageUrl: `${BASE_URL}/amanha_sereimorto.png`,
    rarity: 'comum'
  },
  {
    id: 'rato_ovudo',
    name: 'rato_ovudo',
    imageUrl: `${BASE_URL}/rato_ovudo.png`,
    rarity: 'raro'
  },
  {
    id: 'zoidegato',
    name: 'zoidegato',
    imageUrl: `${BASE_URL}/zoidegato.png`,
    rarity: 'lendario'
  },
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
    id: 'bobsponja',
    name: 'bobsponja',
    imageUrl: `${BASE_URL}/bobsponja.png`, 
    rarity: 'comum'
  },
  {
    id: 'jogador',
    name: '"jogador"',
    imageUrl: `${BASE_URL}/jogador.png`, 
    rarity: 'raro'
  },
  {
    id: 'mining',
    name: 'mining',
    imageUrl: `${BASE_URL}/mining.png`, 
    rarity: 'comum'
  },
  {
    id: 'nqz',
    name: 'nqz',
    imageUrl: `${BASE_URL}/nqzcabecudo.png`, 
    rarity: 'comum'
  },
  {
    id: 'comprei5',
    name: 'comprei 5',
    imageUrl: `${BASE_URL}/comprei5.png`, 
    rarity: 'comum'
  },
  {
    id: 'sorteiovastilarva',
    name: 'sorteiovastilarva',
    imageUrl: `${BASE_URL}/sorteiovastilarva.png`, 
    rarity: 'epico'
  },
  {
    id: 'nemehdoano',
    name: 'nem eh do ano',
    imageUrl: `${BASE_URL}/nemehdoano.png`, 
    rarity: 'lendario'
  },
  {
    id: 'somorreuplay',
    name: 'so morreu playboy',
    imageUrl: `${BASE_URL}/somorreuplay.png`, 
    rarity: 'raro'
  },
  {
    id: 'pastorcris',
    name: 'QUANDO SO FALTA',
    imageUrl: `${BASE_URL}/pastorcris.png`, 
    rarity: 'comum'
  },
  {
    id: 'ehmolodoy',
    name: 'É MOLODOY OU N EH',
    imageUrl: `${BASE_URL}/ehmolodoy.png`, 
    rarity: 'raro'
  },
  {
    id: 'negaobonito',
    name: 'aprenda luiz',
    imageUrl: `${BASE_URL}/negaobonito.png`, 
    rarity: 'comum'
  },
  {
    id: 'molodoyateamorte',
    name: 'ATE A MORTE',
    imageUrl: `${BASE_URL}/molodoyateamorte.png`, 
    rarity: 'raro'
  },
  {
    id: 'paidesantofdp',
    name: 'pai de santo fdp',
    imageUrl: `${BASE_URL}/paidesantofdp.png`, 
    rarity: 'comum'
  },
  {
    id: 'naomexecagang',
    name: 'nao mexe c a gang',
    imageUrl: `${BASE_URL}/naomexecagang.png`, 
    rarity: 'supremo'
  },
  {
    id: 'fuckdapolice',
    name: 'fuck da police',
    imageUrl: `${BASE_URL}/fuckdapolice.png`, 
    rarity: 'comum'
  },
  {
    id: 'ripobama',
    name: 'rip obama',
    imageUrl: `${BASE_URL}/ripobama.png`, 
    rarity: 'comum'
  },
  {
    id: 'anal',
    name: 'anal 🔥',
    imageUrl: `${BASE_URL}/anal.png`, 
    rarity: 'comum'
  },
  {
    id: 'legepstein',
    name: 'leg epstein',
    imageUrl: `${BASE_URL}/legepstein.png`, 
    rarity: 'comum'
  },
  {
    id: 'doutorhouse',
    name: 'doutorhouse',
    imageUrl: `${BASE_URL}/doutorhouse.png`, 
    rarity: 'comum'
  },
  {
    id: 'comunismo',
    name: 'comunismo',
    imageUrl: `${BASE_URL}/comunismo.jpg`, 
    rarity: 'daily'
  },
  {
    id: 'putsss',
    name: 'putsss',
    imageUrl: `${BASE_URL}/putsss.png`, 
    rarity: 'comum'
  },
  {
    id: 'aidento',
    name: 'aidento',
    imageUrl: `${BASE_URL}/aidento.png`, 
    rarity: 'epico'
  },
  {
    id: 'davisoline',
    name: 'davisoline',
    imageUrl: `${BASE_URL}/davisoline.png`, 
    rarity: 'supremo'
  },
  {
    id: 'tijoleiro',
    name: 'tijoleiro',
    imageUrl: `${BASE_URL}/tijoleiro.png`, 
    rarity: 'comum'
  },
  {
    id: 'coringafrase',
    name: 'coringafrases',
    imageUrl: `${BASE_URL}/coringafrase.png`, 
    rarity: 'comum'
  },
  {
    id: 'umamulher',
    name: 'nunca subestime',
    imageUrl: `${BASE_URL}/umamulher.png`, 
    rarity: 'raro'
  },
  {
    id: 'tvnova',
    name: 'tvnova',
    imageUrl: `${BASE_URL}/tvnova.png`, 
    rarity: 'comum'
  },
  {
    id: 'aoenem',
    name: 'ao enem aquele abraso',
    imageUrl: `${BASE_URL}/aoenem.png`, 
    rarity: 'lendario'
  },
  {
    id: 'aparentementesealuga',
    name: 'aparentemente se aluga',
    imageUrl: `${BASE_URL}/aparentementesealuga.png`, 
    rarity: 'comum'
  },
  {
    id: 'tomaseumardito',
    name: 'toma seu mardito',
    imageUrl: `${BASE_URL}/tomaseumardito.png`, 
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
    {
      id: 'exodiacabeca',
      name: 'Cabeça de Exodia',
      imageUrl: `${BASE_URL}/exodiacabeca.jpg`,
      rarity: 'lendario',
    },
    {
      id: 'exodiamaodireita',
      name: 'Braço Direito de Exodia',
      imageUrl: `${BASE_URL}/exodiamaodireita.jpg`,
      rarity: 'lendario',
    },
    {
      id: 'exodiamaoesquerda',
      name: 'Braço Esquerdo de Exodia',
      imageUrl: `${BASE_URL}/exodiamaoesquerda.jpg`,
      rarity: 'lendario',
    },
    {
      id: 'exodiapernadireita',
      name: 'Perna Direita de Exodia',
      imageUrl: `${BASE_URL}/exodiapernadireita.jpg`,
      rarity: 'lendario',
    },
    {
      id: 'exodiapernaesquerda',
      name: 'Perna Esquerda de Exodia',
      imageUrl: `${BASE_URL}/exodiapernaesquerda.jpg`,
      rarity: 'lendario',
    },
];

export function drawUniqueCards(qtd: number, pool: Card[] = cardsPool): Card[] {
  if (qtd > pool.length) {
    throw new Error('Quantidade maior que o número de cartas disponíveis.');
  }

  // agrupa cartas por raridade
  const byRarity = pool.reduce<Record<string, Card[]>>((acc, card) => {
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
