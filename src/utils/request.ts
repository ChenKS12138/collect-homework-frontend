import axios from "axios";

if (process.env.NODE_ENV === "development" && process.env.MOCK_REQUEST) {
  require("../../mock");
}

export const baseURL =
  process.env.NODE_ENV === "development" && process.env.MOCK_REQUEST
    ? ""
    : "/api";

export const HOST = "homework.cattchen.top" || location.host;

export const instance = axios.create({
  baseURL,
});

const CONSTANT_TOKEN_KEY = "JWT_TOKEN";

let jwtToken = "";
export const setToken = (token: string) => {
  jwtToken = token;
  window.localStorage.setItem(CONSTANT_TOKEN_KEY, token);
};
export const cleanToken = () => {
  jwtToken = "";
  window.localStorage.removeItem(CONSTANT_TOKEN_KEY);
};
export const getToken = (): string => {
  return jwtToken || window.localStorage.getItem(CONSTANT_TOKEN_KEY);
};
instance.interceptors.response.use((response) => {
  if (
    response.headers["content-type"]?.includes?.("application/octet-stream")
  ) {
    return {
      success: true,
      blob: new Blob([response?.data]),
      headers: response.headers,
    };
  } else {
    return response?.data;
  }
});
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token?.length) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
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
