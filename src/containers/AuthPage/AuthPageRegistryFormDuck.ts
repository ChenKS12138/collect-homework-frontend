import { FormDuck } from "@/ducks/index";

export interface IRegistryForm {
  email: string;
  secretCode: string;
  username: string;
  password: string;
}

export default class AuthPageRegistryFormDuck extends FormDuck {
  IForm: IRegistryForm;
}
