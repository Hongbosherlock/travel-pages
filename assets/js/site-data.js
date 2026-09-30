import { cityArchive } from "./generated/city-archive.js?v=20260928k";

const palettes = {
  iceland: {
    skyTop: "#0d1827",
    skyMid: "#35536d",
    skyBottom: "#91b8cf",
    glow: "#d7eef6",
    layerA: "#223340",
    layerB: "#405760",
    layerC: "#7ca2b1",
    accent: "#dff7ff",
    highlight: "#c9eff8",
  },
  kyoto: {
    skyTop: "#261a23",
    skyMid: "#7b4a5a",
    skyBottom: "#e8b994",
    glow: "#f8e2c4",
    layerA: "#30211e",
    layerB: "#66463a",
    layerC: "#92684f",
    accent: "#d84d46",
    highlight: "#f3d6b7",
  },
  cappadocia: {
    skyTop: "#322137",
    skyMid: "#9f6d6a",
    skyBottom: "#efc894",
    glow: "#ffe9bd",
    layerA: "#49352f",
    layerB: "#8d6654",
    layerC: "#c99573",
    accent: "#f6f0dd",
    highlight: "#f4d8ae",
  },
  patagonia: {
    skyTop: "#111927",
    skyMid: "#2f4d6f",
    skyBottom: "#adcde1",
    glow: "#ebf8ff",
    layerA: "#1f2e39",
    layerB: "#436072",
    layerC: "#90abbb",
    accent: "#f3fbff",
    highlight: "#d3ecff",
  },
  marrakech: {
    skyTop: "#2c1a19",
    skyMid: "#8e4a37",
    skyBottom: "#efb27c",
    glow: "#ffd7a6",
    layerA: "#41211b",
    layerB: "#874534",
    layerC: "#c16c4d",
    accent: "#f7e0bd",
    highlight: "#ffe7c3",
  },
  fallback: {
    skyTop: "#16151b",
    skyMid: "#403751",
    skyBottom: "#9d8ca8",
    glow: "#f3e6ff",
    layerA: "#1f1d25",
    layerB: "#484051",
    layerC: "#81788f",
    accent: "#fff2de",
    highlight: "#f9eedf",
  },
};

function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildMotif(motif, palette, seed) {
  const sway = Math.round(seed * 36);
  switch (motif) {
    case "glacier":
      return `
        <path d="M0 742c142-32 220-47 337-142 114 91 171 106 307 46 116-177 240-213 365-108 88 0 153 18 225 87 132-47 219-47 366 56v419H0Z" fill="${palette.layerA}" />
        <polygon points="180,758 358,384 524,758" fill="${palette.highlight}" />
        <polygon points="410,758 653,309 860,758" fill="${palette.glow}" />
        <polygon points="738,758 973,424 1134,758" fill="${palette.highlight}" opacity="0.9" />
        <rect x="0" y="758" width="1600" height="180" fill="${palette.layerB}" opacity="0.9" />
        <path d="M0 898c120-33 275-62 482-58 212 4 328 54 522 47 213-7 333-58 596-34v247H0Z" fill="${palette.layerC}" opacity="0.74" />
      `;
    case "road":
      return `
        <path d="M0 706c196-30 303-64 404-132 104 58 204 75 336 40 109-122 214-145 373-61 140-26 293-24 487 68v479H0Z" fill="${palette.layerA}" />
        <path d="M718 1100 626 728 774 728 910 1100Z" fill="${palette.glow}" opacity="0.86" />
        <path d="M732 1100 690 806 756 806 820 1100Z" fill="${palette.highlight}" />
        <path d="M751 914h32v48h-32Z M726 980h38v57h-38Z" fill="${palette.layerB}" opacity="0.6" />
      `;
    case "shore":
      return `
        <path d="M0 676c183 22 353-4 509-82 129-63 267-73 421-35 129 32 231 44 370 9 96-24 188-20 300 19v513H0Z" fill="${palette.layerA}" />
        <path d="M0 838c224-18 373-66 571-33 154 25 274 99 470 93 174-5 295-72 559-57v259H0Z" fill="${palette.layerB}" />
        <path d="M0 918c156-22 287-17 438 17 135 29 247 38 418 20 228-24 379 8 744 54v91H0Z" fill="${palette.glow}" opacity="0.22" />
      `;
    case "aurora":
      return `
        <path d="M0 698c140-72 295-92 474-52 154-102 304-124 438-68 140-31 303-20 688 120v402H0Z" fill="${palette.layerA}" />
        <path d="M0 258c148 40 225 146 356 163 163 22 211-106 356-121 208-22 241 112 436 128 184 16 260-94 452-98v182H0Z" fill="${palette.accent}" opacity="0.38" />
        <path d="M0 326c161 20 247 104 391 108 153 4 237-86 358-79 178 10 273 108 435 99 166-10 236-82 416-92v130H0Z" fill="${palette.highlight}" opacity="0.23" />
      `;
    case "temple":
      return `
        <path d="M0 764c141-69 275-90 413-61 187-92 358-111 512-57 175-46 387-16 675 109v345H0Z" fill="${palette.layerB}" />
        <rect x="506" y="515" width="240" height="209" rx="6" fill="${palette.layerA}" />
        <path d="M455 534 625 444 796 534v54H455Z" fill="${palette.accent}" opacity="0.86" />
        <path d="M428 600 625 510 823 600v38H428Z" fill="${palette.layerA}" />
        <rect x="571" y="596" width="42" height="128" fill="${palette.highlight}" opacity="0.45" />
        <rect x="645" y="596" width="42" height="128" fill="${palette.highlight}" opacity="0.35" />
      `;
    case "torii":
      return `
        <path d="M0 751c183-44 344-94 507-78 174 17 297 93 475 86 174-7 311-81 618-15v356H0Z" fill="${palette.layerA}" />
        <rect x="686" y="530" width="30" height="270" fill="${palette.accent}" />
        <rect x="884" y="530" width="30" height="270" fill="${palette.accent}" />
        <rect x="636" y="490" width="328" height="38" rx="8" fill="${palette.accent}" />
        <rect x="666" y="448" width="266" height="28" rx="8" fill="${palette.highlight}" opacity="0.64" />
        <path d="M740 1100 716 736 786 736 836 1100Z" fill="${palette.highlight}" opacity="0.18" />
      `;
    case "lantern":
      return `
        <path d="M0 690c115-90 298-118 430-95 145 24 241 80 387 77 153-3 233-43 355-69 140-31 265-12 428 45v452H0Z" fill="${palette.layerA}" />
        <rect x="250" y="212" width="5" height="208" fill="${palette.highlight}" opacity="0.35" />
        <rect x="590" y="165" width="5" height="230" fill="${palette.highlight}" opacity="0.35" />
        <rect x="1000" y="192" width="5" height="256" fill="${palette.highlight}" opacity="0.35" />
        <ellipse cx="252" cy="448" rx="66" ry="84" fill="${palette.glow}" opacity="0.82" />
        <ellipse cx="592" cy="412" rx="76" ry="97" fill="${palette.accent}" opacity="0.8" />
        <ellipse cx="1002" cy="464" rx="84" ry="108" fill="${palette.highlight}" opacity="0.86" />
        <path d="M0 846c102-17 189-74 350-65 152 8 240 90 423 87 194-2 314-94 522-59 121 21 203 58 305 106v185H0Z" fill="${palette.layerB}" />
      `;
    case "garden":
      return `
        <path d="M0 706c169-50 346-68 530-44 203 27 327 103 482 95 189-9 322-108 588-70v413H0Z" fill="${palette.layerA}" />
        <ellipse cx="${350 + sway}" cy="880" rx="246" ry="106" fill="${palette.layerB}" />
        <ellipse cx="${930 - sway}" cy="824" rx="282" ry="116" fill="${palette.layerC}" opacity="0.82" />
        <path d="M239 756c61-115 190-120 286-27-85 31-111 65-136 126-68-7-111-28-150-99Z" fill="${palette.highlight}" opacity="0.38" />
        <path d="M1104 724c59-82 159-111 236-31-77 34-102 71-124 126-56-6-92-27-112-95Z" fill="${palette.highlight}" opacity="0.28" />
        <circle cx="590" cy="731" r="17" fill="${palette.glow}" />
      `;
    case "river":
      return `
        <path d="M0 726c202-50 320-72 496-70 198 3 273 79 458 99 190 20 336-35 646-15v360H0Z" fill="${palette.layerA}" />
        <path d="M1001 1100c-82-78-149-191-286-247-188-78-320-16-511-75-87-27-151-75-204-117V1100Z" fill="${palette.layerC}" opacity="0.78" />
        <path d="M916 1100c-65-64-129-146-233-198-151-75-286-43-450-82-65-16-156-71-233-140V1100Z" fill="${palette.glow}" opacity="0.2" />
      `;
    case "balloons":
      return `
        <path d="M0 740c183-77 354-91 494-40 180-66 327-77 463-25 180-61 398-37 643 72v353H0Z" fill="${palette.layerB}" />
        <path d="M235 347c0-94 65-160 146-160s146 66 146 160c0 61-31 117-86 151l-60 98-60-98c-55-34-86-90-86-151Z" fill="${palette.highlight}" opacity="0.9" />
        <path d="M669 287c0-84 55-143 127-143s127 59 127 143c0 54-27 104-74 135l-53 84-53-84c-47-31-74-81-74-135Z" fill="${palette.glow}" opacity="0.84" />
        <path d="M1118 364c0-70 47-120 108-120s108 50 108 120c0 45-23 86-63 111l-45 72-45-72c-40-25-63-66-63-111Z" fill="${palette.accent}" opacity="0.76" />
      `;
    case "chimneys":
      return `
        <path d="M0 728c183-62 356-81 544-49 160 27 245 89 430 84 204-6 316-79 626-26v363H0Z" fill="${palette.layerA}" />
        <path d="M377 814c13-215 69-351 147-351 66 0 116 105 128 351Z" fill="${palette.layerC}" />
        <path d="M693 824c16-257 81-416 182-416 85 0 149 124 164 416Z" fill="${palette.highlight}" opacity="0.7" />
        <path d="M1052 835c12-196 61-303 132-303 61 0 108 92 121 303Z" fill="${palette.layerC}" opacity="0.9" />
      `;
    case "cave":
      return `
        <path d="M0 720c174-71 350-90 520-52 174 38 294 97 463 84 186-14 327-94 617-43v391H0Z" fill="${palette.layerB}" />
        <path d="M398 790c7-171 75-255 185-255 123 0 176 98 180 255Z" fill="${palette.layerA}" />
        <rect x="516" y="642" width="42" height="65" rx="18" fill="${palette.glow}" opacity="0.6" />
        <rect x="590" y="642" width="42" height="65" rx="18" fill="${palette.glow}" opacity="0.4" />
        <path d="M803 808c6-142 67-216 167-216 110 0 158 84 163 216Z" fill="${palette.layerA}" opacity="0.8" />
        <rect x="891" y="689" width="34" height="52" rx="14" fill="${palette.highlight}" opacity="0.45" />
      `;
    case "valley":
      return `
        <path d="M0 713c141-74 299-90 479-48 168-66 309-67 482 0 168-47 382-24 639 71v364H0Z" fill="${palette.layerA}" />
        <path d="M0 879c156-74 273-106 395-103 164 4 272 126 445 126 152 0 246-102 373-144 123-41 225-33 387 11v331H0Z" fill="${palette.layerC}" opacity="0.8" />
      `;
    case "ridge":
      return `
        <path d="M0 725c207-55 361-108 504-251 119 86 214 107 367 43 116-145 240-194 413-143 110 33 213 91 316 171v455H0Z" fill="${palette.layerA}" />
        <polygon points="243,735 429,385 585,735" fill="${palette.highlight}" opacity="0.92" />
        <polygon points="522,735 789,273 1037,735" fill="${palette.glow}" opacity="0.9" />
        <path d="M0 861c146-25 260-28 391-2 153 31 274 63 449 50 157-13 285-66 462-66 111 0 212 21 298 44v213H0Z" fill="${palette.layerB}" opacity="0.78" />
      `;
    case "lake":
      return `
        <path d="M0 733c183-72 368-102 561-75 163 22 272 98 442 99 159 2 261-52 361-75 102-23 180-21 236-10v428H0Z" fill="${palette.layerA}" />
        <path d="M0 864c166-32 289-40 451-4 157 35 303 87 480 87 188 0 326-63 669-62v215H0Z" fill="${palette.glow}" opacity="0.2" />
      `;
    case "trail":
      return `
        <path d="M0 741c205-61 376-95 551-83 169 12 270 68 406 71 187 4 308-85 643-52v423H0Z" fill="${palette.layerA}" />
        <path d="M836 1100 752 736 842 736 968 1100Z" fill="${palette.layerC}" opacity="0.9" />
        <path d="M870 1100 823 831 864 831 926 1100Z" fill="${palette.highlight}" opacity="0.6" />
      `;
    case "rooftops":
      return `
        <path d="M0 736c112-57 287-95 430-71 131 22 237 88 379 84 151-3 274-63 405-80 134-18 262 9 386 58v373H0Z" fill="${palette.layerA}" />
        <rect x="169" y="620" width="180" height="105" fill="${palette.layerC}" />
        <rect x="376" y="572" width="186" height="152" fill="${palette.layerB}" />
        <rect x="602" y="607" width="167" height="117" fill="${palette.layerC}" />
        <rect x="804" y="550" width="222" height="175" fill="${palette.layerB}" />
        <rect x="1061" y="590" width="176" height="135" fill="${palette.layerC}" />
        <path d="M169 620 259 566 349 620Z M376 572 469 518 562 572Z M602 607 685 560 769 607Z M804 550 915 485 1026 550Z M1061 590 1149 542 1237 590Z" fill="${palette.highlight}" opacity="0.74" />
      `;
    case "courtyard":
      return `
        <path d="M0 736c133-53 303-90 440-74 121 14 222 71 345 73 145 2 248-58 389-73 149-16 289 7 426 66v372H0Z" fill="${palette.layerA}" />
        <rect x="286" y="566" width="1028" height="271" rx="26" fill="${palette.layerB}" />
        <rect x="702" y="617" width="191" height="111" rx="20" fill="${palette.glow}" opacity="0.28" />
        <rect x="742" y="592" width="112" height="45" rx="22" fill="${palette.highlight}" opacity="0.62" />
        <circle cx="592" cy="674" r="45" fill="${palette.accent}" opacity="0.8" />
        <circle cx="996" cy="684" r="62" fill="${palette.highlight}" opacity="0.34" />
      `;
    case "market":
      return `
        <path d="M0 731c147-51 314-75 481-51 149 22 264 88 416 87 173-1 291-76 441-93 134-15 249 11 262 15v411H0Z" fill="${palette.layerA}" />
        <path d="M138 550h237l-58 105H81Z M419 515h260l-63 117H356Z M742 556h269l-65 115H678Z M1090 534h231l-55 105h-286Z" fill="${palette.highlight}" opacity="0.65" />
        <path d="M0 857c162-6 314-82 465-64 163 18 275 118 453 121 179 3 308-92 439-86 76 4 159 26 243 63v109H0Z" fill="${palette.layerC}" opacity="0.76" />
      `;
    case "desert":
      return `
        <path d="M0 731c189-64 373-86 534-58 202 35 335 111 507 111 198 0 332-80 559-38v354H0Z" fill="${palette.layerB}" />
        <path d="M0 870c206-17 323-96 471-121 161-28 287 25 452 48 164 22 282-10 416-44 87-22 175-29 261-22v369H0Z" fill="${palette.layerC}" opacity="0.82" />
        <path d="M0 986c115-21 220-19 336 8 92 22 176 58 323 59 162 1 264-51 393-68 182-24 328 21 548 59v56H0Z" fill="${palette.glow}" opacity="0.24" />
      `;
    case "night-city":
      return `
        <path d="M0 736c131-49 307-90 453-76 137 13 250 67 400 72 151 5 246-45 372-71 146-30 285-21 375-4v443H0Z" fill="${palette.layerA}" />
        <rect x="234" y="596" width="92" height="153" fill="${palette.layerC}" />
        <rect x="362" y="553" width="112" height="197" fill="${palette.layerB}" />
        <rect x="531" y="609" width="78" height="141" fill="${palette.layerC}" />
        <rect x="684" y="530" width="129" height="220" fill="${palette.layerB}" />
        <rect x="845" y="582" width="104" height="168" fill="${palette.layerC}" />
        <rect x="987" y="556" width="146" height="194" fill="${palette.layerB}" />
        <g fill="${palette.highlight}">
          <rect x="256" y="626" width="12" height="12" opacity="0.55" />
          <rect x="286" y="656" width="12" height="12" opacity="0.55" />
          <rect x="392" y="590" width="14" height="14" opacity="0.65" />
          <rect x="424" y="628" width="14" height="14" opacity="0.45" />
          <rect x="713" y="570" width="14" height="14" opacity="0.56" />
          <rect x="745" y="614" width="14" height="14" opacity="0.43" />
          <rect x="1014" y="587" width="15" height="15" opacity="0.53" />
          <rect x="1061" y="628" width="15" height="15" opacity="0.43" />
        </g>
      `;
    default:
      return `
        <path d="M0 724c176-72 355-97 537-74 190 24 303 91 458 88 186-3 318-79 605-26v388H0Z" fill="${palette.layerA}" />
        <ellipse cx="${790 + sway}" cy="854" rx="392" ry="151" fill="${palette.layerB}" opacity="0.9" />
      `;
  }
}

function createSceneImage({ paletteKey, motif, seed = 0.42 }) {
  const palette = palettes[paletteKey] || palettes.fallback;
  const sunX = 240 + seed * 980;
  const sunY = 174 + seed * 76;
  const grainSeed = 6 + Math.round(seed * 100);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${palette.skyTop}" />
          <stop offset="55%" stop-color="${palette.skyMid}" />
          <stop offset="100%" stop-color="${palette.skyBottom}" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.95" />
          <stop offset="70%" stop-color="${palette.glow}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${palette.glow}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.18" />
          <stop offset="55%" stop-color="#000000" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.5" />
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${grainSeed}" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0.065 0.12" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="1600" height="1100" fill="url(#sky)" />
      <circle cx="${sunX}" cy="${sunY}" r="${172 + Math.round(seed * 42)}" fill="url(#sun)" />
      <rect width="1600" height="1100" fill="url(#vignette)" />
      ${buildMotif(motif, palette, seed)}
      <rect width="1600" height="1100" fill="#ffffff" opacity="0.02" />
      <rect width="1600" height="1100" filter="url(#grain)" opacity="0.35" />
    </svg>
  `;
  return encodeSvg(svg);
}

export const mediaProviders = {
  local: {
    baseUrl: new URL("../photos/", import.meta.url),
    thumbnailBaseUrl: new URL("../photos/", import.meta.url),
  },
  cloud: {
    baseUrl: "https://your-cdn.example.com/still-atlas/",
    thumbnailBaseUrl: "https://your-cdn.example.com/still-atlas/",
  },
};

function isDirectAssetUrl(value) {
  return /^(?:https?:)?\/\//.test(value) || /^(?:data|blob|file):/.test(value);
}

function resolveMediaUrl(path, baseUrl) {
  if (!path) {
    return "";
  }

  if (path instanceof URL) {
    return path.href;
  }

  if (isDirectAssetUrl(path) || path.startsWith("/")) {
    return path;
  }

  if (path.startsWith("./") || path.startsWith("../")) {
    return new URL(path, import.meta.url).href;
  }

  if (path.startsWith("assets/")) {
    return new URL(`../../${path}`, import.meta.url).href;
  }

  if (path.startsWith("photos/")) {
    return new URL(`../${path}`, import.meta.url).href;
  }

  return new URL(path, baseUrl).href;
}

function normalizePhotoSource(source, providerKey = "local") {
  if (!source) {
    return null;
  }

  if (typeof source === "string" || source instanceof URL) {
    const provider = mediaProviders[providerKey] ?? mediaProviders.local;
    const resolved = resolveMediaUrl(source, provider.baseUrl);
    return {
      imageUrl: resolved,
      thumbnailUrl: resolved,
    };
  }

  const provider = mediaProviders[source.provider ?? providerKey] ?? mediaProviders.local;
  const thumbnailProvider =
    mediaProviders[source.thumbnailProvider ?? source.provider ?? providerKey] ?? provider;
  const imagePath = source.image ?? source.src ?? source.url;

  if (!imagePath) {
    return null;
  }

  return {
    imageUrl: resolveMediaUrl(imagePath, provider.baseUrl),
    thumbnailUrl: resolveMediaUrl(
      source.thumbnail ?? source.thumb ?? source.preview ?? imagePath,
      thumbnailProvider.thumbnailBaseUrl ?? thumbnailProvider.baseUrl,
    ),
  };
}

const socialLinks = [
  { label: "PHOTO", url: "https://photo.leoneo.top/" },
];

export const siteProfile = {
  siteTitle: "旅行的意义",
  siteUrl: "https://travel.leoneo.top",
  tagline: "读山川、城市与人，也在途中重新认识自己。",
  aboutText: [
    "旅行未必需要一个标准答案。对我来说，它是在陌生的光线、街道和语言里，重新练习观看。",
    "这里以地图为目录，只留下抵达过的地点和少量照片；完整摄影作品仍收录在 PHOTO。",
  ],
  socialLinks,
};

export const siteDisplay = {
  showPhotoDate: true,
};

export const photos = [];

const defaultPresentation = {
  deckTitle: "Travel Chapter",
  heroTags: ["Travel", "Photography", "Archive"],
  periodLabel: "Journey Archive",
};

function buildPhotoRecord(city, entry, photoIndex) {
  const fallbackConfig =
    entry.fallback ?? city.fallback ?? { paletteKey: "fallback", motif: "default", seed: 0.54 };
  const resolvedSource = normalizePhotoSource(entry.source ?? entry.imageUrl ?? entry.image ?? null);
  const generatedImage = createSceneImage(fallbackConfig);
  const imageUrl = resolvedSource?.imageUrl ?? generatedImage;
  const thumbnailUrl = resolvedSource?.thumbnailUrl ?? imageUrl;

  return {
    id: entry.id ?? `${city.id}-${photoIndex + 1}`,
    locationId: city.id,
    title: entry.title,
    description: entry.description ?? "",
    subtitle: entry.subtitle ?? "Curated Frame",
    badges:
      Array.isArray(entry.badges) && entry.badges.length
        ? entry.badges
        : ["摄影档案", "精选镜头", "慢速观看"],
    imageUrl,
    thumbnailUrl,
    alt: entry.alt ?? `${city.name} ${entry.title}`,
    slotLabel: entry.slotLabel ?? `Frame ${String(photoIndex + 1).padStart(2, "0")}`,
    captureDateLabel: entry.captureDateLabel ?? entry.dateLabel ?? "",
    sortOrder: entry.sortOrder ?? photoIndex + 1,
    isHeroCandidate: entry.isHeroCandidate ?? photoIndex === 0,
  };
}

const visibleCityArchive = cityArchive
  .filter((city) => city.isVisible !== false)
  .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));

function deriveCountryLabel(countryOrRegion = "") {
  return countryOrRegion
    .split("/")
    .map((part) => part.trim())
    .find(Boolean) || countryOrRegion;
}

export const locations = visibleCityArchive
  .map((city, cityIndex) => {
    const publicPhotos = (city.photos ?? [])
      .filter((photo) => photo.isVisible !== false)
      .map((photo, photoIndex) => buildPhotoRecord(city, photo, photoIndex))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    if (!publicPhotos.length) {
      return null;
    }

    photos.push(...publicPhotos);

    const heroOverride = normalizePhotoSource(city.heroSource ?? city.heroImage ?? null);
    const heroPhotoIndex = city.heroPhotoIndex ?? 0;
    const heroImage =
      heroOverride?.imageUrl ??
      publicPhotos[heroPhotoIndex]?.imageUrl ??
      publicPhotos[0].imageUrl;

    return {
      id: city.id,
      slug: city.slug,
      name: city.name,
      country_or_region: city.country_or_region,
      countryCodes: Array.isArray(city.countryCodes) ? city.countryCodes : [],
      countryLabel: city.countryLabel ?? deriveCountryLabel(city.country_or_region),
      heroImage,
      summary: city.summary,
      englishName: city.englishName ?? city.slug,
      deckTitle: city.deckTitle ?? defaultPresentation.deckTitle,
      heroTags: city.heroTags ?? defaultPresentation.heroTags,
      periodLabel: city.periodLabel ?? defaultPresentation.periodLabel,
      travelDateLabel:
        city.travelDateLabel ??
        publicPhotos.find((photo) => photo.captureDateLabel)?.captureDateLabel ??
        "",
      featuredCount: publicPhotos.length,
      lat: city.lat,
      lng: city.lng,
      featuredOrder: city.featuredOrder ?? cityIndex + 1,
    };
  })
  .filter(Boolean);

export const fallbackImage = createSceneImage({
  paletteKey: "fallback",
  motif: "default",
  seed: 0.54,
});

export function getLocationPhotos(locationId) {
  return photos
    .filter((photo) => photo.locationId === locationId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
