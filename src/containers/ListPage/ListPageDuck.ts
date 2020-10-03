import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";
import { IProjectItem } from "@/utils/interface";
import { requestProjectList } from "@/utils/model";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import moment from "moment";

export default class ListPageDuck extends DuckMap {
  get quickTypes() {
    enum Types {
      SET_PROJECTS,
      SET_CURRENT_PROJECT,
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
  }
  *watchToFetchProjectList() {
    const { types } = this;
    const { success, data } = yield requestProjectList();
    if (success) {
      yield put({
        type: types.SET_PROJECTS,
        payload: this.formatList(data.projects),
      });
    }
  }
  *watchToFetchCurrentProject() {
    const { types, formatList, selector } = this;
    yield takeLatest([types.FETCH_CURRENT_PROJECT], function* (action) {
      const id = action.payload;
      const { success, data } = yield requestProjectList();
      if (success) {
        const { projects } = data;
        yield put({
          type: types.SET_CURRENT_PROJECT,
          payload: formatList(projects)[0],
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
