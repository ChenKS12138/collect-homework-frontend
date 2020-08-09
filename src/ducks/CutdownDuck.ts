import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";
import { eventChannel, EventChannel } from "redux-saga";
import { takeLatest } from "redux-saga-catch";
import { put, take, fork } from "redux-saga/effects";

export default class CutdownDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      INVOKE_CUTDOWN,
      SET_SECONDS,
      SET_ACTIVE,
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
      seconds: reduceFromPayload<number>(types.SET_SECONDS, 0),
      active: reduceFromPayload<boolean>(types.SET_ACTIVE, false),
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      invoke: createToPayload<number>(types.INVOKE_CUTDOWN),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToInvoke]);
  }
  *watchToInvoke() {
    const { createCutdownChannel, types } = this;
    yield takeLatest([types.INVOKE_CUTDOWN], function* (action) {
      const seconds = parseInt(action?.payload);
      if (seconds <= 0) return;
      const cutdownChannel = createCutdownChannel(seconds);
      let rest = seconds;
      yield put({
        type: types.SET_ACTIVE,
        payload: true,
      });
      while (rest >= 0) {
        yield put({
          type: types.SET_SECONDS,
          payload: rest,
        });
        rest = yield take(cutdownChannel);
      }
      yield put({
        type: types.SET_ACTIVE,
        payload: false,
      });
    });
  }
  createCutdownChannel(seconds: number): EventChannel<number> {
    return eventChannel((emit) => {
      let rest = seconds;
      const timer = setInterval(() => {
        emit(--rest);
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    });
  }
}
