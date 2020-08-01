import { DuckMap, reduceFromPayload, createToPayload } from "@/utils/saga-duck";
import { fork, put, call, take } from "redux-saga/effects";
import { takeLatest, runAndTakeLatest } from "redux-saga-catch";
import { globalHistory } from "@/utils/index";
import { eventChannel } from "redux-saga";
import { singleton } from "@/utils/index";

@singleton({
  runOnceMethods: ["saga"],
})
export default class RouteDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      ROUTE_NAVIGATE,
      SET_ROUTE_CHANGE_HISTORY,
      SET_ROUTE_PATH,
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
      path: reduceFromPayload<string>(types.SET_ROUTE_PATH, ""),
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      navigate: createToPayload<string>(types.ROUTE_NAVIGATE),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchHistoryChange]);
    yield fork([this, this.watchToNavigate]);
    yield fork([this, this.watchToSetPath]);
  }
  *watchToNavigate() {
    const { types } = this;
    yield takeLatest(types.ROUTE_NAVIGATE, function* (param) {
      yield globalHistory.navigate(param?.payload);
    });
  }
  *watchHistoryChange() {
    const { types, createHistoryChangeChannel } = this;
    const historyChannel = yield call(createHistoryChangeChannel);
    while (true) {
      const payload = yield take(historyChannel);
      if (payload) {
        yield put({
          type: types.SET_ROUTE_CHANGE_HISTORY,
          payload,
        });
      }
    }
  }
  *watchToSetPath() {
    const { types } = this;
    yield runAndTakeLatest(types.SET_ROUTE_CHANGE_HISTORY, function* (param) {
      const path = param?.payload?.location?.pathname ?? location.pathname;
      yield put({
        type: types.SET_ROUTE_PATH,
        payload: path,
      });
    });
  }
  createHistoryChangeChannel() {
    return eventChannel((emit) => {
      globalHistory.listen((history) => {
        emit(history);
      });
      return () => {};
    });
  }
}
