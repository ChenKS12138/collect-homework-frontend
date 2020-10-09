import { FormDuck } from "@/ducks/index";

export interface ILoginForm {
  email: string;
  password: string;
}

export default class AuthPageLoginFormDuck extends FormDuck {
  IForm: ILoginForm;
  formatData(data: ILoginForm) {
    return data;
  }
}
