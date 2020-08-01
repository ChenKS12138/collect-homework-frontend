import { DuckMap, reduceFromPayload, createToPayload } from "@/utils/saga-duck";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import AuthPageLoginFormDuck from "./AuthPageLoginFormDuck";
import AuthPageRegistryFormDuck from "./AuthPageRegistryFormDuck";
import { requestAuthLogin } from "@/utils/model";
import { BasePageDuck } from "@/ducks/index";

export interface ILoginForm {
  email: string;
  password: string;
}

interface AuthPageParam {}

export default class AuthPageDuck extends BasePageDuck {
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
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToLogin]);
  }
  *watchToLogin() {
    const { ducks } = this;
    yield takeLatest([ducks.loginForm.types.SET_FORM_DATA], function* () {
      const {
        formData: { email, password },
      } = ducks.loginForm.selector(yield select());
      const response = yield requestAuthLogin({ email, password });
      if (response.success) {
        yield put(ducks.route.creators.navigate("/admin"));
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
}
