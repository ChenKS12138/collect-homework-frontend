import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";
import { IProjectItem } from "@/utils/interface";
import {
  requestProjectList,
  requestStorageFileCount,
  requestStorageUpload,
} from "@/utils/model";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import { formatDate, navigateTo, notice } from "@/utils";
import ListPageUploadFormDuck, {
  IUploadForm,
} from "./ducks/ListPageUploadFormDuck";
import { LoadingDuck } from "@/ducks";

export default class ListPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_PROJECTS,
      SET_CURRENT_PROJECT,
      SET_CURRENT_PROJECT_COUNT,
      SET_UPLOAD_SUCCESS,

      FETCH_CURRENT_PROJECT,
      UPLOAD_FILE,
    }
    return {
      ...super.quickTypes,
      ...Types,
    };
  }
  get quickDucks() {
    return {
      ...super.quickDucks,
      upload: ListPageUploadFormDuck,
      listLoading: LoadingDuck,
      uploadLoading: LoadingDuck,
    };
  }
  get reducers() {
    const { types } = this;
    return {
      ...super.reducers,
      projects: reduceFromPayload<IProjectItem[]>(types.SET_PROJECTS, []),
      currentProject: reduceFromPayload<IProjectItem>(
        types.SET_CURRENT_PROJECT,
        null
      ),
      currentPorjectCount: reduceFromPayload<number>(
        types.SET_CURRENT_PROJECT_COUNT,
        0
      ),
      uploadSuccess: reduceFromPayload<boolean>(
        types.SET_UPLOAD_SUCCESS,
        false
      ),
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      setProjects: createToPayload<IProjectItem[]>(types.SET_PROJECTS),
      fetchProject: createToPayload<string>(types.FETCH_CURRENT_PROJECT),
      uploadFile: createToPayload<IUploadForm>(types.UPLOAD_FILE),
      setUploadSuccess: createToPayload<boolean>(types.SET_UPLOAD_SUCCESS),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToFetchProjectList]);
    yield fork([this, this.watchToFetchCurrentProject]);
    yield fork([this, this.watchToFetchCurrentProjectCount]);
    yield fork([this, this.watchToUploadFile]);
  }
  *watchToFetchProjectList() {
    const { types, ducks } = this;
    yield put(ducks.listLoading.creators.add());
    try {
      const { success, data, error } = yield requestProjectList();
      if (success) {
        yield put({
          type: types.SET_PROJECTS,
          payload: this.formatList(data.projects),
        });
      } else {
        throw error;
      }
    } catch (err) {
      notice.error({ text: String(err) });
    }
    yield put(ducks.listLoading.creators.done());
  }
  *watchToFetchCurrentProject() {
    const { types, formatList, selector, ducks } = this;
    yield takeLatest([types.FETCH_CURRENT_PROJECT], function* (action) {
      const id = action.payload;
      try {
        const { success, data, error } = yield requestProjectList();
        if (success) {
          const { projects } = data;
          const project = formatList(projects).find((one) => one.id === id);
          if (project) {
            yield put({
              type: types.SET_CURRENT_PROJECT,
              payload: project,
            });
          } else {
            window.location.href = "/";
          }
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToFetchCurrentProjectCount() {
    const { types, ducks } = this;
    // yield put(ducks.uploadLoading.creators.add());
    yield takeLatest([types.FETCH_CURRENT_PROJECT], function* (action) {
      const id = action.payload;
      const { success, data } = yield requestStorageFileCount({ id });
      if (success) {
        yield put({
          type: types.SET_CURRENT_PROJECT_COUNT,
          payload: data?.count,
        });
      }
    });
  }
  *watchToUploadFile() {
    const { types, creators, ducks } = this;
    yield takeLatest([types.UPLOAD_FILE], function* (action) {
      yield put(ducks.uploadLoading.creators.add());
      const payload: IUploadForm = action.payload;
      if (!payload?.file || !payload?.projectId || !payload?.secret) {
        notice.error({
          text: "信息不完整",
        });
        return;
      }
      try {
        const { success, error } = yield requestStorageUpload({
          file: payload.file,
          projectId: payload.projectId,
          secret: payload.secret,
        });
        if (success) {
          notice.success({ text: "上传成功" });
          yield put(creators.setUploadSuccess(true));
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
      yield put(ducks.uploadLoading.creators.done());
    });
  }
  formatList(list): IProjectItem[] {
    return list?.map?.((item) => {
      item.createAt = formatDate(item.createAt);
      item.updateAt = formatDate(item.updateAt);
      return item;
    });
  }
}
