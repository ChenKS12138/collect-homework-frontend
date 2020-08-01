import { FormDuck } from "@/ducks/index";

export interface ICreateProjectForm {
  name: string;
  due: string;
  nameExtensions: string[];
  nameRegDesc: string;
  nameRegExp: string;
}

export default class AdminPageCreateProjectFormDuck extends FormDuck {
  IForm: ICreateProjectForm;
}
