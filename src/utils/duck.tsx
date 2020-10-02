import React from "react";
import { Provider } from "react-redux";
import { DuckRuntime, DuckMap } from "saga-duck";
import { createLogger } from "redux-logger";

// saga-duck 缺少declare文件
export * from "../../node_modules/saga-duck/build/index";

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
