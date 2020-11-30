import { reduceFromPayload, createToPayload } from "saga-duck";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest, runAndTakeLatest } from "redux-saga-catch";
import {
  requestProjectOwn,
  requestAdminStatus,
  requestProjectInsert,
  requestProjectDelete,
  requestProjectRestore,
  requestProjectUpdate,
  requestProjectFileList,
  requestStorageDownload,
  requestStorageProjectSize,
  requestSubToken,
  requestStorageDownloadSeletively,
} from "@/utils/model";
import { IProjectItem, IAdminBasicInfo } from "@/utils/interface";
import AdminPageCreateFormDuck, {
  ICreateProjectForm,
} from "./ducks/AdminPageCreateFormDuck";
import { DuckMap } from "saga-duck";
import { generateDownloadCode, notice } from "@/utils";
import { navigateTo } from "router";
import { baseURL, cleanToken, HOST } from "@/utils/request";
import AdminPageEditFormDuck, {
  IEditProjectForm,
} from "./ducks/AdminPageEditFormDuck";
import AdminPageDownloadProgressDuck from "./ducks/AdminPageDownloadProgressDuck";
import { saveAs } from "file-saver";

export default class AdminPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_PROJECT_OWN,
      SET_ADMIN_BASIC_INFO,
      SET_FILE_LIST,
      SET_PROJECT_SIZE,
      SET_EXPORT_LINK,

      RELOAD,

      FETCH_OWN_PROJECT,
      FETCH_ADMIN_BASIC_INFO,
      FETCH_INSERT_PROJECT,
      FETCH_DELETE_PROJECT,
      FETCH_RESTORE_PROJECT,
      FETCH_UPDATE_PROJECT,
      FETCH_FILE_LIST,
      FETCH_PROEJCT_SIZE,
      FETCH_DOWNLAOD_FILE,
      FETCH_EXPORT_LINK,
      FETCH_REVIEW,
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
      downloadProgress: AdminPageDownloadProgressDuck,
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
      fetchFileList: createToPayload<string>(types.FETCH_FILE_LIST),
      fetchProjectSize: createToPayload<string>(types.FETCH_PROEJCT_SIZE),
      downloadFile: createToPayload<{
        id: string;
        name: string;
        list: number[];
      }>(types.FETCH_DOWNLAOD_FILE),
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
      fileList: reduceFromPayload<
        { name: string; seq: number; lastModifyTime: string }[]
      >(types.SET_FILE_LIST, []),
      projectSize: reduceFromPayload<number>(types.SET_PROJECT_SIZE, 0),
      exportLink: reduceFromPayload<string>(types.SET_EXPORT_LINK, null),
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
    yield fork([this, this.watchToFetchFileList]);
    yield fork([this, this.watchToFetchProjectSize]);
    yield fork([this, this.watchToDownloadFile]);
    yield fork([this, this.watchToExportLink]);
    yield fork([this, this.watchToPreview]);
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
      if (!fromData.name) {
        notice.error({ text: "信息不完整" });
      } else {
        try {
          const {
            fileNameExample,
            fileNameExtensions,
            fileNamePattern,
            name,
            labels,
          } = fromData;
          const { success, error } = yield requestProjectInsert({
            fileNameExample,
            fileNameExtensions,
            fileNamePattern,
            name,
            labels,
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
          sendEmail: updateForm?.sendEmail,
          visible: updateForm?.visible,
          labels: updateForm?.labels ?? [],
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
  *watchToFetchFileList() {
    const { types } = this;
    yield takeLatest([types.FETCH_FILE_LIST], function* (action) {
      yield put({
        type: types.SET_FILE_LIST,
        payload: [],
      });
      const id = action.payload;
      try {
        const { success, error, data } = yield requestProjectFileList({
          id,
        });
        if (success) {
          data?.files?.sort((a, b) => a?.name?.localeCompare?.(b?.name));
          yield put({
            type: types.SET_FILE_LIST,
            payload: data?.files ?? [],
          });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToFetchProjectSize() {
    const { types } = this;
    yield takeLatest([types.FETCH_PROEJCT_SIZE], function* (action) {
      yield put({
        type: types.SET_PROJECT_SIZE,
        payload: 0,
      });
      const id = action.payload;
      try {
        const { success, error, data } = yield requestStorageProjectSize({
          id,
        });
        if (success) {
          yield put({
            type: types.SET_PROJECT_SIZE,
            payload: data?.size ?? 0,
          });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToDownloadFile() {
    const { types, handleDownloadProgress, ducks } = this;
    yield takeLatest([types.FETCH_DOWNLAOD_FILE], function* (action) {
      const { id, name, list } = action.payload;
      const code = generateDownloadCode(list ?? []);
      try {
        yield put({
          type: ducks.downloadProgress.types.RELOAD,
        });
        const result = yield requestStorageDownloadSeletively({
          code,
          id,
          onDownloadProgress: handleDownloadProgress,
        });
        if (result?.success) {
          const fileName = `${name}.zip`;
          saveAs(result?.blob, fileName);
        } else {
          throw result?.error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToExportLink() {
    const { types } = this;
    yield takeLatest([types.FETCH_EXPORT_LINK], function* (action) {
      const { id, list } = action.payload;
      const code = generateDownloadCode(list ?? []);
      try {
        const result = yield requestSubToken({ expire: 5, authCode: 5 });
        if (result?.success) {
          const exportLink =
            location.origin +
            baseURL +
            `/storage/downloadSelectively?id=${id}&code=${code}&jwt=${result?.data}`;
          yield put({
            type: types.SET_EXPORT_LINK,
            payload: exportLink,
          });
        } else {
          throw result?.error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToPreview() {
    const { types } = this;
    yield takeLatest([types.FETCH_REVIEW], function* (action) {
      const { id, list } = action.payload;
      try {
        const result = yield requestSubToken({ expire: 5, authCode: 5 });
        if (result?.success) {
          const jwtToken = result?.data;
          const previewUrls = list.map(
            (item) =>
              `https://view.officeapps.live.com/op/view.aspx?src=${encodeURI(
                `https://${
                  HOST + baseURL
                }/storage/rawFile/${id}/${item}?jwt=${jwtToken}`
              )}`
          );
          if (
            list?.length > 3 &&
            !confirm("预览链接数大于3，是否立即全部打开")
          ) {
            return;
          }
          previewUrls.forEach((url) => {
            window.open(url, "_blank");
          });
        } else {
          throw result?.error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  handleDownloadProgress = (progressEvent) => {
    const current = progressEvent?.loaded;
    const total = progressEvent?.total;
    this.ducks.downloadProgress.emit(current / Math.max(total, 0.000001));
  };
}
