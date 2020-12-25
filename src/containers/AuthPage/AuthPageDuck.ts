import { reduceFromPayload, createToPayload, Duck } from "use-duck-state";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import AuthPageLoginFormDuck from "./ducks/AuthPageLoginFormDuck";
import AuthPageRegistryFormDuck from "./ducks/AuthPageRegistryFormDuck";
import {
  requestAdminLogin,
  requestAdminInvitationCode,
  requestAdminRegister,
} from "@/utils/model";
import { CutdownDuck } from "@/ducks";
import { notice } from "@/utils";
import { navigateTo } from "router";
import { getToken, setToken } from "@/utils/request";

export interface ILoginForm {
  email: string;
  password: string;
}

export default class AuthPageDuck extends Duck {
  get quickTypes() {
    enum Types {
      FETCH_SECRET_CODE,
      INVOKE_LOGIN,
      INVOKE_REGISTER,
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
    yield fork([this, this.watchToLogin]);
    yield fork([this, this.watchToFetchSecretCode]);
    yield fork([this, this.watchToRegistry]);
  }
  *watchToLogin() {
    const { types, ducks } = this;

    if (getToken()?.length) {
      navigateTo("/admin");
    }
    yield takeLatest([types.INVOKE_LOGIN], function* () {
      const { formData } = ducks.loginForm.selectors(yield select());
      if (!formData?.email?.length || !formData?.password?.length) {
        notice.error({ text: "邮箱密码不能为空" });
      } else {
        try {
          const { success, data, error } = yield requestAdminLogin({
            email: formData?.email,
            password: formData?.password,
          });
          if (success) {
            notice.success({
              text: "登陆成功",
            });
            setToken(data);
            setTimeout(() => {
              navigateTo("/admin");
            }, 800);
          } else {
            throw error;
          }
        } catch (err) {
          notice.error({ text: String(err) });
        }
      }
    });
  }
  *watchToRegistry() {
    const { types, ducks } = this;
    yield takeLatest([types.INVOKE_REGISTER], function* () {
      const { formData } = ducks.registryForm.selectors(yield select());
      if (
        !formData?.email?.length ||
        !formData?.userPassword?.length ||
        !formData?.invitationCode?.length ||
        !formData?.username?.length
      ) {
        notice.error({ text: "输入信息不完整" });
      } else {
        const { email, invitationCode, userPassword, username } = formData;
        try {
          const { success, error, data } = yield requestAdminRegister({
            email,
            invitationCode,
            name: username,
            password: userPassword,
          });
          if (success) {
            notice.success({ text: "注册成功" });
            navigateTo("/auth");
          } else {
            throw error;
          }
        } catch (err) {
          notice.error({ text: String(err) });
        }
      }
    });
  }
  *watchToFetchSecretCode() {
    const { types, ducks } = this;
    yield takeLatest([types.FETCH_SECRET_CODE], function* (action) {
      if (!action?.payload?.length) {
        notice.error({ text: "请输入邮箱" });
      } else {
        try {
          const result = yield requestAdminInvitationCode({
            email: action.payload,
          });
          if (result.success) {
            notice.success({ text: "请求邀请码成功" });
            yield put(ducks.cutdown.creators.invoke(60));
          } else {
            throw result.error;
          }
        } catch (err) {
          notice.error({ text: String(err) });
        }
      }
    });
  }
}
