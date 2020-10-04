import { Moment } from "moment";
import { GREET_TEXT } from "@/utils/constants";
import { notification } from "antd";
import { useCallback, useState } from "react";

export class Watcher<T = any> {
  value: T;
  callBackQueue: Function[];
  constructor(initialValue: T) {
    this.value = initialValue;
    this.callBackQueue = [];
  }
  add(callback: (value: T) => void) {
    this.callBackQueue.push(callback);
  }
  update(value: T) {
    this.value = value;
    this.callBackQueue.forEach((cb) => {
      cb(value);
    });
  }
  cancel(callback: (value: T) => void) {
    this.callBackQueue = this.callBackQueue.filter((cb) => cb !== callback);
  }
}

export const greetByTime = (now: Moment) => {
  const hour = now.hour();
  if (hour > 6 && hour < 12) return GREET_TEXT.MORNING;
  if (hour < 14) return GREET_TEXT.NOON;
  if (hour < 18) return GREET_TEXT.AFTERNOON;
  return GREET_TEXT.EVENING;
};

export const distributeArray = <T = any>(
  flatArray: Array<T>,
  groupSize: number
): Array<Array<T>> => {
  if (groupSize < 1 || !Number.isInteger(groupSize)) return null;
  return flatArray.reduce((accumulate, current, index) => {
    if (index % groupSize === 0) {
      accumulate.push([current]);
    } else {
      accumulate[Math.floor(index / 2)]?.push?.(current);
    }
    return accumulate;
  }, [] as T[][]);
};

export const notice = {
  success({ text }: { text: string }) {
    notification.success({
      message: text,
      duration: 2,
    });
  },
  error({ text }: { text: string }) {
    notification.error({
      message: "遇到了点问题～",
      description: text,
      duration: 2,
    });
  },
};

export function useLazyState(initState, timeout) {
  const [value, setValue] = useState(initState);
  const lazySetState = useCallback(
    (newValue, immediate = false) => {
      if (immediate) {
        setValue(newValue);
      } else {
        setTimeout(() => {
          setValue(newValue);
        }, timeout);
      }
    },
    [timeout, setValue]
  );
  return [value, lazySetState];
}