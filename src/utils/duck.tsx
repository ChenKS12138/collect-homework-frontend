import React, { useMemo, useEffect, useReducer, useCallback } from "react";
import { DuckMap, DuckOptions, INIT, END } from "saga-duck";
import { parallel } from "redux-saga-catch";
import { useReactSaga } from "use-react-saga";

export function useSagaDuckState<T extends DuckMap = any>(
  DM: new (options?: DuckOptions) => T
) {
  const duck = useMemo(() => {
    return new DM();
  }, []);

  const [state, dispatch]: [any, any] = useReducer(
    logger(duck.reducer) as any,
    duck.reducer(undefined, { type: "INIT" })
  );

  const enhanceDispatch = useReactSaga({
    state,
    dispatch,
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

const getCurrentTimeFormatted = () => {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const logger =
  process.env.NODE_ENV === "development"
    ? (reducer) => {
        const reducerWithLogger = useCallback(
          (state, action) => {
            const next = reducer(state, action);
            console.groupCollapsed(
              `%cAction: %c${action.type} %cat ${getCurrentTimeFormatted()}`,
              "color: black; font-weight: bold;",
              "color: bl; font-weight: bold;",
              "color: grey; font-weight: lighter;"
            );
            console.log(
              "%cPrevious State:",
              "color: #9E9E9E; font-weight: 700;",
              state
            );
            console.log(
              "%cAction:",
              "color: #00A7F7; font-weight: 700;",
              action
            );
            console.log(
              "%cNext State:",
              "color: #47B04B; font-weight: 700;",
              next
            );
            console.groupEnd();
            return next;
          },
          [reducer]
        );

        return reducerWithLogger;
      }
    : (reducer) => reducer;
