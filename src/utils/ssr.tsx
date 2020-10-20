import React, { useContext } from "react";
import { useMemo } from "react";

const PrefetchContext = React.createContext<any>("ssrPrefetch");

export function usePrefetchResult<T = any>(selector: (state: any) => T) {
  const state = useContext(PrefetchContext);
  const value = useMemo(() => {
    return selector(state);
  }, [selector]);
  return value;
}

interface IPrefetchResultProvider {
  children: any;
}

export function PrefetchResultProvider({ children }: IPrefetchResultProvider) {
  return (
    <PrefetchContext.Provider value={PrefetchContext}>
      {children}
    </PrefetchContext.Provider>
  );
}
