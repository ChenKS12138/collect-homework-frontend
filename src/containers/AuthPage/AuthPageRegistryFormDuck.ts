import { FormDuck } from "@/ducks/index";

export interface IRegistryForm {
  email: string;
  invitationCode: string;
  username: string;
  userPassword: string;
}

export default class AuthPageRegistryFormDuck extends FormDuck {
  IForm: IRegistryForm;
  formatData(data: IRegistryForm) {
    return data;
  }
}
