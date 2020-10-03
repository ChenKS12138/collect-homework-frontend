import { mock } from "mockjs";
import mockProject from "./project";
import mockAdmin from "./admin";
import mockStorage from "./storage";

const mocks = [mockProject, mockAdmin, mockStorage];

function mockXHR() {
  mocks.forEach((mockItem) =>
    mockItem.forEach((rule) => {
      mock(rule.url, rule.method, rule.response);
    })
  );
}

mockXHR();
