import { Moment } from "moment";
import { GREET_TEXT } from "@/utils/constants";

export const greetByTime = (now: Moment) => {
  const hour = now.hour();
  if (hour > 6 && hour < 12) return GREET_TEXT.MORNING;
  if (hour < 14) return GREET_TEXT.NOON;
  if (hour < 18) return GREET_TEXT.AFTERNOON;
  return GREET_TEXT.EVENING;
};
