import React, { createContext, useContext } from "react";

interface TransitionContextType {
  startPosterTransition: (options: any) => void;
  registerDestinationPoster: (id: string | number, element: HTMLElement | null) => void;
  activeId: string | number | null;
  activePosterUrl: string | null;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  startPosterTransition: () => {},
  registerDestinationPoster: () => {},
  activeId: null,
  activePosterUrl: null,
  isTransitioning: false,
});

export function usePosterTransition() {
  return useContext(TransitionContext);
}

export function SharedPosterTransitionProvider({ children }: { children: React.ReactNode }) {
  return (
    <TransitionContext.Provider
      value={{
        startPosterTransition: () => {},
        registerDestinationPoster: () => {},
        activeId: null,
        activePosterUrl: null,
        isTransitioning: false,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
