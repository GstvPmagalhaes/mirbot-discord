import sharp from 'sharp';
import { renderDropImage } from './drop-image.js';
import { getRarityMeta } from './utils/images.js';
import type { Card, Rarity } from './utils/images.js';

type SharpOverlay = Parameters<ReturnType<typeof sharp>['composite']>[0][number];

export const ALBUM_PAGE_SIZE = 10;

export const albumFilters = [
  { value: 'all', label: 'Todas as cartas', emoji: '🎴' },
  { value: 'comum', label: 'Comuns', emoji: '🟩' },
  { value: 'raro', label: 'Raras', emoji: '🔷' },
  { value: 'epico', label: 'Épicas', emoji: '🟣' },
  { value: 'lendario', label: 'Lendárias', emoji: '⭐' },
  { value: 'supremo', label: 'Supremas', emoji: '👹' },
  { value: 'mitico', label: 'Míticas', emoji: '👑' },
  { value: 'times', label: 'Times', emoji: '⚽' },
  { value: 'monkeys', label: 'Monkeys', emoji: '🐒' },
  { value: 'efemera', label: 'Efêmeras', emoji: '💫' },
] as const;

export type AlbumFilter = (typeof albumFilters)[number]['value'];

interface AlbumRenderOptions {
  catalog: Card[];
  inventory: Card[];
  displayName: string;
  page?: number;
  filter?: AlbumFilter;
}

export interface AlbumRenderResult {
  buffer: Buffer;
  page: number;
  totalPages: number;
  ownedUnique: number;
  totalUnique: number;
  totalCopies: number;
}

interface AlbumEntry {
  card: Card;
  count: number;
}

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1080;
const CARD_WIDTH = 276;
const CARD_HEIGHT = 390;
const CARD_ART_WIDTH = 216;
const CARD_ART_HEIGHT = 360;
const CARD_GAP_X = 24;
const CARD_GAP_Y = 24;
const GRID_LEFT = 62;
const GRID_TOP = 224;

const rarityOrder: Record<string, number> = {
  comum: 0,
  raro: 1,
  epico: 2,
  lendario: 3,
  supremo: 4,
  times: 5,
  monkeys: 6,
  daily: 7,
  mitico: 7,
  efemera: 8,
};

const MAX_CACHED_PAGES = 24;
const MAX_CACHED_CARD_PANELS = 512;
const renderedCardCache = new Map<string, Promise<Buffer>>();
const renderedCardPanelCache = new Map<string, Promise<Buffer>>();
const renderedPageCache = new Map<string, Promise<Buffer>>();
let lockedCardCache: Promise<Buffer> | undefined;

export function isAlbumFilter(value: string): value is AlbumFilter {
  return albumFilters.some((filter) => filter.value === value);
}

export function matchesAlbumFilter(card: Card, filter: AlbumFilter) {
  if (filter === 'all') return true;
  if (filter === 'mitico') return card.rarity === 'mitico' || card.rarity === 'daily';
  return card.rarity === filter;
}

export async function renderAlbumPage(options: AlbumRenderOptions): Promise<AlbumRenderResult> {
  const filter = options.filter ?? 'all';
  const catalog = uniqueCards(options.catalog).sort(compareCards);
  const inventoryCounts = countCards(options.inventory);
  const entries = catalog.map((card) => ({
    card,
    count: inventoryCounts.get(card.id) ?? 0,
  }));
  const visibleEntries = entries.filter(({ card }) => matchesAlbumFilter(card, filter));
  const totalPages = Math.max(1, Math.ceil(visibleEntries.length / ALBUM_PAGE_SIZE));
  const requestedPage = Number.isFinite(options.page) ? Math.trunc(options.page ?? 1) : 1;
  const page = Math.min(totalPages, Math.max(1, requestedPage));
  const start = (page - 1) * ALBUM_PAGE_SIZE;
  const pageEntries = visibleEntries.slice(start, start + ALBUM_PAGE_SIZE);
  const ownedUnique = entries.filter((entry) => entry.count > 0).length;
  const totalCopies = options.inventory.length;
  const percentage = catalog.length === 0 ? 0 : Math.round((ownedUnique / catalog.length) * 100);
  const filterLabel = albumFilters.find((item) => item.value === filter)?.label ?? 'Todas as cartas';
  const inventorySignature = [...inventoryCounts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([cardId, count]) => `${cardId}:${count}`)
    .join(',');
  const pageCacheKey = [options.displayName, filter, page, catalog.length, inventorySignature].join('|');

  let rendering = getCachedValue(renderedPageCache, pageCacheKey);
  if (!rendering) {
    rendering = (async () => {
      const background = createBackground({
        displayName: options.displayName,
        ownedUnique,
        totalUnique: catalog.length,
        totalCopies,
        percentage,
        page,
        totalPages,
        filterLabel,
        entries,
      });

      const panels = await Promise.all(pageEntries.map(renderAlbumCard));
      const composites: SharpOverlay[] = [{ input: background, left: 0, top: 0 }];
      panels.forEach((input, index) => {
        const column = index % 5;
        const row = Math.floor(index / 5);
        composites.push({
          input,
          left: GRID_LEFT + column * (CARD_WIDTH + CARD_GAP_X),
          top: GRID_TOP + row * (CARD_HEIGHT + CARD_GAP_Y),
        });
      });

      return sharp({
        create: {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          channels: 4,
          background: '#070a14',
        },
      })
        .composite(composites)
        .png({ compressionLevel: 4, adaptiveFiltering: true })
        .toBuffer();
    })().catch((error) => {
      renderedPageCache.delete(pageCacheKey);
      throw error;
    });
    setCachedValue(renderedPageCache, pageCacheKey, rendering, MAX_CACHED_PAGES);
  }

  const buffer = await rendering;

  return {
    buffer,
    page,
    totalPages,
    ownedUnique,
    totalUnique: catalog.length,
    totalCopies,
  };
}

function uniqueCards(cards: Card[]) {
  const unique = new Map<string, Card>();
  for (const card of cards) {
    if (!unique.has(card.id)) unique.set(card.id, card);
  }
  return [...unique.values()];
}

function compareCards(left: Card, right: Card) {
  const rarityDifference = (rarityOrder[left.rarity] ?? 99) - (rarityOrder[right.rarity] ?? 99);
  if (rarityDifference !== 0) return rarityDifference;
  return left.name.localeCompare(right.name, 'pt-BR');
}

function countCards(cards: Card[]) {
  const counts = new Map<string, number>();
  for (const card of cards) counts.set(card.id, (counts.get(card.id) ?? 0) + 1);
  return counts;
}

async function renderAlbumCard(entry: AlbumEntry): Promise<Buffer> {
  if (entry.count === 0) {
    lockedCardCache ??= createLockedCard();
    return lockedCardCache;
  }

  const panelCacheKey = `${entry.card.id}:${entry.count}`;
  const cached = getCachedValue(renderedCardPanelCache, panelCacheKey);
  if (cached) return cached;

  const rendering = (async () => {
    const art = await getRenderedCard(entry.card);
    return composeOwnedCard(entry, art);
  })().catch((error) => {
    renderedCardPanelCache.delete(panelCacheKey);
    console.error(`Erro ao renderizar a carta ${entry.card.id} no álbum:`, error);
    return createUnavailableCard(entry);
  });
  setCachedValue(renderedCardPanelCache, panelCacheKey, rendering, MAX_CACHED_CARD_PANELS);
  return rendering;
}

function getRenderedCard(card: Card) {
  const cached = getCachedValue(renderedCardCache, card.id);
  if (cached) return cached;

  const rendering = renderDropImage([card])
    .then((buffer) => sharp(buffer).resize(CARD_ART_WIDTH, CARD_ART_HEIGHT).png().toBuffer())
    .catch((error) => {
      renderedCardCache.delete(card.id);
      throw error;
    });
  renderedCardCache.set(card.id, rendering);
  return rendering;
}

function getCachedValue<T>(cache: Map<string, T>, key: string) {
  const value = cache.get(key);
  if (value === undefined) return undefined;
  cache.delete(key);
  cache.set(key, value);
  return value;
}

function setCachedValue<T>(cache: Map<string, T>, key: string, value: T, maximumSize: number) {
  cache.set(key, value);
  while (cache.size > maximumSize) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }
}

async function composeOwnedCard(entry: AlbumEntry, art: Buffer) {
  const meta = getRarityMeta(entry.card);
  const label = truncate(entry.card.name.toUpperCase(), 22);
  const background = Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.72"/>
        </filter>
      </defs>
      <rect x="8" y="6" width="260" height="378" rx="22" fill="#0b0f1c" stroke="${meta.color}" stroke-width="3" filter="url(#shadow)"/>
    </svg>
  `);
  const overlay = Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#151a2a"/><stop offset="1" stop-color="#070910"/>
        </linearGradient>
      </defs>
      <rect x="22" y="326" width="232" height="48" rx="10" fill="url(#plate)" stroke="${meta.color}" stroke-opacity="0.8"/>
      <text x="138" y="348" fill="#fff" font-size="17" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">${escapeXml(label)}</text>
      <text x="138" y="367" fill="${meta.color}" font-size="12" font-weight="700" font-family="Arial, sans-serif" text-anchor="middle">${escapeXml(stripEmoji(meta.label).toUpperCase())}</text>
      <rect x="207" y="18" width="54" height="38" rx="10" fill="#080b13" fill-opacity="0.94" stroke="#fff" stroke-opacity="0.72"/>
      <text x="234" y="44" fill="#fff" font-size="22" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">x${entry.count}</text>
    </svg>
  `);

  return sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: background, left: 0, top: 0 },
      { input: art, left: 30, top: 12 },
      { input: overlay, left: 0, top: 0 },
    ])
    .png()
    .toBuffer();
}

function createLockedCard() {
  return sharp(Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="locked" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#171b27"/><stop offset="0.5" stop-color="#090c14"/><stop offset="1" stop-color="#202432"/>
        </linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000" flood-opacity="0.72"/>
        </filter>
      </defs>
      <rect x="8" y="6" width="260" height="378" rx="22" fill="url(#locked)" stroke="#4a5060" stroke-width="3" filter="url(#shadow)"/>
      <rect x="20" y="18" width="236" height="344" rx="15" fill="#06080e" stroke="#282d3a" stroke-width="2"/>
      <circle cx="138" cy="162" r="66" fill="#0e111a" stroke="#252a36" stroke-width="4"/>
      <text x="138" y="194" fill="#606777" font-size="92" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">?</text>
      <text x="138" y="326" fill="#7e8594" font-size="16" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">NÃO DESCOBERTA</text>
      <text x="138" y="350" fill="#4f5562" font-size="12" font-family="Arial, sans-serif" text-anchor="middle">Continue dropando para revelar</text>
    </svg>
  `)).png().toBuffer();
}

function createUnavailableCard(entry: AlbumEntry) {
  const meta = getRarityMeta(entry.card);
  return sharp(Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="6" width="260" height="378" rx="22" fill="#0b0f1c" stroke="${meta.color}" stroke-width="3"/>
      <text x="138" y="158" fill="#d2d6df" font-size="54" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">!</text>
      <text x="138" y="206" fill="#d2d6df" font-size="15" font-weight="700" font-family="Arial, sans-serif" text-anchor="middle">IMAGEM INDISPONÍVEL</text>
      <text x="138" y="335" fill="#fff" font-size="16" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">${escapeXml(truncate(entry.card.name.toUpperCase(), 22))}</text>
      <text x="138" y="360" fill="${meta.color}" font-size="14" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">x${entry.count}</text>
    </svg>
  `)).png().toBuffer();
}

function createBackground(options: {
  displayName: string;
  ownedUnique: number;
  totalUnique: number;
  totalCopies: number;
  percentage: number;
  page: number;
  totalPages: number;
  filterLabel: string;
  entries: AlbumEntry[];
}) {
  const progressWidth = Math.round(440 * (options.percentage / 100));
  const initial = Array.from(options.displayName.trim())[0]?.toUpperCase() ?? '?';
  const stats = buildRarityStats(options.entries);
  const chips = stats.map((stat, index) => {
    const x = 620 + index * 103;
    return `
      <g transform="translate(${x} 112)">
        <rect width="94" height="58" rx="10" fill="#111728" stroke="${stat.color}" stroke-opacity="0.7"/>
        <text x="47" y="23" fill="${stat.color}" font-size="12" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">${stat.label}</text>
        <text x="47" y="44" fill="#f4f6fb" font-size="15" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">${stat.owned}/${stat.total}</text>
      </g>`;
  }).join('');

  return Buffer.from(`
    <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="20%" cy="0%" r="100%">
          <stop offset="0" stop-color="#3d146d"/><stop offset="0.45" stop-color="#11152a"/><stop offset="1" stop-color="#070a14"/>
        </radialGradient>
        <linearGradient id="progress" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#7537f1"/><stop offset="1" stop-color="#d06cff"/>
        </linearGradient>
        <filter id="purple-glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="1600" height="1080" fill="url(#glow)"/>
      <rect x="18" y="18" width="1564" height="1044" rx="28" fill="none" stroke="#6732a8" stroke-opacity="0.55" stroke-width="2"/>
      <circle cx="91" cy="94" r="52" fill="#15192a" stroke="#a855f7" stroke-width="4" filter="url(#purple-glow)"/>
      <text x="91" y="112" fill="#fff" font-size="48" font-weight="900" font-family="Arial, sans-serif" text-anchor="middle">${escapeXml(initial)}</text>
      <text x="166" y="76" fill="#fff" font-size="42" font-weight="900" font-family="Arial, sans-serif">ÁLBUM DE ${escapeXml(truncate(options.displayName.toUpperCase(), 18))}</text>
      <text x="168" y="109" fill="#aeb5ca" font-size="18" font-family="Arial, sans-serif">Coleção geral • ${options.totalCopies} cópias no inventário</text>
      <rect x="166" y="132" width="440" height="22" rx="11" fill="#080b14" stroke="#3b435a"/>
      <rect x="166" y="132" width="${progressWidth}" height="22" rx="11" fill="url(#progress)" filter="url(#purple-glow)"/>
      <text x="166" y="181" fill="#fff" font-size="23" font-weight="800" font-family="Arial, sans-serif">${options.ownedUnique} / ${options.totalUnique} CARTAS ÚNICAS</text>
      <text x="572" y="181" fill="#c56cff" font-size="24" font-weight="900" font-family="Arial, sans-serif" text-anchor="end">${options.percentage}%</text>
      ${chips}
      <line x1="62" y1="205" x2="1538" y2="205" stroke="#32394e"/>
      <text x="62" y="1043" fill="#939bb0" font-size="17" font-family="Arial, sans-serif">Filtro: ${escapeXml(options.filterLabel)}</text>
      <text x="800" y="1043" fill="#fff" font-size="20" font-weight="800" font-family="Arial, sans-serif" text-anchor="middle">PÁGINA ${options.page} / ${options.totalPages}</text>
      <text x="1538" y="1043" fill="#939bb0" font-size="16" font-family="Arial, sans-serif" text-anchor="end">mirBOT • álbum de coleção</text>
    </svg>
  `);
}

function buildRarityStats(entries: AlbumEntry[]) {
  const definitions: Array<{ rarity: Rarity | 'mitico'; label: string; color: string }> = [
    { rarity: 'comum', label: 'COMUM', color: '#51e66a' },
    { rarity: 'raro', label: 'RARO', color: '#38cffa' },
    { rarity: 'epico', label: 'ÉPICO', color: '#d064ff' },
    { rarity: 'lendario', label: 'LEND.', color: '#ffc94f' },
    { rarity: 'supremo', label: 'SUPR.', color: '#ff5252' },
    { rarity: 'times', label: 'TIMES', color: '#8da2d8' },
    { rarity: 'monkeys', label: 'MONK.', color: '#f1e6c7' },
    { rarity: 'mitico', label: 'MÍTICO', color: '#39f2df' },
    { rarity: 'efemera', label: 'EFÊM.', color: '#ff5fb3' },
  ];

  return definitions.map((definition) => {
    const matches = entries.filter(({ card }) => definition.rarity === 'mitico'
      ? card.rarity === 'mitico' || card.rarity === 'daily'
      : card.rarity === definition.rarity);
    return {
      ...definition,
      owned: matches.filter((entry) => entry.count > 0).length,
      total: matches.length,
    };
  });
}

function stripEmoji(value: string) {
  return value.replace(/[^\p{L}\p{N}\s]/gu, '').trim();
}

function truncate(value: string, maximumLength: number) {
  const characters = Array.from(value);
  if (characters.length <= maximumLength) return value;
  return `${characters.slice(0, maximumLength - 1).join('')}…`;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
