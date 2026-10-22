import React from "react";

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: string;
  distance?: number;
  once?: boolean;
  threshold?: number;
  index?: number;
  staggerDelay?: number;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className = "",
  as: Component = "div",
  style,
  ...props
}: ScrollRevealProps) {
  return (
    <Component style={style} className={className} {...props}>
      {children}
    </Component>
  );
}

export function useScrollRevealContainer<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = React.useRef<T>(null);
  return containerRef;
}
