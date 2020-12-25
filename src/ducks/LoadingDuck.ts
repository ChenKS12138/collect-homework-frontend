import { takeLatest } from "redux-saga-catch";
import { fork, put, select } from "redux-saga/effects";
import { createToPayload, Duck, reduceFromPayload } from "use-duck-state";

export default class LoadingDuck extends Duck {
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
    yield fork([this, this.watchLoadingAdd]);
    yield fork([this, this.watchLoadingDone]);
  }
  *watchLoadingAdd() {
    const { types, selectors } = this;
    // loading add
    yield takeLatest([types.LOADING_ADD], function* () {
      const { count } = selectors(yield select());
      yield put({
        type: types.SET_LOADING_COUNT,
        payload: (count ?? 0) + 1,
      });
    });
  }
  *watchLoadingDone() {
    const { types, selectors } = this;
    // loading done
    yield takeLatest([types.LOADING_DONE], function* () {
      const { count } = selectors(yield select());
      yield put({
        type: types.SET_LOADING_COUNT,
        payload: (count ?? 0) - 1,
      });
    });
  }
}
