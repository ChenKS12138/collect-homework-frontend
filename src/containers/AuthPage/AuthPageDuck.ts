import { reduceFromPayload, createToPayload, navigateTo } from "@/utils";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import AuthPageLoginFormDuck from "./AuthPageLoginFormDuck";
import AuthPageRegistryFormDuck from "./AuthPageRegistryFormDuck";
import { requestAuthLogin, requestAuthSecretCode } from "@/utils/model";
// import { BasePageDuck } from "@/ducks/index";
import { DuckMap } from "saga-duck";

export interface ILoginForm {
  email: string;
  password: string;
}

interface AuthPageParam {}

export default class AuthPageDuck extends DuckMap {
  IParams: AuthPageParam;
  get RoutePath() {
    return ["/auth/", "/auth/registry"];
  }
  get quickTypes() {
    enum Types {
      SET_SHOW_REGISTRY,
      SET_LOGIN_FORM,
      SET_LOGIN_LOADING,
      SET_LOGIN_ERROR,
      FETCH_SECRET_CODE,
    }
    return {
      ...super.quickTypes,
      ...Types,
    };
  }
  get quickDucks() {
    return {
      ...super.quickDucks,
      loginForm: AuthPageLoginFormDuck,
      registryForm: AuthPageRegistryFormDuck,
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      fetchSecretCode: createToPayload<string>(types.FETCH_SECRET_CODE),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToLogin]);
  }
  *watchToLogin() {
    const { ducks } = this;
    yield takeLatest([ducks.loginForm.types.SET_FORM_DATA], function* () {
      console.log(yield select());
      const {
        formData: { email, password },
      } = ducks.loginForm.selector(yield select());
      const response = yield requestAuthLogin({ email, password });
      if (response.success) {
        yield navigateTo("/admin");
      }
    });
  }
  *watchToRegistry() {
    const { ducks } = this;
    yield takeLatest([ducks.registryForm.types.SET_FORM_DATA], function* () {
      const { formData } = ducks.registryForm.selector(yield select());
      console.log(formData);
    });
  }
  *watchToFetchSecretCode() {
    const { types } = this;
    yield takeLatest([types.FETCH_SECRET_CODE], function* (action) {
      if (!action?.payload?.length) return;
      const result = yield requestAuthSecretCode({ email: action.payload });
      if (result.success) {
        console.log("success");
      }
    });
  }
}
