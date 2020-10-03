import { instance, memorize } from "./request";
import axios from "axios";
import { IProjectItem, IAdminBasicInfo } from "@/utils/interface";

export const requestProjectList = (): Promise<{ projects: IProjectItem[] }> =>
  memorize(instance.get)("/project");

export const requestProjectOwn = (): Promise<{ projects: IProjectItem[] }> =>
  memorize(instance.get)("/project/own");

interface IRequestAuthLogin {
  email: string;
  password: string;
}

export const requestAuthLogin = ({
  email,
  password,
}: IRequestAuthLogin): Promise<any> =>
  instance.post("/auth/login", { email, password });

export const requestAdminBasicInfo = (): Promise<IAdminBasicInfo> =>
  memorize(instance.post)("/admin/basicInfo");

export const requestFiles = (id: number) =>
  memorize(instance.get)(`/files/${id}`);

export const requestAuthSecretCode = ({ email }: { email: string }) =>
  instance.post("/auth/secretCode", { email });
