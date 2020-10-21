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
  prefetchResult: any;
}

export function PrefetchResultProvider({
  children,
  prefetchResult,
}: IPrefetchResultProvider) {
  return (
    <PrefetchContext.Provider value={prefetchResult}>
      {children}
    </PrefetchContext.Provider>
  );
}
