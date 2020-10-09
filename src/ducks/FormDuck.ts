import { select, put, fork } from "redux-saga/effects";
import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";
import { takeLatest } from "redux-saga-catch";

export default abstract class FormDuck extends DuckMap {
  abstract IForm;
  get quickTypes() {
    enum Types {
      SET_FORM_DATA,
      SET_FORM_LOADING,
      SET_FORM_ERROR,

      SET_FORM_DATA_PARTLY,
      SET_CLEAN_FORM,
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
      formData: reduceFromPayload<this["IForm"]>(types.SET_FORM_DATA, null),
      formLoading: reduceFromPayload<boolean>(types.SET_FORM_LOADING, false),
      formError: reduceFromPayload<Error>(types.SET_FORM_ERROR, null),
    };
  }
  get creators() {
    const { types } = this;
    return {
      ...super.creators,
      setFormData: createToPayload<this["IForm"]>(types.SET_FORM_DATA),
      setFormLoading: createToPayload<boolean>(types.SET_FORM_LOADING),
      setFormError: createToPayload<Error>(types.SET_FORM_ERROR),
      setFormDataPartly: createToPayload<any>(types.SET_FORM_DATA_PARTLY),
    };
  }
  get rawSelectors() {
    type State = this["State"];
    return {
      formatedData: (state: State) => this.formatData(state.formData),
    };
  }
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToPartlySetFormData]);
    yield fork([this, this.watchToCleanForm]);
  }
  validate(data: this["IForm"]): boolean {
    return true;
  }
  abstract formatData(data: this["IForm"]): this["IForm"];
  *watchToPartlySetFormData() {
    const { types, selector, creators } = this;
    yield takeLatest([types.SET_FORM_DATA_PARTLY], function* (action) {
      const data = action.payload;
      const { formData } = selector(yield select());
      yield put({
        type: types.SET_FORM_DATA,
        payload: {
          ...formData,
          ...data,
        },
      });
    });
  }
  *watchToCleanForm() {
    const { types } = this;
    yield takeLatest([types.SET_CLEAN_FORM], function* () {
      yield put({
        type: types.SET_FORM_DATA,
        payload: {},
      });
    });
  }
}
