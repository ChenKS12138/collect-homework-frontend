import { reduceFromPayload, createToPayload } from "saga-duck";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import AuthPageLoginFormDuck from "./AuthPageLoginFormDuck";
import AuthPageRegistryFormDuck from "./AuthPageRegistryFormDuck";
import { requestAdminLogin, requestAdminInvitationCode } from "@/utils/model";
import { DuckMap } from "saga-duck";
import { CutdownDuck } from "@/ducks";
import { navigateTo } from "@/utils";
import { notification } from "antd";
import { setToken } from "@/utils/request";

export interface ILoginForm {
  email: string;
  password: string;
}

export default class AuthPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_SHOW_REGISTRY,
      SET_LOGIN_FORM,
      SET_LOGIN_LOADING,
      SET_LOGIN_ERROR,
      FETCH_SECRET_CODE,
      INVOKE_LOGIN,
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
      cutdown: CutdownDuck,
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
    const { types, ducks } = this;
    yield takeLatest([types.INVOKE_LOGIN], function* () {
      const { formData } = ducks.loginForm.selector(yield select());
      if (!formData?.email?.length || !formData?.password?.length) {
        notification.error({
          message: "输入信息错误",
          description: "邮箱密码不能为空",
          duration: 2,
        });
      } else {
        try {
          const { success, data, error } = yield requestAdminLogin({
            email: formData?.email,
            password: formData?.password,
          });
          if (success) {
            notification.success({
              message: "登陆成功",
              duration: 2,
            });
            setToken(data);
          } else {
            throw error;
          }
        } catch (err) {
          notification.error({
            message: "登陆失败",
            description: String(err),
            duration: 2,
          });
        }
      }
    });
  }
  *watchToRegistry() {
    const { ducks } = this;
    yield takeLatest([ducks.registryForm.types.SET_FORM_DATA], function* () {
      const { formData } = ducks.registryForm.selector(yield select());
    });
  }
  *watchToFetchSecretCode() {
    const { types } = this;
    yield takeLatest([types.FETCH_SECRET_CODE], function* (action) {
      if (!action?.payload?.length) return;
      const result = yield requestAdminInvitationCode({
        email: action.payload,
      });
      if (result.success) {
        console.log("success");
      }
    });
  }
}
