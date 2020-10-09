import { FormDuck } from "@/ducks/index";

export interface ICreateProjectForm {
  name: string;
  fileNameExtensions: string[];
  fileNameExample: string;
  fileNamePattern: string;
}

export default class AdminPageCreateFormDuck extends FormDuck {
  IForm: ICreateProjectForm;
  formatData(data: ICreateProjectForm) {
    return {
      ...data,
      name: data?.name ?? "",
      fileNameExtensions: data?.fileNameExtensions ?? [],
    };
  }
}
