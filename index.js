import 'dotenv/config';
import sharp from 'sharp';
import fetch from 'node-fetch';
import { MessageFlags } from 'discord.js';
import { promises as fs } from 'fs';
import { getRarityMeta, drawUniqueCards, cardsPool  } from './utils/images.js';
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  EmbedBuilder,
} from 'discord.js';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection em Promise:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

//batalhas
const battles = new Map();
const BATTLE_TIMEOUT = 2 * 60 * 1000;
const DAILY_FILE = './daily.json';
let dailyClaims = new Map();

// cooldown e inventário
const REPEAT_PAGE_SIZE = 10;
const cooldowns = new Map(); // userId -> timestamp
const INVENTORY_FILE = './inventory.json';
const PAGE_SIZE = 10; 
let inventory = new Map();
const sessions = new Map();  // sessionId -> { userId, options, messageId }

function buildRepeatPage(userId, page = 1) {
  const userInventory = inventory.get(userId) || [];

  // agrupa por id
  const map = new Map();
  for (const card of userInventory) {
    const entry = map.get(card.id) || { card, count: 0 };
    entry.count += 1;
    map.set(card.id, entry);
  }

  // filtra só repetidas
  const repetidas = [...map.values()].filter((e) => e.count > 1);
  const total = repetidas.length;

  if (total === 0) {
    return {
      content: '🔁 Você não tem cartas repetidas.',
      components: []
    };
  }

  const totalPages = Math.max(1, Math.ceil(total / REPEAT_PAGE_SIZE));
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * REPEAT_PAGE_SIZE;
  const end = start + REPEAT_PAGE_SIZE;
  const slice = repetidas.slice(start, end);

  const lines = slice.map((e, i) => {
    const meta = getRarityMeta(e.card);
    return `${start + i + 1}. ${e.card.name} — ${meta.label} (x${e.count})  [\`${e.card.id}\`]`;
  });

  const header =
    `🔁 **Cartas repetidas:** (${total} no total) — pág. ${page}/${totalPages}\n`;

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`repeat:${userId}:${page}:first`)
      .setLabel('≪')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`repeat:${userId}:${page}:prev`)
      .setLabel('<')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`repeat:${userId}:${page}:next`)
      .setLabel('>')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === totalPages),
    new ButtonBuilder()
      .setCustomId(`repeat:${userId}:${page}:last`)
      .setLabel('≫')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === totalPages)
  );

  return {
    content: header + lines.join('\n'),
    components: [row]
  };
}

const DAILY_COMMON_CARD_ID = 'hoje_oceu';
const DAILY_JACKPOT_CARD_ID = 'gatinho_lendario';

function findCardById(cardId) {
  return cardsPool.find((c) => c.id === cardId);
}

async function loadDailyClaims() {
  try {
    const data = await fs.readFile(DAILY_FILE, 'utf8');
    const obj = JSON.parse(data);
    dailyClaims = new Map(Object.entries(obj));
    console.log(`Daily carregado: ${dailyClaims.size} usuário(s).`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Nenhum daily salvo ainda, começando do zero.');
    } else {
      console.error('Erro ao carregar daily:', err);
    }
  }
}

  function getSaoPauloDateKey() {
    const dtf = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dtf.format(new Date()); // "YYYY-MM-DD"
  }

  async function saveDailyClaims() {
    try {
      const obj = Object.fromEntries(dailyClaims);
      await fs.writeFile(DAILY_FILE, JSON.stringify(obj, null, 2), 'utf8');
    } catch (err) {
      console.error('Erro ao salvar daily:', err);
    }
  }
  await loadInventory();
  await loadDailyClaims();
  client.login(process.env.DISCORD_TOKEN);

function buildInventoryPage(userId, page = 1, filter = 'all') {
  const userInventory = inventory.get(userId) || [];
  const total = userInventory.length;

  // contagem por raridade no inventário inteiro
  const rarityCounts = userInventory.reduce(
    (acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      return acc;
    },
    {}
  );

  const comumCount    = rarityCounts.comum    || 0;
  const raroCount     = rarityCounts.raro     || 0;
  const epicoCount    = rarityCounts.epico    || 0;
  const lendarioCount = rarityCounts.lendario || 0;
  const supremoCount = rarityCounts.supremo || 0;

  // aplica filtro na lista pra exibir
  let displayInventory = userInventory;
  let filterLabel = 'todas';
  switch (filter) {
    case 'comum':
      displayInventory = userInventory.filter((c) => c.rarity === 'comum');
      filterLabel = 'comuns';
      break;
    case 'raro':
      displayInventory = userInventory.filter((c) => c.rarity === 'raro');
      filterLabel = 'raros';
      break;
    case 'epico':
      displayInventory = userInventory.filter((c) => c.rarity === 'epico');
      filterLabel = 'épicos';
      break;
    case 'lendario':
      displayInventory = userInventory.filter((c) => c.rarity === 'lendario');
      filterLabel = 'lendários';
      break;
    case 'supremo':
      displayInventory = userInventory.filter((c) => c.rarity === 'supremo');
      filterLabel = 'supremos';
      break;
    default:
      filter = 'all';
      break;
  }

  const filteredTotal = displayInventory.length;
  const totalPages = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = displayInventory.slice(start, end);

  const lines = slice.map((card, i) => {
    // index global com base na lista FILTRADA
    const indexGlobal = start + i + 1;
    const meta = getRarityMeta(card);
    return `${indexGlobal}. ${card.name} — ${meta.label}`;
  });

  const header =
    `📦 **Suas cartas** (filtro: ${filterLabel}) ` +
    `(**COMUM**: ${comumCount} | **RARO**: ${raroCount} | **EPICA**: ${epicoCount} | **LENDARIA**: ${lendarioCount}) | **SUPREMA**: ${supremoCount})` +
    `— ${total} no total — pág. ${page}/${totalPages}`;

  const content =
    lines.length > 0 ? header + '\n' + lines.join('\n') : header + '\n_(sem cartas nessa página)_';

  // botões guardam também o filtro
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`inv:${userId}:${page}:${filter}:first`)
      .setLabel('≪')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`inv:${userId}:${page}:${filter}:prev`)
      .setLabel('<')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 1),
    new ButtonBuilder()
      .setCustomId(`inv:${userId}:${page}:${filter}:next`)
      .setLabel('>')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === totalPages),
    new ButtonBuilder()
      .setCustomId(`inv:${userId}:${page}:${filter}:last`)
      .setLabel('≫')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === totalPages)
  );

  return {
    content,
    components: [row],
  };
}

async function loadInventory() {
  try {
    const data = await fs.readFile(INVENTORY_FILE, 'utf8');
    const obj = JSON.parse(data);

    // obj = { "userId1": [cards...], "userId2": [...] }
    inventory = new Map(
      Object.entries(obj).map(([userId, cards]) => [userId, cards])
    );

    console.log(`Inventário carregado: ${inventory.size} usuário(s).`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Nenhum inventário salvo ainda, começando do zero.');
    } else {
      console.error('Erro ao carregar inventário:', err);
    }
  }
}

async function saveInventory() {
  try {
    const obj = Object.fromEntries(inventory); // Map -> objeto plano
    await fs.writeFile(
      INVENTORY_FILE,
      JSON.stringify(obj, null, 2),
      'utf8'
    );
    // console.log('Inventário salvo.');
  } catch (err) {
    console.error('Erro ao salvar inventário:', err);
  }
}

const COOLDOWN_MS = 8 * 60 * 1000;

function createSessionId() {
  return `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
}

client.once(Events.ClientReady, () => {
  console.log(`Logado como ${client.user.tag} (ID: ${client.user.id})`);
});


async function createDropImage(cards) {
    console.log(
    'Drop atual:',
    cards.map((c) => `${c.id}`)
  );


  // Tamanhos "premium"
  const border = 20;          // borda colorida ao redor da carta
  const cardWidth = 650;      // largura interna da arte
  const cardHeight = 850;     // altura interna da arte
  const renderWidth = cardWidth + border * 2;
  const renderHeight = cardHeight + border * 2;

  const gapX = 40;            // espaço horizontal entre as cartas
  const marginTop = 40;       // topo da área das cartas
  const marginBottom = 40;    // espaço embaixo
  const labelHeight = 70;     // altura da faixa de texto abaixo de cada carta

  // Largura total necessária pros cards
  const totalRowWidth = cards.length * renderWidth + (cards.length - 1) * gapX;

  // Canvas "grande" o suficiente, mas mínimo 1024px de largura
  const canvasWidth = Math.max(1024, totalRowWidth + gapX * 2);
  const canvasHeight =
    marginTop + renderHeight + 20 + labelHeight + marginBottom;

  const base = sharp({
    create: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
      // fundo bem escuro, estiloso
      background: '#050509',
    },
  });

  const composites = [];

  // Centraliza o conjunto de cartas
  const startX = Math.floor((canvasWidth - totalRowWidth) / 2);
  const cardTop = marginTop;
  const labelTop = cardTop + renderHeight + 20;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const meta = getRarityMeta(card);

    console.log(
      `Processando carta ${i + 1}: id=${card.id}`
    );

    try {
    // 1) baixa a imagem da carta
    const res = await fetch(card.imageUrl);
    const buf = Buffer.from(await res.arrayBuffer());

    // 2) redimensiona pra tamanho interno
    const cardInner = await sharp(buf)
      .resize(cardWidth, cardHeight, { fit: 'cover' })
      .png()
      .toBuffer();

    // 3) adiciona borda de raridade em volta
    const bordered = await sharp({
      create: {
        width: renderWidth,
        height: renderHeight,
        channels: 4,
        background: meta.color, // cor da raridade
      },
    })
      .composite([{ input: cardInner, left: border, top: border }])
      .png()
      .toBuffer();

    // 4) cria uma sombra "fake" por trás da carta
    const shadow = await sharp({
      create: {
        width: renderWidth,
        height: renderHeight,
        channels: 4,
        background: '#c4c4c41e',
      },
    })
      .png()
      .blur(25)
      .toBuffer();

    const left = startX + i * (renderWidth + gapX);

    // 4.1) aplica sombra primeiro (com offset)
    composites.push({
      input: shadow,
      left: left + 18,
      top: cardTop + 18,
      blend: 'over',
      opacity: 0.45,
    });

    // 4.2) depois a carta com borda
    composites.push({
      input: bordered,
      left,
      top: cardTop,
    });

    // 5) faixa com nome + raridade em SVG abaixo da carta
    const labelSvg = createCardLabelSvg(card, renderWidth, labelHeight);
    composites.push({
      input: labelSvg,
      left,
      top: labelTop,
    });
  } catch (err) {
      console.error(
        'Erro ao montar imagem da carta',
        card.id,
        err
      );
      throw err; // mantém o erro pra você ver no console
    }
  }
  const finalBuffer = await base.composite(composites).png().toBuffer();

  const fileName = `drop_${Date.now()}.png`;
  const attachment = new AttachmentBuilder(finalBuffer, { name: fileName });

  return { attachment, fileName };
} 

function escapeSvgText(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createCardLabelSvg(card, width, height) {
  const meta = getRarityMeta(card);
  const safeName = escapeSvgText(card.name);
  const safeRarity = escapeSvgText(meta.label);

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="labelBg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.9)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.6)" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" rx="18" ry="18" fill="url(#labelBg)" />
      <text
        x="50%"
        y="45%"
        text-anchor="middle"
        fill="#ffffff"
        font-size="26"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        ${safeName}
      </text>
      <text
        x="50%"
        y="78%"
        text-anchor="middle"
        fill="${meta.color}"
        font-size="20"
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        ${safeRarity}
      </text>
    </svg>
  `;

  return Buffer.from(svg);
}

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  const raw = message.content.trim();
  const content = raw.toLowerCase();
  const userId = message.author.id;

  if (content === '!repetidas') {
    const payload = buildRepeatPage(userId, 1);
    await message.reply(payload);
    return;
  }

  //BAFAO
  if (content.startsWith('!bafao')) {
    const parts = raw.split(/\s+/);
    if (parts.length < 3) {
      message.reply('Uso: `!bafao @pessoa id_da_carta`');
      return;
    }

    const target = message.mentions.users.first();
    if (!target) {
      message.reply('Você precisa mencionar alguém.');
      return;
    }

    const cardId = parts[2];
    const desafianteId = message.author.id;
    const alvoId = target.id;

    if (desafianteId === alvoId) {
      message.reply('Você não pode desafiar você mesmo, paizão 😂');
      return;
    }

    // verifica carta do desafiante
    const inv = inventory.get(desafianteId) || [];
    const cartaDesafiante = inv.find((c) => c.id === cardId);

    if (!cartaDesafiante) {
      message.reply('Você não tem essa carta para apostar.');
      return;
    }

    // cria chave
    const key = `${desafianteId}:${alvoId}`;
    if (battles.has(key)) {
      message.reply('Já existe um bafão pendente entre vocês!');
      return;
    }

    const battle = {
      desafianteId,
      alvoId,
      cartaDesafiante,
      cartaAlvo: null,
      status: 'waiting',
      createdAt: Date.now(),
    };

    battles.set(key, battle);

    // timeout automatico
    setTimeout(() => {
      const b = battles.get(key);
      if (b && b.status === 'waiting') {
        battles.delete(key);
        message.channel.send(`⏳ O bafão entre <@${desafianteId}> e <@${alvoId}> expirou.`);
      }
    }, BATTLE_TIMEOUT);

    message.reply(
      `🔥 **BAFÃO INICIADO!**\n\n` +
      `<@${alvoId}> foi desafiado por <@${desafianteId}>!\n` +
      `Aposta: **${cartaDesafiante.name}**\n\n` +
      `Para aceitar, use:\n` +
      `\`!aceitarbafao id_da_carta @${message.author.username}\``
    );

    return;
  }

  if (content.startsWith('!aceitarbafao')) {
    const parts = raw.split(/\s+/);
    if (parts.length < 3) {
      message.reply('Uso: `!aceitarbafao id_da_carta @pessoa`');
      return;
    }

    const cartaIdAlvo = parts[1];
    const desafiante = message.mentions.users.first();

    if (!desafiante) {
      message.reply('Você precisa mencionar o desafiante.');
      return;
    }

    const alvoId = message.author.id;
    const desafianteId = desafiante.id;

    const key = `${desafianteId}:${alvoId}`;
    const battle = battles.get(key);

    if (!battle) {
      message.reply('Não existe bafão pendente com essa pessoa.');
      return;
    }

    // verifica carta do alvo
    const invAlvo = inventory.get(alvoId) || [];
    const cartaAlvo = invAlvo.find((c) => c.id === cartaIdAlvo);

    if (!cartaAlvo) {
      message.reply('Você não tem essa carta para apostar.');
      return;
    }

    // completa batalha
    battle.cartaAlvo = cartaAlvo;
    battle.status = 'ready';

    // decide vencedor
    const winnerId =
      Math.random() < 0.5 ? desafianteId : alvoId;
    const loserId = winnerId === desafianteId ? alvoId : desafianteId;

    const cartaPerdida =
      loserId === desafianteId
        ? battle.cartaDesafiante
        : battle.cartaAlvo;

    // retira 1 cópia do perdedor
    const loserInv = inventory.get(loserId) || [];
    const idx = loserInv.findIndex((c) => c.id === cartaPerdida.id);
    if (idx !== -1) loserInv.splice(idx, 1);
    inventory.set(loserId, loserInv);

    // adiciona ao vencedor
    const winnerInv = inventory.get(winnerId) || [];
    winnerInv.push(cartaPerdida);
    inventory.set(winnerId, winnerInv);

    await saveInventory();

    battles.delete(key);

    message.channel.send(
      `⚔️ **RAPELÔ ZÉ** ⚔️\n\n` +
      `🎉 **Vencedor:** <@${winnerId}>\n` +
      `😵 **otario kkkk:** <@${loserId}>\n\n` +
      `💳 Carta apostada: **${cartaPerdida.name}**\n` +
      `A carta foi transferida do perdedor para o vencedor!`
    );

    return;
  }

  // ---- COMANDO DROP ----
  if (content === 'as') {
    const now = Date.now();
    const lastUse = cooldowns.get(userId) || 0;
    const diff = now - lastUse;

    if (diff < COOLDOWN_MS) {
      const remaining = COOLDOWN_MS - diff;
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      await message.reply(
        `UIUIUI TA ANSIOSO É? Faltam **${minutes}m ${seconds}s** pro próximo drop.`
      );
      return;
    }

    cooldowns.set(userId, now);

    // sorteia 3 cartas
    const options = drawUniqueCards(3);
    const sessionId = createSessionId();

    const { attachment, fileName } = await createDropImage(options);

    const embed = new EmbedBuilder()
      .setTitle('🎴 **DROPANDO...\n\n CLICA NA IMAGEM PRA VER MELHOR AS CARTA**')
      .setDescription('Escolhe a carta ae animal.\n\n ▪️▪️Carta 1️⃣▪️▪️▪️▪️▪️Carta 2️⃣▪️▪️▪️▪️Carta 3️⃣')
      .setImage(`attachment://${fileName}`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:0`)
        .setLabel('1')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:1`)
        .setLabel('2')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:2`)
        .setLabel('3')
        .setStyle(ButtonStyle.Primary)
    );

    const reply = await message.reply({
      embeds: [embed],
      components: [row],
      files: [attachment],
    });

    sessions.set(sessionId, {
      userId,
      options,
      messageId: reply.id,
      createdAt: now,
    });
  }


  if (content === '!daily' || content === '!caixa') {
  const today = getSaoPauloDateKey();
  const last = dailyClaims.get(userId);

  if (last === today) {
    await message.reply('📦 Você já abriu a caixa de hoje pae. Volta amanhã.');
    return;
  }

  const commonCard = findCardById(DAILY_COMMON_CARD_ID);
  const jackpotCard = findCardById(DAILY_JACKPOT_CARD_ID);

  if (!commonCard || !jackpotCard) {
    await message.reply('Erro: carta(s) da caixa diária não configurada(s).');
    return;
  }

  // 1% jackpot
  const roll = Math.random();
  const won = roll < 0.07 ? jackpotCard : commonCard;

  // adiciona direto no inventário
  const inv = inventory.get(userId) || [];
  inv.push(won);
  inventory.set(userId, inv);

  // marca claim do dia e persiste tudo
  dailyClaims.set(userId, today);
  await saveInventory();
  await saveDailyClaims();

  const meta = getRarityMeta(won);

  await message.reply(
    `🎁 **Caixa diária aberta!**\n` +
    `Você ganhou: **${won.name}** — ${meta.label}\n` +
    `Agora você tem **${inv.length}** carta(s) no inventário.`
  );
  return;
}

  // ---- COMANDO INVENTÁRIO ----
    if (content.startsWith('!inv')) {
    const userInventory = inventory.get(userId) || [];
    console.log(userInventory);
    if (userInventory.length === 0) {
      await message.reply('📦 Seu inventário ta vazio, pae.');
      return;
    }

    const parts = raw.split(/\s+/);
    let filter = 'all';

    if (parts.length >= 2) {
      const arg = parts[1].toLowerCase();

      if (arg === 'comuns' || arg === 'comum') filter = 'comum';
      if (arg === 'raros' || arg === 'raro') filter = 'raro';
      if (arg === 'epicos' || arg === 'epico') filter = 'epico';
      if (arg === 'lendarios' || arg === 'lendario') filter = 'lendario';
      if (arg === 'supremos' || arg === 'supremo') filter = 'supremo';
    }

    const payload = buildInventoryPage(userId, 1, filter);
    await message.reply(payload);
    return;
  }

  if (content === '!comandos') {
    await message.reply(
      '**📜 GUIA DE COMANDOS DO MIRBOT:**\n\n' +
      '🎴 **Dropar cartas**\n' +
      '→ `as`\n' +
      'Dropa uma leva de 3 cartas.\n\n' +

      '📦 **Inventário**\n' +
      '→ `!inv`\n' +
      'Mostra todas as suas cartas com paginação.\n\n' +
      '→ `!inv raros`, `!inv epicos`, `!inv lendarios`, `!inv comuns`\n' +
      'Filtra o inventário por raridade.\n\n' +
      '→ `!card <n>`\n' +
      'Mostra a carta **n** do seu inventário em destaque.\n\n' +

      '🔁 **Cartas Repetidas**\n' +
      '→ `!repetidas`\n' +
      'Mostra todas as cartas que você tem duplicadas, com paginação.\n\n' +

      '⚔️ **Batalha / Bafão**\n' +
      '→ `!bafao @usuario <id_da_carta>`\n' +
      'Desafia alguém para um X1 valendo cartas.\n\n' +
      '→ `!aceitarbafao <id_da_carta> @usuario`\n' +
      'Aceita o desafio e inicia a batalha (50/50). O vencedor leva a carta apostada.\n\n' 
    );
    return;
  }

   if (content.startsWith('!card')) {
    const parts = raw.split(/\s+/);
    if (parts.length < 2) {
      await message.reply('Uso: `!card <número da carta no inventário>`');
      return;
    }

    const index = parseInt(parts[1], 10);
    if (Number.isNaN(index) || index < 1) {
      await message.reply('Informe um número válido, tipo `!card 1`.');
      return;
    }

    const userInventory = inventory.get(userId) || [];
    if (userInventory.length === 0) {
      await message.reply('Você não tem nenhuma carta no inventário ainda.');
      return;
    }

    const pos = index - 1;
    if (pos >= userInventory.length) {
      await message.reply(
        `Você só tem **${userInventory.length}** carta(s).`
      );
      return;
    }

    const card = userInventory[pos];
    const meta = getRarityMeta(card);

    const embed = new EmbedBuilder()
      .setTitle(`${card.name} — ${meta.label}`)
      .setImage(card.imageUrl)
      .setColor(meta.color);

    await message.reply({ embeds: [embed] });
    return;
  }
});

// ---- HANDLER DOS BOTÕES ----
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  const parts = interaction.customId.split(':');
  const prefix = parts[0];

  if (prefix === 'repeat') {
  const [, ownerId, pageStr, action] = parts;

  if (interaction.user.id !== ownerId) {
    return interaction.reply({
      content: 'Essas repetidas não são suas, pai 😂',
      ephemeral: true
    });
  }

  const userInventory = inventory.get(ownerId) || [];
  if (userInventory.length === 0) {
    return interaction.update({
      content: '🔁 Você não tem cartas repetidas.',
      components: []
    });
  }

  // descobrir total de repetidas (pois a paginação depende disso)
  const map = new Map();
  for (const card of userInventory) {
    const entry = map.get(card.id) || { card, count: 0 };
    entry.count += 1;
    map.set(card.id, entry);
  }
  const repetidas = [...map.values()].filter((e) => e.count > 1);
  const total = repetidas.length;
  const totalPages = Math.max(1, Math.ceil(total / REPEAT_PAGE_SIZE));

  const currentPage = parseInt(pageStr, 10);
  let newPage = currentPage;

  switch (action) {
    case 'first':
      newPage = 1;
      break;
    case 'prev':
      newPage = Math.max(1, currentPage - 1);
      break;
    case 'next':
      newPage = Math.min(totalPages, currentPage + 1);
      break;
    case 'last':
      newPage = totalPages;
      break;
  }

  const payload = buildRepeatPage(ownerId, newPage);

  try {
    await interaction.update(payload);
  } catch (err) {
    console.error('Erro ao atualizar página repetidas:', err);
  }

  return;
}

  // 1) PAGINAÇÃO DO INVENTÁRIO
  if (prefix === 'inv') {
    const [, ownerId, pageStr, filter, action] = parts;
    
    // só o dono navega no inventário
    if (interaction.user.id !== ownerId) {
      try {
        await interaction.reply({
          content: 'Esse inventário não é seu, paizão 😅',
          ephemeral: true,
        });
      } catch (err) {
        console.error('Erro ao responder inventário de outro usuário:', err);
      }
      return;
    }

    const userInventory = inventory.get(ownerId) || [];
    if (userInventory.length === 0) {
      try {
        await interaction.update({
          content: '📦 Seu inventário está vazio, pae.',
          components: [],
        });
      } catch (err) {
        console.error('Erro ao atualizar inventário vazio:', err);
      }
      return;
    }

    const filtered = (() => {
      if (filter === 'comum') return userInventory.filter((c) => c.rarity === 'comum');
      if (filter === 'raro') return userInventory.filter((c) => c.rarity === 'raro');
      if (filter === 'epico') return userInventory.filter((c) => c.rarity === 'epico');
      if (filter === 'lendario') return userInventory.filter((c) => c.rarity === 'lendario');
      return userInventory;
    })();

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
    const currentPage = parseInt(pageStr, 10) || 1;

    let newPage = currentPage;
    switch (action) {
      case 'first':
        newPage = 1;
        break;
      case 'prev':
        newPage = Math.max(1, currentPage - 1);
        break;
      case 'next':
        newPage = Math.min(totalPages, currentPage + 1);
        break;
      case 'last':
        newPage = totalPages;
        break;
      default:
        break;
    }

    const payload = buildInventoryPage(ownerId, newPage, filter);
    try {
      await interaction.update(payload);
    } catch (err) {
      console.error('Erro ao atualizar página do inventário:', err);
    }

    return;
  }

  // 2) ESCOLHA DE CARTA DO DROP
  if (prefix !== 'card') return;

  const [, sessionId, idxStr] = parts;

  const session = sessions.get(sessionId);
  if (!session) {
    await interaction.reply({
      content: 'Sessão expirada ou inválida.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  // só o dono do drop pode clicar
  if (interaction.user.id !== session.userId) {
    await interaction.reply({
      content: 'Tá tentano roubar carta do zótro safado? Pode não, pai.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const idx = Number(idxStr);
  const chosen = session.options[idx];

  const userInventory = inventory.get(session.userId) || [];
  userInventory.push(chosen);
  inventory.set(session.userId, userInventory);

  await saveInventory();
  sessions.delete(sessionId);

  // desabilita botões
  try {
    const channel = await interaction.client.channels.fetch(interaction.channelId);
    const msg = await channel.messages.fetch(session.messageId);

    const disabledRow = new ActionRowBuilder().addComponents(
      msg.components[0].components.map((btn) =>
        ButtonBuilder.from(btn).setDisabled(true)
      )
    );

    await msg.edit({ components: [disabledRow] });
  } catch (e) {
    console.error('Erro ao desabilitar botões:', e);
  }

  await interaction.reply({
    content: `Você escolheu: **${chosen.name}** 🎉\nAgora você tem **${
      inventory.get(session.userId).length
    }** carta(s) no inventário. Digita !card ${inventory.get(session.userId).length} pra ver sua nova cartinha`,
    flags: MessageFlags.Ephemeral,
  });
});

await loadInventory();
client.login(process.env.DISCORD_TOKEN);
