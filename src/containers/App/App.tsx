import React, { Props, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Router, Route } from "@/utils";
import { ListPage } from "@/containers/ListPage/index";
import { AuthPage } from "@/containers/AuthPage/index";
import { HelpPage } from "@/containers/HelpPage/index";
import { AdminPage } from "@/containers/AdminPage/index";
import { connectWithDuck, DuckCmpProps, purify } from "@/utils/index";
import { GlobalStyle } from "@/components/index";
import RootDuck from "./RootDuck";

const AppWrapper = styled.div`
  padding: 0;
  margin: 0;
  border: 0;
`;

function App({ dispatch, duck, store }: DuckCmpProps<RootDuck>) {
  const { ducks } = duck;
  return (
    <AppWrapper>
      <Router>
        <Route path={["/", "/detail/:id"]}>
          <ListPage dispatch={dispatch} duck={ducks.list} store={store} />
        </Route>
        <Route path={["/auth", "/auth/registry"]}>
          <AuthPage dispatch={dispatch} duck={ducks.auth} store={store} />
        </Route>
        <Route path={["/admin", "/admin/create"]}>
          <AdminPage dispatch={dispatch} duck={ducks.admin} store={store} />
        </Route>
        <Route path={["/help"]}>
          <HelpPage dispatch={dispatch} duck={ducks.help} store={store} />
        </Route>
      </Router>
      <GlobalStyle />
    </AppWrapper>
  );
}

export default connectWithDuck(purify(App), RootDuck);
