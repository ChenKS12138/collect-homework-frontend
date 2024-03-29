import { FormDuck } from "@/ducks/index";

export interface IEditProjectForm {
  fileNameExtensions: string[];
  fileNameExample: string;
  fileNamePattern: string;
  labels: string[];
  sendEmail: boolean;
  visible: boolean;
  id: string;
}

export default class AdminPageEditFormDuck extends FormDuck {
  IForm: IEditProjectForm;
  formatData(data: IEditProjectForm) {
    return {
      ...data,
      fileNameExtensions: data?.fileNameExtensions ?? [],
      labels: data?.labels ?? [],
    };
  }
}
