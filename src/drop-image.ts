import sharp from 'sharp';
import { getRarityMeta } from './utils/images.js';
import type { Card, RarityMeta } from './utils/images.js';

type SharpOverlay = Parameters<ReturnType<typeof sharp>['composite']>[0][number];

const CARD_WIDTH = 360;
const CARD_HEIGHT = 600;
const CARD_BORDER = 10;
const CARD_GAP = 24;
const CARD_RADIUS = 18;
const HOLOGRAPHIC_BORDER = 16;
const ORNATE_BORDER = 22;
const COMMON_BORDER = 12;
const RARE_BORDER = 15;
const EPIC_BORDER = 17;
const LEGENDARY_BORDER = 20;
const SUPREME_BORDER = 23;

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
  const borderWidth = getBorderWidth(meta.borderStyle);
  const innerWidth = CARD_WIDTH - borderWidth * 2;
  const innerHeight = CARD_HEIGHT - borderWidth * 2;

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

  const overlays: SharpOverlay[] = [
    { input: artwork, left: borderWidth, top: borderWidth },
  ];

  if (meta.borderStyle === 'common-forged') {
    overlays.push({ input: createCommonForgedFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'rare-crystal') {
    overlays.push({ input: createRareCrystalFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'epic-arcane') {
    overlays.push({ input: createEpicArcaneFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'legendary-regal') {
    overlays.push({ input: createLegendaryRegalFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'supreme-storm') {
    overlays.push({ input: createSupremeStormFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'holographic') {
    overlays.push({ input: createHolographicFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'dark-ornate') {
    overlays.push({ input: createDarkOrnateFrame(borderWidth), left: 0, top: 0 });
  } else if (meta.borderStyle === 'ivory-ornate') {
    overlays.push({ input: createIvoryOrnateFrame(borderWidth), left: 0, top: 0 });
  }

  overlays.push({ input: roundedMask, left: 0, top: 0, blend: 'dest-in' });

  return sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: meta.color,
    },
  })
    .composite(overlays)
    .png()
    .toBuffer();
}

function getBorderWidth(borderStyle: RarityMeta['borderStyle']) {
  if (borderStyle === 'common-forged') return COMMON_BORDER;
  if (borderStyle === 'rare-crystal') return RARE_BORDER;
  if (borderStyle === 'epic-arcane') return EPIC_BORDER;
  if (borderStyle === 'legendary-regal') return LEGENDARY_BORDER;
  if (borderStyle === 'supreme-storm') return SUPREME_BORDER;
  if (borderStyle === 'holographic') return HOLOGRAPHIC_BORDER;
  if (borderStyle === 'dark-ornate' || borderStyle === 'ivory-ornate') return ORNATE_BORDER;
  return CARD_BORDER;
}

function createFrameMask(borderWidth: number) {
  const innerWidth = CARD_WIDTH - borderWidth * 2;
  const innerHeight = CARD_HEIGHT - borderWidth * 2;
  const innerRadius = Math.max(4, CARD_RADIUS - borderWidth / 2);

  return {
    innerWidth,
    innerHeight,
    innerRadius,
    svg: `
      <mask id="frame-mask">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="${CARD_RADIUS}" fill="white" />
        <rect x="${borderWidth}" y="${borderWidth}" width="${innerWidth}" height="${innerHeight}"
          rx="${innerRadius}" fill="black" />
      </mask>`,
  };
}

function createCommonForgedFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="common-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#063d12" />
          <stop offset="24%" stop-color="#18d43b" />
          <stop offset="48%" stop-color="#07591b" />
          <stop offset="72%" stop-color="#2cff52" />
          <stop offset="100%" stop-color="#052d0e" />
        </linearGradient>
        <filter id="common-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#common-metal)" />
        <path d="M0 54 L12 42 L12 14 L42 0 M318 0 L348 14 L348 42 L360 54
          M0 546 L12 558 L12 586 L42 600 M318 600 L348 586 L348 558 L360 546"
          fill="none" stroke="#baffb6" stroke-width="3" stroke-opacity="0.72" />
        <path d="M115 5 L145 5 L180 10 L215 5 L245 5
          M115 595 L145 595 L180 590 L215 595 L245 595"
          fill="none" stroke="#76ff75" stroke-width="2" />
        <g fill="#d7ffd2" filter="url(#common-glow)">
          <circle cx="7" cy="180" r="2" /><circle cx="353" cy="180" r="2" />
          <circle cx="7" cy="420" r="2" /><circle cx="353" cy="420" r="2" />
        </g>
      </g>

      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#c9ffc8" stroke-width="2" stroke-opacity="0.86" />
    </svg>
  `);
}

function createRareCrystalFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rare-crystal" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#003a63" />
          <stop offset="22%" stop-color="#00aeea" />
          <stop offset="45%" stop-color="#d8fbff" />
          <stop offset="62%" stop-color="#087db8" />
          <stop offset="82%" stop-color="#45eaff" />
          <stop offset="100%" stop-color="#002f57" />
        </linearGradient>
        <filter id="rare-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#rare-crystal)" />
        <g fill="#b9f7ff" fill-opacity="0.38" stroke="#e8fdff" stroke-opacity="0.72">
          <path d="M0 0 L66 0 L22 15 Z" /><path d="M294 0 L360 0 L338 15 Z" />
          <path d="M0 600 L66 600 L22 585 Z" /><path d="M294 600 L360 600 L338 585 Z" />
          <path d="M0 115 L15 150 L0 190 Z" /><path d="M360 115 L345 150 L360 190 Z" />
          <path d="M0 410 L15 450 L0 485 Z" /><path d="M360 410 L345 450 L360 485 Z" />
        </g>
        <path d="M92 6 L145 6 L180 14 L215 6 L268 6
          M92 594 L145 594 L180 586 L215 594 L268 594"
          fill="none" stroke="#e1fbff" stroke-width="3" />
        <g fill="#8ff4ff" stroke="#ffffff" stroke-width="1.5" filter="url(#rare-glow)">
          <path d="M180 2 L189 11 L180 24 L171 11 Z" />
          <path d="M180 576 L189 589 L180 598 L171 589 Z" />
          <path d="M2 300 L10 289 L18 300 L10 311 Z" />
          <path d="M342 300 L350 289 L358 300 L350 311 Z" />
        </g>
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#004e7b" stroke-width="5" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#bdffff" stroke-width="2" />
    </svg>
  `);
}

function createEpicArcaneFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="epic-arcane" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#26043d" />
          <stop offset="24%" stop-color="#861ac4" />
          <stop offset="48%" stop-color="#3d075d" />
          <stop offset="72%" stop-color="#e342ff" />
          <stop offset="100%" stop-color="#220435" />
        </linearGradient>
        <filter id="epic-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#epic-arcane)" />
        <path d="M0 70 Q14 56 15 32 Q36 25 58 0
          M360 70 Q346 56 345 32 Q324 25 302 0
          M0 530 Q14 544 15 568 Q36 575 58 600
          M360 530 Q346 544 345 568 Q324 575 302 600"
          fill="none" stroke="#f0a8ff" stroke-width="4" stroke-opacity="0.82" />
        <path d="M104 7 Q145 15 180 27 Q215 15 256 7
          M104 593 Q145 585 180 573 Q215 585 256 593"
          fill="none" stroke="#ff8cff" stroke-width="3" />
        <path d="M7 205 Q16 230 7 255 M353 205 Q344 230 353 255
          M7 345 Q16 370 7 395 M353 345 Q344 370 353 395"
          fill="none" stroke="#d967ff" stroke-width="3" />
        <g fill="none" stroke="#ffd0ff" stroke-width="2" filter="url(#epic-glow)">
          <circle cx="180" cy="10" r="7" /><circle cx="180" cy="590" r="7" />
          <circle cx="9" cy="300" r="6" /><circle cx="351" cy="300" r="6" />
        </g>
        <g fill="#fff0ff">
          <circle cx="13" cy="120" r="2" /><circle cx="347" cy="120" r="2" />
          <circle cx="13" cy="480" r="2" /><circle cx="347" cy="480" r="2" />
        </g>
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#330348" stroke-width="6" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#ed9cff" stroke-width="2" />
    </svg>
  `);
}

function createLegendaryRegalFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="legendary-gold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6d3c00" />
          <stop offset="20%" stop-color="#e89a00" />
          <stop offset="42%" stop-color="#fff1a6" />
          <stop offset="58%" stop-color="#b86400" />
          <stop offset="80%" stop-color="#ffd34f" />
          <stop offset="100%" stop-color="#734000" />
        </linearGradient>
        <filter id="gold-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#legendary-gold)" />
        <path d="M0 72 L20 48 L20 18 L54 0 M306 0 L340 18 L340 48 L360 72
          M0 528 L20 552 L20 582 L54 600 M306 600 L340 582 L340 552 L360 528"
          fill="none" stroke="#fff0a0" stroke-width="5" />
        <path d="M128 18 L146 5 L163 17 L180 2 L197 17 L214 5 L232 18
          M128 582 L146 595 L163 583 L180 598 L197 583 L214 595 L232 582"
          fill="none" stroke="#fff3ad" stroke-width="4" />
        <path d="M6 144 L18 165 L6 188 M354 144 L342 165 L354 188
          M6 412 L18 435 L6 456 M354 412 L342 435 L354 456"
          fill="none" stroke="#ffcf42" stroke-width="4" />
        <g fill="#fff8c9" stroke="#b96800" stroke-width="2" filter="url(#gold-glow)">
          <path d="M180 5 L190 15 L180 29 L170 15 Z" />
          <path d="M180 571 L190 585 L180 595 L170 585 Z" />
          <circle cx="10" cy="300" r="7" /><circle cx="350" cy="300" r="7" />
        </g>
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#6e3900" stroke-width="7" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#fff0a3" stroke-width="2.5" />
    </svg>
  `);
}

function createSupremeStormFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="supreme-storm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090000" />
          <stop offset="18%" stop-color="#720000" />
          <stop offset="42%" stop-color="#170000" />
          <stop offset="66%" stop-color="#e00000" />
          <stop offset="82%" stop-color="#3a0000" />
          <stop offset="100%" stop-color="#070000" />
        </linearGradient>
        <filter id="red-lightning" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood flood-color="#ff0000" flood-opacity="0.95" result="glow-color" />
          <feComposite in="glow-color" in2="blur" operator="in" result="colored-blur" />
          <feMerge><feMergeNode in="colored-blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#supreme-storm)" />
        <path d="M0 78 L23 47 L17 20 L58 0 M302 0 L343 20 L337 47 L360 78
          M0 522 L23 553 L17 580 L58 600 M302 600 L343 580 L337 553 L360 522"
          fill="none" stroke="#ff2626" stroke-width="7" />
        <path d="M103 8 L145 8 L180 21 L215 8 L257 8
          M103 592 L145 592 L180 579 L215 592 L257 592"
          fill="none" stroke="#ff6b55" stroke-width="5" />
        <g fill="#ff2400" stroke="#ffe0d7" stroke-width="1.5" filter="url(#red-lightning)">
          <path d="M180 2 L192 14 L180 31 L168 14 Z" />
          <path d="M180 569 L192 586 L180 598 L168 586 Z" />
        </g>
        <g fill="none" stroke="#ffcbc2" stroke-width="2.5" filter="url(#red-lightning)">
          <path d="M8 82 L18 111 L8 132 L19 163 L7 197 L18 226 L8 258" />
          <path d="M352 342 L341 372 L352 397 L340 430 L352 458 L341 490 L352 520" />
          <path d="M67 7 L92 17 L116 8 M244 592 L270 582 L294 593" />
        </g>
      </g>

      <g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#red-lightning)">
        <path d="M18 118 L32 147 L23 174 L39 203 L27 235 L42 267 L25 301"
          stroke="#ff1616" stroke-width="4" />
        <path d="M342 299 L326 332 L338 361 L322 394 L336 426 L320 458 L340 486"
          stroke="#ff1616" stroke-width="4" />
        <path d="M18 118 L32 147 L23 174 L39 203 L27 235 L42 267 L25 301"
          stroke="#fff2ed" stroke-width="1.3" />
        <path d="M342 299 L326 332 L338 361 L322 394 L336 426 L320 458 L340 486"
          stroke="#fff2ed" stroke-width="1.3" />
        <path d="M27 235 L14 247 M336 426 L348 442 M32 147 L44 156 M326 332 L314 344"
          stroke="#ff7566" stroke-width="2" />
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#120000" stroke-width="8" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#ff3a2e" stroke-width="3" filter="url(#red-lightning)" />
    </svg>
  `);
}

function createHolographicFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22d3ee" />
          <stop offset="18%" stop-color="#818cf8" />
          <stop offset="38%" stop-color="#f472b6" />
          <stop offset="58%" stop-color="#fde047" />
          <stop offset="78%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#c084fc" />
        </linearGradient>
        ${frameMask}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#holo)" />
        <path d="M-130 470 L250 -30 M40 650 L420 150" stroke="white"
          stroke-width="24" stroke-opacity="0.28" />
        <g fill="white" filter="url(#glow)">
          <circle cx="18" cy="92" r="2.7" />
          <circle cx="343" cy="142" r="2.1" />
          <circle cx="14" cy="318" r="2" />
          <circle cx="346" cy="402" r="3" />
          <circle cx="92" cy="588" r="2.3" />
          <circle cx="276" cy="13" r="2.4" />
        </g>
      </g>

      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="white" stroke-opacity="0.72" stroke-width="2" />
    </svg>
  `);
}

function createDarkOrnateFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#02040a" />
          <stop offset="26%" stop-color="#17142a" />
          <stop offset="52%" stop-color="#050814" />
          <stop offset="78%" stop-color="#16102a" />
          <stop offset="100%" stop-color="#02040a" />
        </linearGradient>
        <linearGradient id="dark-metal" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6d481d" />
          <stop offset="28%" stop-color="#e4bd64" />
          <stop offset="54%" stop-color="#70481b" />
          <stop offset="78%" stop-color="#f3dc8f" />
          <stop offset="100%" stop-color="#765022" />
        </linearGradient>
        <filter id="blue-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#obsidian)" />
        <path d="M0 62 L22 36 L22 10 L52 0 M308 0 L338 10 L338 36 L360 62
          M0 538 L22 564 L22 590 L52 600 M308 600 L338 590 L338 564 L360 538"
          fill="none" stroke="url(#dark-metal)" stroke-width="7" />
        <path d="M0 105 Q18 94 22 68 M360 105 Q342 94 338 68
          M0 495 Q18 506 22 532 M360 495 Q342 506 338 532"
          fill="none" stroke="#4867a8" stroke-width="3" stroke-opacity="0.9" />
        <path d="M116 8 L156 8 L180 20 L204 8 L244 8
          M116 592 L156 592 L180 580 L204 592 L244 592"
          fill="none" stroke="url(#dark-metal)" stroke-width="5" />
        <g fill="#6387d8" stroke="#f1d486" stroke-width="2" filter="url(#blue-glow)">
          <path d="M180 5 L188 13 L180 25 L172 13 Z" />
          <path d="M180 575 L188 587 L180 595 L172 587 Z" />
          <path d="M5 300 L13 289 L21 300 L13 311 Z" />
          <path d="M339 300 L347 289 L355 300 L347 311 Z" />
        </g>
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#090d1b" stroke-width="6" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="url(#dark-metal)" stroke-width="2" />
    </svg>
  `);
}

function createIvoryOrnateFrame(borderWidth: number): Buffer {
  const { innerWidth, innerHeight, innerRadius, svg: frameMask } = createFrameMask(borderWidth);

  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ivory" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="24%" stop-color="#d9dde3" />
          <stop offset="48%" stop-color="#fffdf3" />
          <stop offset="72%" stop-color="#c8ced8" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="pearl-metal" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8b7a54" />
          <stop offset="30%" stop-color="#fff4c7" />
          <stop offset="55%" stop-color="#9aa8bd" />
          <stop offset="82%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#a78b54" />
        </linearGradient>
        <filter id="pearl-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${frameMask}
      </defs>

      <g mask="url(#frame-mask)">
        <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#ivory)" />
        <path d="M0 70 Q20 58 22 28 Q42 24 58 0
          M360 70 Q340 58 338 28 Q318 24 302 0
          M0 530 Q20 542 22 572 Q42 576 58 600
          M360 530 Q340 542 338 572 Q318 576 302 600"
          fill="none" stroke="url(#pearl-metal)" stroke-width="7" />
        <path d="M4 118 Q18 94 21 65 Q45 58 72 16
          M356 118 Q342 94 339 65 Q315 58 288 16
          M4 482 Q18 506 21 535 Q45 542 72 584
          M356 482 Q342 506 339 535 Q315 542 288 584"
          fill="none" stroke="#ffffff" stroke-width="3" stroke-opacity="0.95" />
        <path d="M112 8 Q148 15 180 30 Q212 15 248 8
          M112 592 Q148 585 180 570 Q212 585 248 592"
          fill="none" stroke="url(#pearl-metal)" stroke-width="5" />
        <g fill="#ffffff" stroke="#baa46c" stroke-width="2" filter="url(#pearl-glow)">
          <path d="M180 5 L190 15 L180 29 L170 15 Z" />
          <path d="M180 571 L190 585 L180 595 L170 585 Z" />
          <circle cx="12" cy="300" r="7" />
          <circle cx="348" cy="300" r="7" />
        </g>
        <g fill="#ffffff" opacity="0.9">
          <circle cx="15" cy="145" r="2.2" /><circle cx="345" cy="145" r="2.2" />
          <circle cx="15" cy="455" r="2.2" /><circle cx="345" cy="455" r="2.2" />
        </g>
      </g>

      <rect x="${borderWidth - 2}" y="${borderWidth - 2}"
        width="${innerWidth + 4}" height="${innerHeight + 4}" rx="${innerRadius}"
        fill="none" stroke="#7e8795" stroke-width="5" />
      <rect x="${borderWidth - 1}" y="${borderWidth - 1}"
        width="${innerWidth + 2}" height="${innerHeight + 2}" rx="${innerRadius}"
        fill="none" stroke="#fff9dd" stroke-width="2" />
    </svg>
  `);
}
