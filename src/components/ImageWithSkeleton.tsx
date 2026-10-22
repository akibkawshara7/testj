import React, { useState } from "react";

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
}

export function ImageWithSkeleton({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  skeletonClassName = "",
  fallbackSrc,
  ...props
}: ImageWithSkeletonProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-card/40 ${wrapperClassName}`}>
      {hasError ? (
        <div
          className={`absolute inset-0 size-full skeleton-box z-0 pointer-events-none flex items-center justify-center ${skeletonClassName}`}
        >
          <span className="text-[10px] text-muted-foreground/50 font-medium px-2 text-center select-none">
            {alt || "Image"}
          </span>
        </div>
      ) : currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          decoding="async"
          loading={props.loading || "lazy"}
          onError={handleError}
          className={`size-full ${className}`}
          {...props}
        />
      ) : null}
    </div>
  );
}
