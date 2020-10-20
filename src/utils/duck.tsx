import React, { useMemo, useEffect, useReducer, useCallback } from "react";
import { DuckMap, DuckOptions, INIT, END } from "saga-duck";
import { parallel } from "redux-saga-catch";
import { useReactSaga } from "use-react-saga";

let createEnhanceDispatch = (dispatch, state) => dispatch;

if (process.env.NODE_ENV !== "production") {
  const { createLogger } = require("redux-logger");
  const loggerMiddleware = createLogger({ collapsed: true });
  createEnhanceDispatch = (dispatch, state) => {
    return loggerMiddleware({ getState: () => state, dispatch })(dispatch);
  };
}

export function useSagaDuckState<T extends DuckMap = any>(
  DM: new (options?: DuckOptions) => T
) {
  const duck = useMemo(() => {
    return new DM();
  }, []);
  const initState = useMemo(() => {
    const makeState = (obj) => {
      const state = {};
      for (const key in obj) {
        state[key] = {};
        for (const duckKey in obj[key]?.ducks) {
          state[key][duckKey] = makeState(obj[key]?.ducks);
        }
      }
      return state;
    };
    return makeState(duck.ducks);
  }, []);
  const init = useCallback((state) => {
    return state;
  }, []);
  const [state, dispatch]: [any, any] = useReducer(
    duck.reducer as any,
    initState as any,
    init as any
  );

  const enhanceDispatch = useReactSaga({
    state,
    dispatch: createEnhanceDispatch(dispatch, state),
    saga: function* () {
      yield parallel(duck.sagas);
    },
  });

  useEffect(() => {
    enhanceDispatch({ type: INIT });
    return () => {
      enhanceDispatch({ type: END });
    };
  }, []);

  return {
    store: state as typeof duck.State,
    dispatch: enhanceDispatch as typeof dispatch,
    duck,
  };
}
