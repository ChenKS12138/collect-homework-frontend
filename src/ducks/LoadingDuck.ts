import { takeLatest } from "redux-saga-catch";
import { fork, put, select } from "redux-saga/effects";
import { createToPayload, DuckMap, reduceFromPayload } from "saga-duck";

export default class LoadingDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_LOADING_COUNT,
      LOADING_ADD,
      LOADING_DONE,
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
      count: reduceFromPayload<number>(types.SET_LOADING_COUNT, 0),
    };
  }
  get rawSelectors() {
    type State = this["State"];
    return {
      isLoading(state: State) {
        return state.count > 0;
      },
    };
  }
  get creators() {
    const { types } = this;
    return {
      add: () => ({ type: types.LOADING_ADD }),
      done: () => ({ type: types.LOADING_DONE }),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchLoadingAdd]);
    yield fork([this, this.watchLoadingDone]);
  }
  *watchLoadingAdd() {
    const { types, selector } = this;
    // loading add
    yield takeLatest([types.LOADING_ADD], function* () {
      const { count } = selector(yield select());
      yield put({
        type: types.SET_LOADING_COUNT,
        payload: (count ?? 0) + 1,
      });
    });
  }
  *watchLoadingDone() {
    const { types, selector } = this;
    // loading done
    yield takeLatest([types.LOADING_DONE], function* () {
      const { count } = selector(yield select());
      yield put({
        type: types.SET_LOADING_COUNT,
        payload: (count ?? 0) - 1,
      });
    });
  }
}
