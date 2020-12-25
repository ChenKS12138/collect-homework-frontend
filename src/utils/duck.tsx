import { useMemo, useEffect, useRef, useState } from "react";
import { createDuckStateHook } from "use-duck-state";
import createSagaMiddleware from "redux-saga";

const middlewares = [];

if (process.env.NODE_ENV !== "production") {
  // tslint:disable-next-line: no-var-requires
  const { createLogger } = require("redux-logger");
  middlewares.push(
    createLogger({
      collapsed: true,
    })
  );
}

export const useDuckState = createDuckStateHook(
  {
    useEffect,
    createSagaMiddleware,
    useMemo,
    useRef,
    useState,
  },
  middlewares
);
