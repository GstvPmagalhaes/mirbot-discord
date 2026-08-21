import 'dotenv/config';
import { MessageFlags } from 'discord.js';
import { promises as fs } from 'node:fs';
import { getRarityMeta, drawUniqueCards, cardsPool  } from './utils/images.js';
import type { Card } from './utils/images.js';
import { renderDropImage } from './drop-image.js';
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

process.on('unhandledRejection', (reason) => {
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
interface Battle {
  desafianteId: string;
  alvoId: string;
  cartaDesafiante: Card;
  cartaAlvo: Card | null;
  status: 'waiting' | 'ready';
  createdAt: number;
}

interface DropSession {
  userId: string;
  options: Card[];
  messageId: string;
  createdAt: number;
}

interface RepeatedCard {
  card: Card;
  count: number;
}

const battles = new Map<string, Battle>();
const BATTLE_TIMEOUT = 2 * 60 * 1000;
const DAILY_FILE = './daily.json';
let dailyClaims = new Map<string, string>();

// cooldown e inventário
const REPEAT_PAGE_SIZE = 10;
const cooldowns = new Map<string, number>(); // userId -> timestamp
const INVENTORY_FILE = './inventory.json';
const PAGE_SIZE = 10; 
let inventory = new Map<string, Card[]>();
const sessions = new Map<string, DropSession>();

function buildRepeatPage(userId: string, page = 1) {
  const userInventory = inventory.get(userId) || [];

  // agrupa por id
  const map = new Map<string, RepeatedCard>();
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

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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

const DAILY_COMMON_CARD_ID = 'vivemos';
const DAILY_JACKPOT_CARD_ID = 'comunismo';

function findCardById(cardId: string) {
  return cardsPool.find((c) => c.id === cardId);
}

async function loadDailyClaims() {
  try {
    const data = await fs.readFile(DAILY_FILE, 'utf8');
    const obj = JSON.parse(data) as Record<string, string>;
    dailyClaims = new Map(Object.entries(obj));
    console.log(`Daily carregado: ${dailyClaims.size} usuário(s).`);
  } catch (err) {
    if (isNodeError(err) && err.code === 'ENOENT') {
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
      await writeJsonAtomically(DAILY_FILE, obj);
    } catch (err) {
      console.error('Erro ao salvar daily:', err);
    }
  }
function buildInventoryPage(userId: string, page = 1, filter = 'all') {
  const userInventory = inventory.get(userId) || [];
  const total = userInventory.length;

  // contagem por raridade no inventário inteiro
  const rarityCounts = userInventory.reduce<Record<string, number>>(
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
  const manosCount = rarityCounts.manos || 0;
  const miticoCount = rarityCounts.mitico || 0;

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
    case 'mitico':
      displayInventory = userInventory.filter((c) => c.rarity === 'mitico');
      filterLabel = 'miticos';
      break;
    case 'manos':
      displayInventory = userInventory.filter((c) => c.rarity === 'manos');
      filterLabel = 'manos';
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
    `(**COMUM**: ${comumCount} | **RARO**: ${raroCount} | **EPICA**: ${epicoCount} | **LENDARIA**: ${lendarioCount}) | **SUPREMA**: ${supremoCount} | **MITICA**: ${miticoCount}  | **MANOS**: ${manosCount}  )` +
    `— ${total} no total — pág. ${page}/${totalPages}`;

  const content =
    lines.length > 0 ? header + '\n' + lines.join('\n') : header + '\n_(sem cartas nessa página)_';

  // botões guardam também o filtro
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
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
    const obj = JSON.parse(data) as Record<string, Card[]>;

    // obj = { "userId1": [cards...], "userId2": [...] }
    inventory = new Map(
      Object.entries(obj).map(([userId, cards]) => [userId, cards])
    );

    console.log(`Inventário carregado: ${inventory.size} usuário(s).`);
  } catch (err) {
    if (isNodeError(err) && err.code === 'ENOENT') {
      console.log('Nenhum inventário salvo ainda, começando do zero.');
    } else {
      console.error('Erro ao carregar inventário:', err);
    }
  }
}

async function saveInventory() {
  try {
    const obj = Object.fromEntries(inventory); // Map -> objeto plano
    await writeJsonAtomically(INVENTORY_FILE, obj);
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
  console.log(`Logado como ${client.user?.tag} (ID: ${client.user?.id})`);
});


async function createDropImage(cards: Card[]) {
  console.log(
    'Drop atual:',
    cards.map((c) => `${c.id}`)
  );
  const finalBuffer = await renderDropImage(cards);

  const fileName = `drop_${Date.now()}.png`;
  const attachment = new AttachmentBuilder(finalBuffer, { name: fileName });

  return { attachment, fileName };
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

    const battle: Battle = {
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
        `CALLLMA DESGRAÇAAA ainda faltam **${minutes}m ${seconds}s** pro próximo drop.`
      );
      return;
    }

    cooldowns.set(userId, now);

    // sorteia 3 cartas
    const options = drawUniqueCards(3);
    const sessionId = createSessionId();

    const { attachment } = await createDropImage(options);
    const cardList = options
      .map((card, index) => `\`${index + 1}.\` ${getRarityMeta(card).label} | **${card.name}**`)
      .join('\n');

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:0`)
        .setEmoji('1️⃣')
        .setLabel('.')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:1`)
        .setEmoji('2️⃣')
        .setLabel('.')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`card:${sessionId}:2`)
        .setEmoji('3️⃣')
        .setLabel('.')
        .setStyle(ButtonStyle.Secondary)
    );

    const reply = await message.reply({
      content: `🎴 <@${userId}> está dropando cartas\n\n${cardList}\n\nEscolha uma carta abaixo:`,
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
      if (arg === 'mano' || arg === 'manos') filter = 'manos';
      if (arg === 'miticas' || arg === 'mitica' || arg === 'miticos' || arg === 'mitico') filter = 'mitico';
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
  const map = new Map<string, RepeatedCard>();
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
      if (filter === 'supremo') return userInventory.filter((c) => c.rarity === 'supremo');
      if (filter === 'mitico') return userInventory.filter((c) => c.rarity === 'mitico');
      if (filter === 'manos') return userInventory.filter((c) => c.rarity === 'manos');
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

  if (!chosen) {
    await interaction.reply({
      content: 'Opção de carta inválida.',
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const userInventory = inventory.get(session.userId) || [];
  userInventory.push(chosen);
  inventory.set(session.userId, userInventory);

  await saveInventory();
  sessions.delete(sessionId);

  // desabilita botões
  try {
    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      session.options.map((_, buttonIndex) =>
        new ButtonBuilder()
          .setCustomId(`card:${sessionId}:${buttonIndex}`)
          .setEmoji('🤍')
          .setLabel(String(buttonIndex + 1))
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      )
    );

    await interaction.message.edit({ components: [disabledRow] });
  } catch (e) {
    console.error('Erro ao desabilitar botões:', e);
  }

  await interaction.reply({
    content: `Você escolheu: **${chosen.name}** 🎉\nAgora você tem **${
      userInventory.length
    }** carta(s) no inventário. Digita !card ${userInventory.length} pra ver sua nova cartinha`,
    flags: MessageFlags.Ephemeral,
  });
});

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

async function writeJsonAtomically(filePath: string, value: unknown): Promise<void> {
  const temporaryPath = `${filePath}.tmp`;
  await fs.writeFile(temporaryPath, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(temporaryPath, filePath);
}

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('A variável de ambiente DISCORD_TOKEN não foi definida.');
}

await loadInventory();
await loadDailyClaims();
await client.login(token);
