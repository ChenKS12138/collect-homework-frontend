import { Duck, reduceFromPayload } from "use-duck-state";
import { takeLatest } from "redux-saga-catch";
import { put, fork } from "redux-saga/effects";
import { requestCommonGenerateCaptcha } from "@/utils/model";

export enum FetchCaptchaStatus {
  INIT,
  FETCHING,
  SUCCEESED,
  FAILED,
}

export default class CaptchaDuck extends Duck {
  get quickTypes() {
    enum Types {
      SET_CAPTCHA_BLOB,
      SET_CAPTCHA_TOKEN,
      FETCH_CAPTCHA,
      SET_CAPTCHA_STATUS,
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
      blob: reduceFromPayload<Blob>(types.SET_CAPTCHA_BLOB, null),
      token: reduceFromPayload<string | null>(types.SET_CAPTCHA_TOKEN, null),
      status: reduceFromPayload<FetchCaptchaStatus>(
        types.SET_CAPTCHA_STATUS,
        FetchCaptchaStatus.FETCHING
      ),
    };
  }
  get rawSelectors() {
    type State = this["State"];
    return {
      imgUrl(state: State) {
        return state.blob && URL.createObjectURL(state.blob);
      },
    };
  }
  *saga() {
    const { types } = this;
    yield fork([this, this.watchToFetchCaptcha]);
    yield put({
      type: types.FETCH_CAPTCHA,
    });
  }
  *watchToFetchCaptcha() {
    const { types } = this;
    yield takeLatest([types.FETCH_CAPTCHA], function* () {
      yield put({
        type: types.SET_CAPTCHA_STATUS,
        payload: FetchCaptchaStatus.FETCHING,
      });
      try {
        const response = yield requestCommonGenerateCaptcha();
        const token = response.headers["x-captcha"];
        yield put({
          type: types.SET_CAPTCHA_BLOB,
          payload: response.data,
        });
        yield put({
          type: types.SET_CAPTCHA_TOKEN,
          payload: token,
        });
        yield put({
          type: types.SET_CAPTCHA_STATUS,
          payload: FetchCaptchaStatus.SUCCEESED,
        });
      } catch (e) {
        yield put({
          type: types.SET_CAPTCHA_STATUS,
          payload: FetchCaptchaStatus.FAILED,
        });
      }
    });
  }
}
