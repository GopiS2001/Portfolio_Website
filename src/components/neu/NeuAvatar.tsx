/** Photo in a concave ring; falls back to the person's initials. */
export function NeuAvatar({
  src,
  name,
  className = "",
  rounded = "rounded-full",
}: {
  src?: string;
  name: string;
  className?: string;
  /** rounded-full for the hero orb, a card radius for the About portrait */
  rounded?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`neu-concave p-3 sm:p-4 ${rounded} ${className}`}>
      <div className={`neu-in relative size-full overflow-hidden p-2 ${rounded}`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className={`size-full object-cover ${rounded}`} />
        ) : (
          <span
            aria-label={name}
            className="text-grad grid size-full place-items-center font-display text-7xl font-bold"
          >
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
