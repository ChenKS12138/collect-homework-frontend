import React, { useMemo, useEffect, useReducer } from "react";
import { DuckMap, DuckOptions, INIT, END } from "saga-duck";
import { createLogger } from "redux-logger";
import { parallel } from "redux-saga-catch";
import { useReactSaga } from "use-react-saga";

const loggerMiddleware = createLogger({ collapsed: true });

// export const connectWithDuck = (Component, Duck, middlewares = []) => {
//   return () => {
//     const allMiddlewares =
//       process.env.NODE_ENV === "development"
//         #? [createLogger({ collapsed: true }), ...middlewares]
//         : [...middlewares];
//     const duck = new Duck();
//     const duckRuntime = new DuckRuntime(duck, ...allMiddlewares);
//     const ConnectedComponent = duckRuntime.root()(
//       duckRuntime.connect()(Component)
//     );
//     return (
//       <Provider store={duckRuntime.store}>
//         <ConnectedComponent />
//       </Provider>
//     );
//   };
// };

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
  const [state, dispatch]: [any, any] = useReducer(
    duck.reducer as any,
    initState as any
  );

  const enhanceDispatch = useReactSaga({
    state,
    dispatch:
      process.env.NODE_ENV === "production"
        ? dispatch
        : loggerMiddleware({ getState: () => state, dispatch })(dispatch),
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
