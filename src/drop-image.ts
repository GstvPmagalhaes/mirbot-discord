import sharp from 'sharp';
import { getRarityMeta } from './utils/images.js';
import type { Card } from './utils/images.js';

type SharpOverlay = Parameters<ReturnType<typeof sharp>['composite']>[0][number];

const CARD_WIDTH = 360;
const CARD_HEIGHT = 600;
const CARD_BORDER = 8;
const CARD_GAP = 24;
const CARD_RADIUS = 18;

export async function renderDropImage(cards: Card[]): Promise<Buffer> {
  const panels = await Promise.all(cards.map(renderCardPanel));
  const canvasWidth = cards.length * CARD_WIDTH + Math.max(0, cards.length - 1) * CARD_GAP;

  const composites: SharpOverlay[] = panels.map((input, index) => ({
    input,
    left: index * (CARD_WIDTH + CARD_GAP),
    top: 0,
  }));

  return sharp({
    create: {
      width: canvasWidth,
      height: CARD_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png()
    .toBuffer();
}

async function renderCardPanel(card: Card): Promise<Buffer> {
  const meta = getRarityMeta(card);
  const innerWidth = CARD_WIDTH - CARD_BORDER * 2;
  const innerHeight = CARD_HEIGHT - CARD_BORDER * 2;

  const response = await fetch(card.imageUrl);
  if (!response.ok) {
    throw new Error(`Falha ao baixar a carta ${card.id}: HTTP ${response.status}`);
  }

  const source = Buffer.from(await response.arrayBuffer());
  const artwork = await sharp(source)
    .resize(innerWidth, innerHeight, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();

  const roundedMask = Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="${CARD_RADIUS}" fill="#fff" />
    </svg>
  `);

  return sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: meta.color,
    },
  })
    .composite([
      { input: artwork, left: CARD_BORDER, top: CARD_BORDER },
      { input: roundedMask, left: 0, top: 0, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();
}
