import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";
import { IProjectItem } from "@/utils/interface";
import { requestProjectList, requestStorageFileCount } from "@/utils/model";
import { fork, put } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import moment from "moment";
import { notice } from "@/utils";

export default class ListPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_PROJECTS,
      SET_CURRENT_PROJECT,
      SET_CURRENT_PROJECT_COUNT,
      SET_UPLOAD_SUCCESS,

      FETCH_CURRENT_PROJECT,
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
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToFetchProjectList]);
    yield fork([this, this.watchToFetchCurrentProject]);
    yield fork([this, this.watchToFetchCurrentProjectCount]);
  }
  *watchToFetchProjectList() {
    const { types } = this;
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
  }
  *watchToFetchCurrentProject() {
    const { types, formatList, selector } = this;
    yield takeLatest([types.FETCH_CURRENT_PROJECT], function* (action) {
      const id = action.payload;
      try {
        const { success, data, error } = yield requestProjectList();
        if (success) {
          const { projects } = data;
          yield put({
            type: types.SET_CURRENT_PROJECT,
            payload: formatList(projects)[0],
          });
        } else {
          throw error;
        }
      } catch (err) {
        notice.error({ text: String(err) });
      }
    });
  }
  *watchToFetchCurrentProjectCount() {
    const { types } = this;
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
  formatList(list): IProjectItem[] {
    return list?.map?.((item) => {
      item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
      item.updateAt = moment(item.updateAt).format("YYYY-MM-DD HH:mm:ss");
      item.due = moment(item.due).format("YYYY-MM-DD HH:mm:ss");
      return item;
    });
  }
}
