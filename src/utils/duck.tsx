import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { Provider } from "react-redux";
import { DuckRuntime, DuckMap, DuckOptions, INIT, END } from "saga-duck";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { parallel } from "redux-saga-catch";

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({ collapsed: true });

// saga-duck 缺少declare文件
// export * from "../../node_modules/saga-duck/build/index";

export const connectWithDuck = (Component, Duck, middlewares = []) => {
  return () => {
    const allMiddlewares =
      process.env.NODE_ENV === "development"
        ? [createLogger({ collapsed: true }), ...middlewares]
        : [...middlewares];
    const duck = new Duck();
    const duckRuntime = new DuckRuntime(duck, ...allMiddlewares);
    const ConnectedComponent = duckRuntime.root()(
      duckRuntime.connect()(Component)
    );
    return (
      <Provider store={duckRuntime.store}>
        <ConnectedComponent />
      </Provider>
    );
  };
};

export function useSagaDuckState<T extends DuckMap = any>(
  DM: new (options?: DuckOptions) => T
) {
  const [duck] = useState(new DM());
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
  }, [duck, duck.ducks]);
  const [state, dispatch]: [any, any] = useReducer(
    duck.reducer as any,
    initState as any
  );

  const store = useMemo(() => {
    let tmp = state;
    return {
      getState: () => tmp,
      updateState: (s) => {
        tmp = s;
      },
      dispatch: dispatch,
    };
  }, []);

  store.updateState(state);
  const enhanceDispatch = useMemo(() => {
    return applyMiddleware(loggerMiddleware, sagaMiddleware)(store, dispatch);
  }, []);

  useEffect(() => {
    sagaMiddleware.run(function* () {
      yield parallel(duck.sagas);
    });
    dispatch({ type: INIT });

    return () => {
      dispatch({ type: END });
    };
  }, []);
  return {
    store: state as typeof duck.State,
    dispatch: enhanceDispatch as typeof dispatch,
    duck,
  };
}

function applyMiddleware(...middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse();

  return (store, dispatch) => {
    middlewares.forEach(
      (middleware) => (dispatch = middleware(store)(dispatch))
    );

    return dispatch;
  };
}
