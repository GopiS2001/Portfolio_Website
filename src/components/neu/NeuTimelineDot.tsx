/** Small pressed circle with an accent core, sitting in the timeline groove. */
export function NeuTimelineDot({ active, className = "" }: { active?: boolean; className?: string }) {
  return (
    <span aria-hidden className={`neu-in-sm grid size-7 place-items-center rounded-full ${className}`}>
      <span
        className={`size-2.5 rounded-full bg-gradient-to-br from-accent to-accent-2 ${active ? "animate-pulse-dot" : ""}`}
      />
    </span>
  );
}
