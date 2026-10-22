import { useState } from "react";

export function CachedImage({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = useState(false);

  if (error || !src) {
    // Fallback if the image fails to load
    return <div className={`bg-white/10 rounded-sm ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      decoding="async"
      loading={props.loading || "lazy"}
      onError={() => setError(true)}
      {...props}
    />
  );
}
