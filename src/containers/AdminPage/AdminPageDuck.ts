import { reduceFromPayload, createToPayload } from "saga-duck";
import moment from "moment";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest, runAndTakeLatest } from "redux-saga-catch";
import {
  requestProjectOwn,
  requestAdminStatus,
  requestProjectInsert,
  requestProjectDelete,
  requestProjectRestore,
  requestProjectUpdate,
} from "@/utils/model";
import { IProjectItem, IAdminBasicInfo, IProjectFile } from "@/utils/interface";
import AdminPageCreateFormDuck, {
  ICreateProjectForm,
} from "./AdminPageCreateFormDuck";
import { DuckMap } from "saga-duck";
import { navigateTo, notice } from "@/utils";
import { cleanToken } from "@/utils/request";
import AdminPageEditFormDuck, {
  IEditProjectForm,
} from "./AdminPageEditFormDuck";

export default class AdminPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_PROJECT_OWN,
      SET_ADMIN_BASIC_INFO,

      RELOAD,

      FETCH_OWN_PROJECT,
      FETCH_ADMIN_BASIC_INFO,
      FETCH_INSERT_PROJECT,
      FETCH_DELETE_PROJECT,
      FETCH_RESTORE_PROJECT,
      FETCH_UPDATE_PROJECT,
    }
    return {
      ...super.quickTypes,
      ...Types,
    };
  }
  get quickDucks() {
    return {
      ...super.quickDucks,
      createProject: AdminPageCreateFormDuck,
      editProject: AdminPageEditFormDuck,
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      insertProject: createToPayload<ICreateProjectForm>(
        types.FETCH_INSERT_PROJECT
      ),
      deleteProject: createToPayload<string>(types.FETCH_DELETE_PROJECT),
      restoreProject: createToPayload<string>(types.FETCH_RESTORE_PROJECT),
      updateProject: createToPayload<IEditProjectForm>(
        types.FETCH_UPDATE_PROJECT
      ),
    };
  }
  get reducers() {
    const { types } = this;
    return {
      ...super.reducers,
      projectOwn: reduceFromPayload<IProjectItem[]>(types.SET_PROJECT_OWN, []),
      basicInfo: reduceFromPayload<IAdminBasicInfo>(
        types.SET_ADMIN_BASIC_INFO,
        null
      ),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToFetchProjectOwn]);
    yield fork([this, this.watchToFetchAdminBasicInfo]);
    yield fork([this, this.watchToInsertProject]);
    yield fork([this, this.watchToDeleteProject]);
    yield fork([this, this.watchToRestoreProject]);
    yield fork([this, this.watchToUpdateProject]);
    yield fork([this, this.watchToLoad]);
  }
  *watchToLoad() {
    const { types } = this;
    yield runAndTakeLatest([types.RELOAD], function* () {
      yield put({
        type: types.FETCH_OWN_PROJECT,
      });
      yield put({
        type: types.FETCH_ADMIN_BASIC_INFO,
      });
    });
  }
  *watchToFetchProjectOwn() {
    const { types } = this;
    yield takeLatest([types.FETCH_OWN_PROJECT], function* () {
      try {
        const result = yield requestProjectOwn();
        const { success, data, error } = result;
        if (success) {
          yield put({
            type: types.SET_PROJECT_OWN,
            payload: data?.projects ?? [],
          });
        } else {
          throw error;
        }
      } catch (e) {
        notice.success({ text: String(e) });
        cleanToken();
        setTimeout(() => {
          navigateTo("/auth");
        });
      }
    });
  }
  *watchToFetchAdminBasicInfo() {
    const { types } = this;
    yield takeLatest([types.FETCH_ADMIN_BASIC_INFO], function* () {
      try {
        const { success, data } = yield requestAdminStatus();
        if (success) {
          yield put({
            type: types.SET_ADMIN_BASIC_INFO,
            payload: data,
          });
        }
      } catch (e) {}
    });
  }
  *watchToInsertProject() {
    const duck = this;
    const { types } = duck;
    yield takeLatest([types.FETCH_INSERT_PROJECT], function* (action) {
      const fromData: ICreateProjectForm = action.payload;
      if (
        !fromData.fileNameExample ||
        !fromData.fileNameExtensions ||
        !fromData.fileNamePattern ||
        !fromData.name
      ) {
        notice.error({ text: "信息不完整" });
      } else {
        try {
          const {
            fileNameExample,
            fileNameExtensions,
            fileNamePattern,
            name,
          } = fromData;
          const { success, error } = yield requestProjectInsert({
            fileNameExample,
            fileNameExtensions,
            fileNamePattern,
            name,
          });
          if (success) {
            notice.success({ text: "新建成功" });
            navigateTo("/admin");
            yield put({
              type: types.RELOAD,
            });
          } else {
            throw error;
          }
        } catch (err) {
          notice.error({ text: String(err) });
        }
      }
    });
  }
  *watchToDeleteProject() {
    const { types } = this;
    yield takeLatest([types.FETCH_DELETE_PROJECT], function* (action) {
      const id = action.payload;
      try {
        const { success, error } = yield requestProjectDelete({ id });
        if (success) {
          notice.success({ text: "删除成功" });
          yield put({
            type: types.RELOAD,
          });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToRestoreProject() {
    const { types } = this;
    yield takeLatest([types.FETCH_RESTORE_PROJECT], function* (action) {
      const id = action.payload;
      try {
        const { success, error } = yield requestProjectRestore({ id });
        if (success) {
          notice.success({ text: "恢复成功" });
          yield put({
            type: types.RELOAD,
          });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToUpdateProject() {
    const { types } = this;
    yield takeLatest([types.FETCH_UPDATE_PROJECT], function* (action) {
      const updateForm: IEditProjectForm = action.payload;
      try {
        const { success, error } = yield requestProjectUpdate({
          fileNameExample: updateForm?.fileNameExample,
          fileNameExtensions: updateForm?.fileNameExtensions,
          fileNamePattern: updateForm?.fileNamePattern,
          id: updateForm?.id,
          usable: true,
        });
        if (success) {
          notice.success({ text: "更新成功" });
          yield put({ type: types.RELOAD });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
}
