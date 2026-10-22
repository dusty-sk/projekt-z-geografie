import "../world/WorldScene.css";
import "./AtmosphereLandscape.css";
import "./AtmospherePresets.css";

const STARS = Array.from({ length: 94 }, (_, index) => ({
  x: (index * 193 + 71) % 1600,
  y: 24 + ((index * 83 + 29) % 438),
  r: index % 19 === 0 ? 1.8 : index % 6 === 0 ? 1.15 : 0.7,
  o: 0.26 + ((index * 31) % 58) / 100,
  twinkle: index % 13 === 0,
}));

function seeded(index: number, seed: number) {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function coniferPath(x: number, baseY: number, width: number, height: number, lean = 0) {
  const tipX = x + width * (0.5 + lean);
  return [
    `M${x} ${baseY}`,
    `L${x + width * 0.12} ${baseY - height * 0.2}`,
    `L${x + width * 0.3} ${baseY - height * 0.16}`,
    `L${x + width * 0.21} ${baseY - height * 0.38}`,
    `L${x + width * 0.39} ${baseY - height * 0.34}`,
    `L${x + width * 0.3} ${baseY - height * 0.58}`,
    `L${x + width * 0.45} ${baseY - height * 0.54}`,
    `L${tipX} ${baseY - height}`,
    `L${x + width * 0.58} ${baseY - height * 0.54}`,
    `L${x + width * 0.72} ${baseY - height * 0.58}`,
    `L${x + width * 0.63} ${baseY - height * 0.34}`,
    `L${x + width * 0.81} ${baseY - height * 0.38}`,
    `L${x + width * 0.72} ${baseY - height * 0.16}`,
    `L${x + width * 0.88} ${baseY - height * 0.2}`,
    `L${x + width} ${baseY}`,
    "Z",
  ].join(" ");
}

function forestBand(baseY: number, height: number, seed: number, density = 1) {
  const paths: string[] = [];
  let x = -28;
  let index = 0;

  while (x < 1630) {
    const width = 9 + seeded(index, seed) * 14 + height * 0.12;
    if (seeded(index, seed + 6) > 0.1) {
      const treeHeight = height * (0.3 + seeded(index, seed + 1) * 0.78);
      const treeBase = baseY + (seeded(index, seed + 2) - 0.5) * height * 0.2;
      const lean = (seeded(index, seed + 3) - 0.5) * 0.18;
      paths.push(coniferPath(x, treeBase, width, treeHeight, lean));
    }
    x += width * (0.36 + seeded(index, seed + 4) * 0.2) + density * (3 + seeded(index, seed + 5) * 9);
    index += 1;
  }

  return paths.join(" ");
}

function grassTufts() {
  const tufts: Array<{ d: string; delay: number; duration: number }> = [];
  for (let index = 0; index < 58; index += 1) {
    const x = 18 + seeded(index, 41) * 1564;
    const y = 716 + seeded(index, 42) * 164;
    const scale = (0.62 + seeded(index, 43) * 1.15) * (0.8 + ((y - 716) / 164) * 0.5);
    const sway = (seeded(index, 44) - 0.5) * 20;
    const blades = [
      `M${x} ${y} C${x - 4} ${y - 12 * scale} ${x - 8} ${y - 22 * scale} ${x - 14 + sway} ${y - 30 * scale}`,
      `M${x} ${y} C${x + 1} ${y - 14 * scale} ${x + 2} ${y - 26 * scale} ${x + 7 + sway * 0.4} ${y - 34 * scale}`,
      `M${x} ${y} C${x + 5} ${y - 10 * scale} ${x + 9} ${y - 18 * scale} ${x + 16 + sway * 0.2} ${y - 24 * scale}`,
    ];
    tufts.push({
      d: blades.join(" "),
      delay: -((index % 11) * 0.73 + seeded(index, 45) * 1.4),
      duration: 6.4 + seeded(index, 46) * 4.2,
    });
  }
  return tufts;
}

const FAR_FOREST = forestBand(492, 34, 2, 0.8);
const MID_FOREST = forestBand(562, 48, 5, 1);
const NEAR_FOREST = forestBand(636, 64, 8, 1.15);
const EDGE_GRASS = grassTufts();

const FRAME_PINES_LEFT = [
  coniferPath(8, 600, 92, 540, 0.03),
  coniferPath(82, 600, 128, 430, -0.03),
  coniferPath(198, 600, 66, 330, 0.03),
];

const FRAME_PINES_RIGHT = [
  coniferPath(4, 600, 82, 460, -0.02),
  coniferPath(66, 600, 116, 540, 0.03),
  coniferPath(176, 600, 86, 360, -0.01),
];

const BIRDS = [
  { x: 1004, y: 151, scale: 0.78 },
  { x: 1044, y: 136, scale: 0.52 },
  { x: 1085, y: 162, scale: 0.66 },
  { x: 1123, y: 139, scale: 0.44 },
  { x: 1150, y: 173, scale: 0.58 },
  { x: 831, y: 196, scale: 0.46 },
  { x: 864, y: 216, scale: 0.36 },
] as const;

const FIREFLIES = Array.from({ length: 16 }, (_, index) => ({
  x: 7 + seeded(index, 101) * 86,
  y: 62 + seeded(index, 102) * 28,
  size: 0.15 + seeded(index, 103) * 0.13,
  delay: -((index % 7) * 0.83),
  duration: 5.2 + (index % 5) * 0.9,
}));

export function AtmosphereLandscape() {
  return (
    <div className="atmosphere-landscape world-scene">
      <div className="world-scene__sky">
        <span className="world-scene__sky-layer world-scene__sky-layer--dawn" />
        <span className="world-scene__sky-layer world-scene__sky-layer--day" />
        <span className="world-scene__sky-layer world-scene__sky-layer--dusk" />
        <span className="world-scene__sky-layer world-scene__sky-layer--night" />
      </div>

      <div className="world-scene__milky" />

      <svg className="world-scene__stars" viewBox="0 0 1600 520" preserveAspectRatio="xMidYMid slice">
        {STARS.map((star, index) => (
          <circle
            key={index}
            className={`world-scene__star${star.twinkle ? " is-twinkle" : ""}`}
            cx={star.x}
            cy={star.y}
            r={star.r}
            style={{ opacity: star.o, animationDelay: `${(index % 8) * 0.9}s` }}
          />
        ))}
        <path className="world-scene__star-cross" d="M442 119 L442 147 M428 133 L456 133" />
        <path className="world-scene__star-cross" d="M1186 208 L1186 228 M1176 218 L1196 218" />
      </svg>

      <div className="atmosphere-fx atmosphere-fx--aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="atmosphere-fx atmosphere-fx--meteors" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="atmosphere-fx atmosphere-fx--storm" aria-hidden="true" />

      <div className="world-scene__clouds world-scene__clouds--back">
        <svg viewBox="0 0 1600 300" preserveAspectRatio="none">
          <path d="M-60 221 C54 192 124 176 218 182 C292 187 342 160 410 139 C487 115 556 121 614 151 C678 184 742 181 812 164 C898 142 966 155 1026 189 C1083 221 1156 217 1234 188 C1328 153 1420 166 1532 201 L1650 210 L1650 272 L-60 272 Z" />
          <path d="M-80 246 C67 223 189 233 308 246 C434 260 551 247 676 229 C808 210 942 230 1072 245 C1207 261 1348 244 1660 225 L1660 280 L-80 280 Z" />
        </svg>
      </div>

      <div className="world-scene__clouds world-scene__clouds--near">
        <svg viewBox="0 0 1600 260" preserveAspectRatio="none">
          <path d="M-80 144 C47 122 136 128 232 146 C332 165 421 139 527 116 C630 94 726 107 816 136 C914 168 1006 164 1114 139 C1221 114 1330 125 1444 150 C1522 167 1582 169 1660 158 L1660 214 L-80 217 Z" />
        </svg>
      </div>

      <div className="world-scene__sun" />
      <div className="world-scene__moon">
        <span className="world-scene__moon-crater world-scene__moon-crater--a" />
        <span className="world-scene__moon-crater world-scene__moon-crater--b" />
        <span className="world-scene__moon-crater world-scene__moon-crater--c" />
      </div>
      <div className="world-scene__horizon-glow" />

      <svg className="world-scene__birds" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice">
        <g className="world-scene__bird-flock">
          {BIRDS.map((bird, index) => (
            <path
              key={index}
              d="M-8 0 C-5 -4 -2 -4 0 0 C2 -4 5 -4 8 0"
              transform={`translate(${bird.x} ${bird.y}) scale(${bird.scale})`}
            />
          ))}
        </g>
      </svg>

      <svg className="world-scene__terrain" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="atmo-lake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--water-top)" />
            <stop offset="1" stopColor="var(--water-bottom)" />
          </linearGradient>
          <linearGradient id="atmo-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ground-top)" />
            <stop offset="1" stopColor="var(--ground-bottom)" />
          </linearGradient>
          <linearGradient id="atmo-ridge-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ridge-back-top)" />
            <stop offset="1" stopColor="var(--ridge-back-bottom)" />
          </linearGradient>
          <linearGradient id="atmo-ridge-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ridge-far-top)" />
            <stop offset="1" stopColor="var(--ridge-far-bottom)" />
          </linearGradient>
          <linearGradient id="atmo-ridge-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--ridge-mid-top)" />
            <stop offset="1" stopColor="var(--ridge-mid-bottom)" />
          </linearGradient>
        </defs>
        <path
          className="world-scene__ridge world-scene__ridge--back"
          d="M0 438 C80 420 148 390 214 380 C280 370 326 386 392 366 C458 346 506 286 574 254 C642 222 704 240 760 286 C816 332 874 334 940 350 C1006 366 1064 344 1134 360 C1204 376 1262 352 1332 364 C1402 376 1474 352 1540 362 C1570 367 1586 372 1600 368 L1600 580 L0 580 Z"
        />
        <path
          className="world-scene__ridge world-scene__ridge--far"
          d="M0 468 C86 452 142 430 208 436 C274 442 320 476 386 466 C452 456 498 412 560 404 C622 396 666 420 724 446 C782 472 842 468 906 456 C970 444 1020 414 1086 416 C1152 418 1210 450 1274 456 C1338 462 1400 440 1464 446 C1520 451 1570 462 1600 458 L1600 620 L0 620 Z"
        />
        <path
          className="world-scene__ridge world-scene__ridge--shoulder"
          d="M0 518 C92 506 162 508 244 514 C326 520 386 524 454 518 C522 512 584 518 652 512 C720 506 766 422 808 406 C850 390 892 448 938 478 C990 512 1046 520 1110 522 C1174 524 1234 516 1296 518 C1358 520 1418 514 1478 518 C1532 522 1568 518 1600 520 L1600 650 L0 650 Z"
        />
        <g className="world-scene__ridge-lines">
          <path d="M42 493 C116 487 186 496 258 504" />
          <path d="M724 466 C768 446 812 438 856 447" />
          <path d="M846 451 C894 466 926 487 952 506" />
          <path d="M1086 458 C1158 470 1222 478 1298 476" />
          <path d="M1334 462 C1402 468 1470 470 1544 464" />
        </g>
        <path
          className="world-scene__ridge world-scene__ridge--mid"
          d="M0 574 C78 548 148 518 226 520 C304 522 356 550 430 554 C504 558 558 532 632 526 C706 520 764 546 838 550 C912 554 966 530 1042 526 C1118 522 1182 544 1258 552 C1334 560 1406 542 1480 534 C1530 529 1574 532 1600 538 L1600 720 L0 720 Z"
        />

        <path className="world-scene__forest world-scene__forest--far" d={FAR_FOREST} />
        <path className="world-scene__forest world-scene__forest--mid" d={MID_FOREST} />

        <g className="world-scene__fields">
          <path d="M0 566 C126 538 222 533 332 544 C446 555 532 582 640 581 C752 580 840 557 948 557 C1066 557 1168 579 1280 578 C1390 577 1492 558 1600 568" />
          <path d="M0 592 C116 571 232 568 350 578 C464 588 556 607 668 604 C780 601 864 583 976 583 C1090 583 1198 599 1310 596 C1418 593 1508 580 1600 588" />
          <path d="M44 544 C132 531 222 531 306 541 M330 550 C414 540 494 538 572 548" />
        </g>

        <g className="world-scene__village" transform="translate(858 500)">
          <path d="M0 22 L13 9 L27 22 L27 42 L0 42 Z" />
          <path d="M35 29 L44 19 L53 29 L53 42 L35 42 Z" />
          <path d="M67 12 L80 12 L80 42 L67 42 Z" />
          <path d="M63 13 L73.5 -3 L85 13 Z" />
          <path d="M73.5 -3 L73.5 -12" />
          <path className="world-scene__window" d="M71 20 L76 20 L76 26 L71 26 Z" />
          <path className="world-scene__window" d="M6 26 L11 26 L11 32 L6 32 Z" />
          <path className="world-scene__window" d="M41 32 L46 32 L46 38 L41 38 Z" />
        </g>

        <path
          className="world-scene__lake"
          d="M504 650 C574 632 644 630 716 638 C790 646 858 655 928 664 C986 671 1030 676 1074 684 C1028 692 960 692 882 688 C804 684 724 680 652 672 C594 666 534 660 504 650 Z"
        />
        <path
          className="world-scene__shore"
          d="M504 650 C574 632 644 630 716 638 C790 646 858 655 928 664 C986 671 1030 676 1074 684"
        />
        <g className="world-scene__ripples">
          <path d="M574 661 C636 650 700 654 756 664 M548 676 C616 666 694 670 754 680 M698 683 C758 678 818 680 864 685" />
        </g>
        <path className="world-scene__reflection" d="M806 646 C796 660 796 676 804 690 C812 677 813 660 810 648 Z" />

        <path
          className="world-scene__stream"
          d="M1350 561 C1288 589 1232 612 1168 634 C1104 656 1048 673 1004 686"
        />
        <path
          className="world-scene__stream-light"
          d="M1350 561 C1288 589 1232 612 1168 634 C1104 656 1048 673 1004 686"
        />

        <path className="world-scene__forest world-scene__forest--near" d={NEAR_FOREST} />

        <path
          className="world-scene__ground"
          d="M0 694 C90 664 178 650 276 660 C374 670 444 700 526 704 C608 708 660 682 748 688 C836 694 918 720 1008 714 C1098 708 1164 678 1256 684 C1348 690 1470 718 1600 700 L1600 900 L0 900 Z"
        />
        <path
          className="world-scene__lane"
          d="M816 900 C790 846 766 808 801 771 C836 734 868 716 866 686"
        />
        <path
          className="world-scene__lane-light"
          d="M816 900 C790 846 766 808 801 771 C836 734 868 716 866 686"
        />

        <g className="world-scene__meadow">
          <path d="M0 762 C142 742 268 748 394 766 C520 784 634 799 760 789 C886 779 1002 754 1128 758 C1256 762 1400 791 1600 774" />
          <path d="M0 818 C164 795 298 806 428 824 C558 842 684 849 820 836 C956 823 1096 805 1240 814 C1384 823 1490 841 1600 836" />
          <path d="M95 871 C206 851 324 860 438 875 C552 890 666 894 792 885 C918 876 1038 858 1168 866 C1298 874 1440 892 1556 884" />
        </g>

        <g className="world-scene__scatter">
          <path d="M356 715 C372 704 389 704 405 715 C388 720 370 720 356 715 Z" />
          <path d="M1092 704 C1108 691 1127 691 1143 701 C1126 708 1108 709 1092 704 Z" />
          <path d="M1268 737 C1285 726 1305 726 1322 736 C1304 744 1285 745 1268 737 Z" />
          <path d="M225 751 C240 739 260 739 276 749 C258 756 240 757 225 751 Z" />
          <path d="M1420 771 C1438 759 1460 760 1478 770 C1459 778 1438 779 1420 771 Z" />
        </g>
        {EDGE_GRASS.map((tuft, index) => (
          <path
            key={index}
            className="world-scene__grass world-scene__grass-tuft"
            d={tuft.d}
            style={{
              animationDelay: `${tuft.delay}s`,
              animationDuration: `${tuft.duration}s`,
            }}
          />
        ))}
      </svg>

      <div className="world-scene__haze" />
      <div className="world-scene__mist world-scene__mist--far" />
      <div className="world-scene__mist world-scene__mist--near" />

      <div className="world-scene__framing">
        <svg
          className="world-scene__frame-pine world-scene__frame-pine--left"
          viewBox="0 0 270 600"
          fill="none"
        >
          {FRAME_PINES_LEFT.map((d, index) => (
            <path
              key={index}
              className="world-scene__pine"
              d={d}
              style={{
                animationDelay: `${-1.6 - index * 2.3}s`,
                animationDuration: `${10.5 + index * 1.4}s`,
              }}
            />
          ))}
        </svg>
        <svg
          className="world-scene__frame-pine world-scene__frame-pine--right"
          viewBox="0 0 270 600"
          fill="none"
        >
          {FRAME_PINES_RIGHT.map((d, index) => (
            <path
              key={index}
              className="world-scene__pine"
              d={d}
              style={{
                animationDelay: `${-3.2 - index * 1.9}s`,
                animationDuration: `${12 + index * 1.2}s`,
              }}
            />
          ))}
        </svg>
        <svg className="world-scene__frame-tree world-scene__frame-tree--left" viewBox="0 0 240 560" fill="none">
          <path className="world-scene__frame-trunk" d="M119 560 L122 390 L116 270 L120 175" />
          <path className="world-scene__frame-branch" d="M120 430 C92 421 70 402 56 374 M121 389 C150 380 174 360 189 331 M120 342 C92 331 70 311 55 283 M121 300 C151 291 173 271 188 243 M120 252 C98 244 80 228 69 205 M121 219 C144 211 161 195 172 173 M120 178 C106 165 94 149 88 130 M121 154 C136 143 147 129 154 112" />
          <path className="world-scene__frame-needles" d="M83 413 C64 405 50 389 43 368 C62 377 82 386 98 397 M146 374 C168 364 183 346 189 324 C170 334 151 345 135 360 M82 326 C62 317 48 299 41 277 C61 287 79 298 94 311 M146 288 C168 278 182 260 188 238 C170 248 151 259 135 274 M91 244 C76 236 64 224 58 208 C72 214 86 220 99 230 M149 218 C163 209 173 197 179 181 C166 189 153 197 141 206" />
          <path className="world-scene__frame-needles" d="M72 195 C60 186 52 174 48 160 C60 166 72 173 82 182 M149 171 C161 162 169 150 173 136 C162 144 151 151 141 160" />
        </svg>
        <svg className="world-scene__frame-tree world-scene__frame-tree--right" viewBox="0 0 260 520" fill="none">
          <path className="world-scene__frame-trunk" d="M144 520 L140 391 C134 335 136 280 148 226 C154 198 156 168 152 140" />
          <path className="world-scene__frame-branch" d="M140 430 C166 420 189 401 202 374 M138 372 C109 361 84 341 69 312 M145 314 C175 303 199 283 214 254 M144 264 C121 256 103 241 91 218 M149 224 C171 214 186 198 195 176 M153 188 C143 173 137 157 138 139 M151 166 C160 151 165 136 165 118" />
          <path className="world-scene__frame-leaves" d="M107 407 C91 392 83 372 84 349 C102 365 121 381 136 399 M181 382 C197 366 205 346 205 324 C188 339 169 355 154 373 M82 325 C67 309 60 289 61 266 C79 282 97 298 111 316 M190 297 C205 281 212 261 212 239 C195 254 176 270 161 288 M107 246 C95 234 88 219 88 202 C101 213 115 225 126 238 M177 218 C188 204 194 188 193 171 C180 184 166 197 155 211 M104 175 C98 162 97 148 102 135 C109 147 116 159 121 172 M158 158 C166 146 170 133 168 119 C159 130 150 141 143 153" />
        </svg>
      </div>

      <div className="world-scene__fireflies">
        {FIREFLIES.map((fly, index) => (
          <span
            key={index}
            className="world-scene__firefly"
            style={{
              left: `${fly.x}%`,
              top: `${fly.y}%`,
              width: `${fly.size}rem`,
              height: `${fly.size}rem`,
              animationDelay: `${fly.delay}s`,
              animationDuration: `${fly.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="world-scene__vignette" />
      <div className="world-scene__grain" />
    </div>
  );
}
