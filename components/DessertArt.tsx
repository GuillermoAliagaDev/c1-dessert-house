// Ilustraciones SVG de cada postre (sirven como "fotos" hasta que subas las tuyas).

export const ART_OPTIONS: { value: string; label: string }[] = [
  { value: "chocolate", label: "Torta de chocolate" },
  { value: "tresleches", label: "Tres leches" },
  { value: "cheese-maracuya", label: "Cheesecake maracuyá" },
  { value: "cheese-frutos", label: "Cheesecake frutos rojos" },
  { value: "cheese-oreo", label: "Cheesecake Oreo" },
  { value: "alfajor-cup", label: "Cuchareable" },
  { value: "keke", label: "Keke de vainilla" },
  { value: "zanahoria", label: "Keke de zanahoria" },
  { value: "mazamorra", label: "Mazamorra morada" },
];

function Plate() {
  return (
    <>
      <ellipse cx="100" cy="168" rx="82" ry="14" fill="#f8c9d8" />
      <ellipse cx="100" cy="164" rx="76" ry="11" fill="#fff" />
    </>
  );
}

function Berry({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -10 C10 -10 12 2 0 14 C-12 2 -10 -10 0 -10Z" fill="#e5254f" />
      <path d="M-5 -10 L0 -15 L5 -10 L0 -8Z" fill="#3f9b4b" />
      <g fill="#ffd9a0">
        <circle cx="-3" cy="-2" r="1" />
        <circle cx="3" cy="0" r="1" />
        <circle cx="0" cy="5" r="1" />
      </g>
    </g>
  );
}

function Layered({ a, b, frosting, top }: { a: string; b: string; frosting: string; top: React.ReactNode }) {
  return (
    <>
      <Plate />
      <rect x="40" y="92" width="120" height="68" rx="14" fill={a} />
      <rect x="40" y="112" width="120" height="10" fill={frosting} />
      <rect x="40" y="134" width="120" height="10" fill={frosting} />
      <rect x="40" y="92" width="120" height="68" rx="14" fill="none" stroke={b} strokeWidth="2" opacity=".35" />
      <path
        d="M36 96 Q36 76 62 76 H138 Q164 76 164 96 Q164 108 152 104 Q146 118 138 104 Q130 112 122 104 Q112 120 102 104 Q92 114 84 104 Q76 118 68 104 Q58 110 52 104 Q36 108 36 96Z"
        fill={frosting}
      />
      {top}
    </>
  );
}

function Cheesecake({ topping }: { topping: React.ReactNode }) {
  return (
    <>
      <Plate />
      <path d="M36 120 H164 L156 160 Q100 172 44 160Z" fill="#b9793f" />
      <path d="M38 96 H162 L164 124 H36Z" fill="#fff1d6" />
      <path d="M36 96 Q100 70 164 96 Q100 112 36 96Z" fill="#fffaf0" />
      {topping}
    </>
  );
}

export default function DessertArt({ art, className = "" }: { art: string; className?: string }) {
  let body: React.ReactNode;
  switch (art) {
    case "chocolate":
      body = (
        <Layered
          a="#6b3a22"
          b="#3b1c0e"
          frosting="#3f2012"
          top={
            <>
              <path d="M70 76 Q78 54 90 70 Q100 46 110 70 Q122 54 130 76Z" fill="#5a2c17" />
              <Berry x={100} y={52} s={1.1} />
              <circle cx="68" cy="82" r="4" fill="#ffd1dc" />
              <circle cx="132" cy="82" r="4" fill="#ffd1dc" />
            </>
          }
        />
      );
      break;
    case "tresleches":
      body = (
        <Layered
          a="#f6dca8"
          b="#c99a52"
          frosting="#fffaf3"
          top={
            <>
              <circle cx="78" cy="70" r="11" fill="#fff" />
              <circle cx="100" cy="64" r="12" fill="#fff" />
              <circle cx="122" cy="70" r="11" fill="#fff" />
              <Berry x={100} y={50} />
              <circle cx="82" cy="86" r="2" fill="#a9622b" />
              <circle cx="116" cy="88" r="2" fill="#a9622b" />
            </>
          }
        />
      );
      break;
    case "cheese-maracuya":
      body = (
        <Cheesecake
          topping={
            <>
              <path d="M44 98 Q100 78 156 98 Q150 110 140 104 Q130 116 120 106 Q108 118 96 106 Q84 116 74 106 Q60 114 50 106Z" fill="#f6b813" />
              <g fill="#3b2a12">
                {[70, 92, 112, 132, 82, 122].map((x, i) => (
                  <ellipse key={i} cx={x} cy={92 + (i % 3) * 5} rx="2.4" ry="3.2" />
                ))}
              </g>
            </>
          }
        />
      );
      break;
    case "cheese-frutos":
      body = (
        <Cheesecake
          topping={
            <>
              <path d="M44 98 Q100 78 156 98 Q150 114 140 106 Q130 118 120 108 Q108 120 96 108 Q84 118 74 108 Q60 116 50 108Z" fill="#c8223f" />
              <Berry x={78} y={86} s={0.8} />
              <circle cx="108" cy="82" r="7" fill="#3d3a8c" />
              <circle cx="124" cy="90" r="6" fill="#3d3a8c" />
              <circle cx="96" cy="90" r="6" fill="#e0405f" />
              <circle cx="140" cy="94" r="5" fill="#e0405f" />
            </>
          }
        />
      );
      break;
    case "cheese-oreo":
      body = (
        <Cheesecake
          topping={
            <>
              <path d="M44 98 Q100 78 156 98 Q150 108 100 104 Q50 108 44 98Z" fill="#5b4a46" />
              {[72, 100, 130].map((x, i) => (
                <g key={x}>
                  <circle cx={x} cy={88 + (i % 2) * 6} r="10" fill="#2a1d1a" />
                  <circle cx={x} cy={88 + (i % 2) * 6} r="5" fill="#f4eee4" />
                </g>
              ))}
            </>
          }
        />
      );
      break;
    case "alfajor-cup":
      body = (
        <>
          <Plate />
          <path d="M56 70 H144 L134 156 Q100 166 66 156Z" fill="#fff" fillOpacity=".7" stroke="#f1b7c8" strokeWidth="3" />
          <path d="M60 100 H140 L136 124 Q100 132 64 124Z" fill="#d68a3c" />
          <path d="M64 124 Q100 132 136 124 L134 140 Q100 148 66 140Z" fill="#fff6ea" />
          <path d="M66 140 Q100 148 134 140 L133 152 Q100 160 67 152Z" fill="#c26a24" />
          <path d="M58 78 Q100 66 142 78 L141 100 H59Z" fill="#fff6ea" />
          <circle cx="100" cy="64" r="20" fill="#e6b678" />
          <circle cx="100" cy="64" r="20" fill="none" stroke="#c48a45" strokeWidth="3" />
          <circle cx="100" cy="64" r="8" fill="#fff" opacity=".85" />
          <circle cx="76" cy="72" r="9" fill="#e6b678" />
          <circle cx="126" cy="72" r="9" fill="#e6b678" />
        </>
      );
      break;
    case "keke":
      body = (
        <>
          <Plate />
          <path d="M36 150 Q36 96 100 90 Q164 96 164 150Z" fill="#f2c36b" />
          <path d="M36 150 Q36 96 100 90 Q164 96 164 150" fill="none" stroke="#d99a3a" strokeWidth="4" />
          <path d="M64 108 Q100 78 136 108" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".55" />
          <path d="M60 118 Q100 98 140 118" fill="none" stroke="#e5a847" strokeWidth="3" strokeLinecap="round" />
          <g fill="#fff" opacity=".8">
            <circle cx="70" cy="130" r="2" />
            <circle cx="100" cy="124" r="2" />
            <circle cx="130" cy="132" r="2" />
          </g>
        </>
      );
      break;
    case "zanahoria":
      body = (
        <Layered
          a="#e08a3c"
          b="#a95a1e"
          frosting="#fff3e0"
          top={
            <>
              <path d="M88 60 L100 40 L112 60Z" fill="#f2751b" transform="rotate(14 100 56)" />
              <path d="M96 40 Q92 30 86 32 M100 40 Q100 28 100 24 M104 40 Q110 30 116 32" stroke="#3f9b4b" strokeWidth="3" fill="none" strokeLinecap="round" transform="rotate(14 100 56)" />
              <circle cx="72" cy="78" r="4" fill="#b88543" />
              <circle cx="128" cy="78" r="4" fill="#b88543" />
            </>
          }
        />
      );
      break;
    case "mazamorra":
      body = (
        <>
          <Plate />
          <path d="M40 104 H160 Q160 160 100 162 Q40 160 40 104Z" fill="#fff" stroke="#f1b7c8" strokeWidth="3" />
          <ellipse cx="100" cy="104" rx="60" ry="14" fill="#5b1e5c" />
          <ellipse cx="100" cy="102" rx="54" ry="10" fill="#7a2c78" />
          <rect x="84" y="82" width="9" height="9" rx="2" fill="#f6b813" />
          <rect x="108" y="86" width="9" height="9" rx="2" fill="#f6b813" />
          <circle cx="128" cy="100" r="4" fill="#d2223c" />
          <circle cx="76" cy="102" r="4" fill="#d2223c" />
          <path d="M92 90 L140 62" stroke="#a9622b" strokeWidth="6" strokeLinecap="round" />
          <path d="M96 94 L144 66" stroke="#c98448" strokeWidth="2" strokeLinecap="round" />
        </>
      );
      break;
    default:
      body = <Plate />;
  }
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      {body}
    </svg>
  );
}
