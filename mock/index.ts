import { mock } from "mockjs";
import mockProject from "./project";
import mockAuth from "./auth";
import mockAdmin from "./admin";
import mockFile from "./file";

const mocks = [mockProject, mockAuth, mockAdmin, mockFile];

export function mockXHR() {
  mocks.forEach((mockItem) =>
    mockItem.forEach((rule) => {
      mock(rule.url, rule.method, rule.response);
    })
  );
}
