import { DuckMap, reduceFromPayload, createToPayload } from "@/utils";
import { IProjectItem } from "@/utils/interface";
import { requestProjectList } from "@/utils/model";
import { fork, put, select } from "redux-saga/effects";
import { takeLatest } from "redux-saga-catch";
import moment from "moment";
import { BasePageDuck } from "@/ducks/index";

interface ListPageParam {
  id: string;
}

export default class ListPageDuck extends BasePageDuck {
  IParams: ListPageParam;
  get RoutePath() {
    return ["/", "/:id"];
  }
  get quickTypes() {
    enum Types {
      SET_PROJECTS,
      SET_CURRENT_PROJECT,
      SET_UPLOAD_SUCCESS,
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
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToFetchProjectList]);
    yield fork([this, this.watchToFetchCurrentProject]);
  }
  *watchToFetchProjectList() {
    const { types } = this;
    const { projects } = yield requestProjectList();
    yield put({
      type: types.SET_PROJECTS,
      payload: this.formatList(projects),
    });
  }
  *watchToFetchCurrentProject() {
    const { types, formatList, selector } = this;
    yield takeLatest([types.SET_ROUTE_PARAM], function* () {
      const { params } = selector(yield select());
      if (!params?.id?.length) return;
      const { projects } = yield requestProjectList();
      yield put({
        type: types.SET_CURRENT_PROJECT,
        payload: formatList(projects)[0],
      });
    });
  }
  formatList(list): IProjectItem[] {
    return list.map((item) => {
      item.createAt = moment(item.createAt).format("YYYY-MM-DD HH:mm:ss");
      item.updateAt = moment(item.updateAt).format("YYYY-MM-DD HH:mm:ss");
      item.due = moment(item.due).format("YYYY-MM-DD HH:mm:ss");
      return item;
    });
  }
}
