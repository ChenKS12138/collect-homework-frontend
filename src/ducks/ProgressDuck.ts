import { createToPayload, Duck, reduceFromPayload } from "use-duck-state";
import { runAndTakeLatest } from "redux-saga-catch";
import { fork, put, take } from "redux-saga/effects";
import { eventChannel, Subscribe } from "redux-saga";

export default abstract class ProgressDuck extends Duck {
  get quickTypes() {
    enum Types {
      SET_PERCENTAGE,
      RELOAD,
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
      percentage: reduceFromPayload<number>(types.SET_PERCENTAGE, 0),
    };
  }
  get creators() {
    const { types } = this;
    return {
      setPercentage: createToPayload<number>(types.SET_PERCENTAGE),
    };
  }
  get rawSelectors() {
    type State = this["State"];
    return {
      done(state: State) {
        return state.percentage === 1;
      },
      progressing(state: State) {
        return state.percentage > 0 && state.percentage < 1;
      },
      load(state: State) {
        return state.percentage === 0;
      },
    };
  }
  *saga() {
    yield fork([this, this.watchToReload]);
  }
  *watchToReload() {
    const { types, emitProgress } = this;
    yield runAndTakeLatest([types.RELOAD], function* () {
      let percentage = 0;
      yield put({
        type: types.SET_PERCENTAGE,
        payload: percentage,
      });
      const progressChannel = eventChannel(emitProgress);
      while (percentage <= 1) {
        percentage = yield take(progressChannel);
        yield put({
          type: types.SET_PERCENTAGE,
          payload: percentage,
        });
      }
    });
  }
  abstract emitProgress(emit: any);
}
