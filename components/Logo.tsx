export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M10 26 H38 L34 42 H14Z" fill="#ec4f8b" />
      <path d="M16 26 L18 42 M24 26 V42 M32 26 L30 42" stroke="#fff" strokeWidth="1.5" opacity=".6" />
      <path d="M9 26 Q7 16 17 15 Q18 7 26 8 Q35 8 34 15 Q42 16 39 26Z" fill="#ffc2d6" />
      <circle cx="24" cy="6" r="3.2" fill="#e5254f" />
    </svg>
  );
}
