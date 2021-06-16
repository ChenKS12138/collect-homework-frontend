import { GREET_TEXT } from "@/utils/constants";
import { notification } from "base-component";
import { useCallback, useMemo, useState } from "react";

export const greetByTime = () => {
  const hour = new Date().getHours();
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
    notification.open({
      message: text,
      duration: 2000,
      type: "success",
    });
  },
  error({ text }: { text: string }) {
    notification.open({
      message: "遇到了点问题～",
      description: text,
      duration: 2000,
      type: "error",
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

export function useDiskSize(sizeB: number) {
  const [size, unit] = useMemo(() => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let index = 0;
    let sizeBStr = "";
    while (sizeB >= 1000 && index < units.length - 1) {
      sizeBStr = (sizeB / 1000).toPrecision(4);
      sizeB = Math.round(sizeB / 1000);
      index++;
    }
    return [sizeBStr, units[index]];
  }, [sizeB]);
  return [size, unit];
}

// export function formatDate(dataString: string): string;
// export function formatDate(
//   dataString: string,
//   format: FormatDateFormat
// ): string;

type FormatDateFormat = "YYYY-MM-DD HH:mm" | "YYYY-MM-DD";

export function formatDate(
  dataString?: string,
  format?: FormatDateFormat
): string {
  const d = new Date(dataString);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if (format === "YYYY-MM-DD") {
    return `${year}-${month}-${day}`;
  } else {
    const hour = d.getHours();
    const minute = d.getMinutes();
    return `${year}-${month}-${day} ${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
  }
}

export function classnames(classes: { [key: string]: any }): string {
  return Object.entries(classes).reduce((classString, current) => {
    if (current[1]) {
      classString += current[0] + " ";
    }
    return classString;
  }, "");
}

const codeMap = {
  "0000": "0",
  "0001": "1",
  "0010": "2",
  "0011": "3",
  "0100": "4",
  "0101": "5",
  "0110": "6",
  "0111": "7",
  1000: "8",
  1001: "9",
  1010: "A",
  1011: "B",
  1100: "C",
  1101: "D",
  1110: "E",
  1111: "F",
};

export function generateDownloadCode(seqList: number[]): string {
  const bins = Array.from({ length: Math.max(...seqList) }).map(() => 0);
  seqList.forEach((item) => {
    bins[item] = 1;
  });
  let code = "";
  while (bins.length) {
    const tmp = bins.splice(0, 4);
    code = codeMap[tmp.reverse().join("").padStart(4, "0")] + code;
  }
  return code;
}
