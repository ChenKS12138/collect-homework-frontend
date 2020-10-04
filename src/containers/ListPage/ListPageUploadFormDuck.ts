import { FormDuck } from "@/ducks/index";

export interface IUploadForm {
  file: any;
  secret: string;
  projectId: string;
}

export default class AuthPageRegistryFormDuck extends FormDuck {
  IForm: IUploadForm;
}
