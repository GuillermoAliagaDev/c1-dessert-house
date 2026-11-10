// Dulces estilo "jelly" con brillo, usados como decoración.
export const CANDY_KINDS = ["round", "heart", "star", "bean", "wrapped", "swirl"] as const;
export type CandyKind = (typeof CANDY_KINDS)[number];
export const CANDY_COLORS = ["#ff4d8d", "#ff9f1c", "#ffd23f", "#3ddc97", "#35b8ff", "#a66bff"];

export default function CandyShape({ kind, color, className = "" }: { kind: CandyKind; color: string; className?: string }) {
  const shine = <ellipse cx="17" cy="15" rx="7" ry="4" fill="#fff" opacity=".7" transform="rotate(-30 17 15)" />;
  const stroke = { stroke: "rgba(0,0,0,.18)", strokeWidth: 2 } as const;
  let body: React.ReactNode;
  switch (kind) {
    case "heart":
      body = <path d="M24 42 C4 28 6 10 17 10 C21 10 24 13 24 16 C24 13 27 10 31 10 C42 10 44 28 24 42Z" fill={color} {...stroke} />;
      break;
    case "star":
      body = <path d="M24 5 L30 18 L44 19 L33 29 L37 43 L24 35 L11 43 L15 29 L4 19 L18 18Z" fill={color} strokeLinejoin="round" {...stroke} />;
      break;
    case "bean":
      body = <rect x="6" y="14" width="36" height="22" rx="11" fill={color} transform="rotate(-25 24 24)" {...stroke} />;
      break;
    case "wrapped":
      body = (
        <>
          <path d="M2 14 L14 24 L2 34Z M46 14 L34 24 L46 34Z" fill={color} {...stroke} />
          <circle cx="24" cy="24" r="14" fill={color} {...stroke} />
        </>
      );
      break;
    case "swirl":
      body = (
        <>
          <circle cx="24" cy="24" r="18" fill="#fff" {...stroke} />
          <path d="M24 24 m0 -3 a3 3 0 1 1 -3 3 a7 7 0 1 1 7 7 a11 11 0 1 1 -11 -11" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        </>
      );
      break;
    default:
      body = <circle cx="24" cy="24" r="18" fill={color} {...stroke} />;
  }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {body}
      {kind !== "swirl" && shine}
    </svg>
  );
}
