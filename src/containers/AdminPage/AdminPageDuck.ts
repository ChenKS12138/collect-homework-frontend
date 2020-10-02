import { reduceFromPayload, createToPayload } from "@/utils";
import moment from "moment";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import {
  requestProjectOwn,
  requestAdminBasicInfo,
  requestFiles,
} from "@/utils/model";
import {
  IProjectItemOwn,
  IAdminBasicInfo,
  IProjectFile,
} from "@/utils/interface";
import AdminPageCreateFormDuck from "./AdminPageCreateFormDuck";
import { BasePageDuck } from "@/ducks/index";

interface AdminPageParam {
  id: string;
}

export default class AdminPageDuck extends BasePageDuck {
  IParams: AdminPageParam;
  get RoutePath() {
    return ["/admin", "/admin/create", "/admin/edit/:id"];
  }
  get quickTypes() {
    enum Types {
      SET_PROJECT_OWN,
      SET_ADMIN_BASIC_INFO,
      SET_FILES_INFO_MAP,
      FETCH_FILES_INFO,
      FETCH_FILES_DOWNLOAD,
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
    };
  }
  get reducers() {
    const { types } = this;
    return {
      ...super.reducers,
      projectOwn: reduceFromPayload<IProjectItemOwn[]>(
        types.SET_PROJECT_OWN,
        []
      ),
      basicInfo: reduceFromPayload<IAdminBasicInfo>(
        types.SET_ADMIN_BASIC_INFO,
        null
      ),
      filesInfoMap: reduceFromPayload<
        Map<string, { data?: IProjectFile; reason?: any }>
      >(types.SET_FILES_INFO_MAP, new Map()),
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      fetchFiles: createToPayload<number>(types.FETCH_FILES_INFO),
      downloadFiles: createToPayload<number>(types.FETCH_FILES_DOWNLOAD),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToFetchProjectOwn]);
    yield fork([this, this.watchToFetchAdminBasicInfo]);
    yield fork([this, this.watchToFetchProjectFilesInfo]);
  }
  *watchToFetchProjectOwn() {
    const { types } = this;
    const { projects } = yield requestProjectOwn();
    yield put({
      type: types.SET_PROJECT_OWN,
      payload: projects ?? [],
    });
  }
  *watchToFetchAdminBasicInfo() {
    const { types } = this;
    const result = yield requestAdminBasicInfo();
    yield put({
      type: types.SET_ADMIN_BASIC_INFO,
      payload: result,
    });
  }
  *watchToFetchProjectFilesInfo() {
    const { types, selector } = this;
    yield takeLatest(types.FETCH_FILES_INFO, function* (action) {
      const id = action?.payload;
      if (!id) return;
      const { files } = yield requestFiles(id);
      const { filesInfoMap } = selector(yield select());
      const newFilesInfoMap = new Map(filesInfoMap);
      newFilesInfoMap.set(id, { data: files });
      yield put({
        type: types.SET_FILES_INFO_MAP,
        payload: newFilesInfoMap,
      });
    });
  }
  *watchToFetchFilesDownload() {
    const { types } = this;
    yield takeLatest(types.FETCH_FILES_DOWNLOAD, function* (action) {
      const id = action?.payload;
      if (!id) return;
      console.log("download", id);
    });
  }
  formatProjectOwn(list): IProjectItemOwn[] {
    return list.map((item) => {
      item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
      item.updateAt = moment(item.updateAt).format("YYYY-MM-DD HH:mm:ss");
      item.due = moment(item.due).format("YYYY-MM-DD HH:mm:ss");
      return item;
    });
  }
}
