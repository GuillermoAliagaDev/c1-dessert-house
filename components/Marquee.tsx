import CandyShape, { CANDY_COLORS, CANDY_KINDS } from "./CandyShape";

const WORDS = ["Tortas", "Cheesecakes", "Tres leches", "Cuchareables", "Kekes", "Mazamorra morada", "Hecho con amor"];

export default function Marquee() {
  const row = [...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y-4 border-white bg-gradient-to-r from-[#ff4d8d] via-[#ff9f1c] to-[#a66bff] py-3 shadow-[0_6px_0_rgba(236,79,139,.2)]" aria-hidden="true">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap font-script text-2xl text-white [text-shadow:0_3px_0_rgba(0,0,0,.2)]">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w}
            <CandyShape kind={CANDY_KINDS[i % CANDY_KINDS.length]} color={CANDY_COLORS[(i + 2) % CANDY_COLORS.length]} className="animate-wiggle h-8 w-8" />
          </span>
        ))}
      </div>
    </div>
  );
}
