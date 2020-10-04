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
  *saga() {
    yield* super.saga();
    yield fork([this, this.watchToPartlySetFormData]);
  }
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
}
