import { navigateTo, singleton } from "@/utils";
import { fork } from "redux-saga/effects";
import { createToPayload, DuckMap } from "saga-duck";
import { takeLatest } from "redux-saga-catch";
import { format } from "prettier";

// @singleton({
//   runOnceMethods: ["saga"],
// })
// export default class RouteDuck extends DuckMap {
//   get quickTypes() {
//     enum Types {
//       NAVIGATE_TO,
//     }
//     return {
//       ...super.quickTypes,
//       ...Types,
//     };
//   }
//   get creators() {
//     const { types } = this;
//     return {
//       ...super.creators,
//       navigateTo: createToPayload<string>(types.NAVIGATE_TO),
//     };
//   }
//   *saga() {
//     yield fork([this, this.watchToNavigateTo]);
//   }
//   *watchToNavigateTo() {
//     const { types } = this;
//     yield takeLatest([
//       types.NAVIGATE_TO,
//       function* (action) {
//         navigateTo(action.payload);
//       },
//     ]);
//   }
// }
