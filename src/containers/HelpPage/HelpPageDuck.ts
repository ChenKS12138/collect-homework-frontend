import { DuckMap, reduceFromPayload, createToPayload } from "@/utils";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest, runAndTakeLatest } from "redux-saga-catch";
import { BasePageDuck } from "@/ducks/index";

interface HelpPageParam {}

export default class HelpPageDuck extends BasePageDuck {
  IParams: HelpPageParam;
  get RoutePath() {
    return ["/help"];
  }
  get quickTypes() {
    enum Types {
      SET_SHOW_REGISTRY,
    }
    return {
      ...super.quickTypes,
      ...Types,
    };
  }
  get reducers() {
    const { types } = this;
    return {
      ...super.reducers,
      showRegistry: reduceFromPayload<boolean>(types.SET_SHOW_REGISTRY, false),
    };
  }
  get rawSelectors() {
    return {
      ...super.rawSelectors,
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
    };
  }
  get quickDucks() {
    return {
      ...super.quickDucks,
    };
  }
  *saga() {
    yield* super.saga();
  }
}
