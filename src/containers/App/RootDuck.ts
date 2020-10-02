import { DuckMap, reduceFromPayload, createToPayload } from "@/utils";
import { AdminPageDuck } from "@/containers/AdminPage/index";
import { AuthPageDuck } from "@/containers/AuthPage/index";
import { HelpPageDuck } from "@/containers/HelpPage/index";
import { ListPageDuck } from "@/containers/ListPage/index";
import { RouteDuck } from "@/ducks/index";

export default class RootDuck extends DuckMap {
  static globalDuck = {
    route: RouteDuck,
  };
  get quickDucks() {
    return {
      ...super.quickDucks,
      admin: AdminPageDuck,
      auth: AuthPageDuck,
      help: HelpPageDuck,
      list: ListPageDuck,
      route: RouteDuck,
    };
  }
  *saga() {
    yield* super.saga();
  }
}
