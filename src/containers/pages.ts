import { ListPage, ListPageDuck } from "@/containers/ListPage/index";
import { AuthPage, AuthPageDuck } from "@/containers/AuthPage/index";
import { HelpPage, HelpPageDuck } from "@/containers/HelpPage/index";
import { AdminPage, AdminPageDuck } from "@/containers/AdminPage/index";
import { connectWithDuck } from "@/utils/index";

export const ListPageWithDuck = connectWithDuck(ListPage, ListPageDuck);
export const AuthPageWithDuck = connectWithDuck(AuthPage, AuthPageDuck);
export const HelpPageWithDuck = connectWithDuck(HelpPage, HelpPageDuck);
export const AdminPageWithDuck = connectWithDuck(AdminPage, AdminPageDuck);
