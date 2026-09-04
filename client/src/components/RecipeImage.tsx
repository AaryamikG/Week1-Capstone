import type { SyntheticEvent } from "react";

const PLACEHOLDER = "/placeholder-recipe.svg";

function handleError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src.endsWith(PLACEHOLDER)) return;
  img.src = PLACEHOLDER;
}

export default function RecipeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={src || PLACEHOLDER}
      alt={alt}
      onError={handleError}
    />
  );
}
