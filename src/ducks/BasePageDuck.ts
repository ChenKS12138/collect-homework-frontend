import { RouteDuck } from "@/ducks/index";
import { reduceFromPayload, DuckMap } from "saga-duck";
import { match, pathToRegexp } from "path-to-regexp";
import { RootDuck } from "@/containers/App";
import { put, fork, call } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";

export default abstract class BasePageDuck extends DuckMap {
  abstract IParams;
  get RoutePath(): string | string[] {
    return [];
  }
  get quickTypes() {
    enum Types {
      INVOKE_MAIN,
      SET_ROUTE_PARAM,
    }
    return {
      ...super.quickTypes,
      ...Types,
    };
  }
  get ducks() {
    return {
      ...super.ducks,
    };
  }
  get reducers() {
    const { types } = this;
    return {
      ...super.reducers,
      params: reduceFromPayload<this["IParams"]>(types.SET_ROUTE_PARAM, null),
    };
  }
  get quickDucks() {
    return {
      ...super.quickDucks,
      ...RootDuck.globalDuck,
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToSetParam]);
    yield fork([this, this.watchToInvokeMain]);
  }
  *main(): any {}
  *watchToSetParam() {
    const { RoutePath, types, IParams, main } = this;
    yield takeLatest(this.ducks.route.types.SET_ROUTE_PATH, function* (param) {
      const currentPath = param?.payload ?? "";
      const RoutePathArray = Array.isArray(RoutePath) ? RoutePath : [RoutePath];
      if (
        RoutePathArray.some((routePath) =>
          pathToRegexp(routePath).test(currentPath)
        )
      ) {
        const params = RoutePathArray?.reduce((accumulate, current) => {
          const matched: any = match(current)(currentPath);
          return {
            ...accumulate,
            ...matched?.params,
          };
        }, {} as typeof IParams);
        yield put({
          type: types.SET_ROUTE_PARAM,
          payload: params,
        });
        yield call([this, main]);
      }
    });
  }
  *watchToInvokeMain() {
    const { types, main } = this;
    yield takeLatest(types.INVOKE_MAIN, main);
  }
}
