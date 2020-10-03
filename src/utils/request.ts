import axios from "axios";
import { mockXHR } from "../../mock/index";

mockXHR();

export const instance = axios.create();
instance.interceptors.response.use((response) => {
  return response?.data;
});

const memorizeMap = new WeakMap<Function, Map<string, any>>();

export const memorize = (func) => async (...params) => {
  const paramsKey = String(params);
  const result = memorizeMap.get(func)?.get?.(paramsKey);
  if (result) return result;
  const response = await func(...params);
  if (memorizeMap.get(func)) {
    memorizeMap.get(func).set(paramsKey, response);
  } else {
    const paramMap = new Map<string, any>();
    paramMap.set(paramsKey, response);
    memorizeMap.set(func, paramMap);
  }
  return response;
};

export const unMemorize = (func) => {
  memorizeMap.delete(func);
};
