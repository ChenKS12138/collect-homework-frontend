import { DuckMap, reduceFromPayload, createToPayload } from "saga-duck";

export default abstract class FormDuck extends DuckMap {
  abstract IForm;
  get quickTypes() {
    enum Types {
      SET_FORM_DATA,
      SET_FORM_LOADING,
      SET_FORM_ERROR,
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
    };
  }
  *saga() {
    yield* super.saga();
  }
}
