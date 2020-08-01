import React, { Props, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Router, Redirect } from "@reach/router";
import { ListPage, ListPageDuck } from "@/containers/ListPage/index";
import { AuthPage, AuthPageDuck } from "@/containers/AuthPage/index";
import { HelpPage, HelpPageDuck } from "@/containers/HelpPage/index";
import { AdminPage, AdminPageDuck } from "@/containers/AdminPage/index";
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
        <Redirect default from="*" to="/" />
        <ListPage
          path="/"
          dispatch={dispatch}
          duck={ducks.list}
          store={store}
        />
        <ListPage
          path="/detail/:id"
          dispatch={dispatch}
          duck={ducks.list}
          store={store}
        />
        <AdminPage
          path="/admin"
          dispatch={dispatch}
          duck={ducks.admin}
          store={store}
        />
        <AdminPage
          path="/admin/create"
          dispatch={dispatch}
          duck={ducks.admin}
          store={store}
        />
        <AdminPage
          path="/admin/edit/:id"
          dispatch={dispatch}
          duck={ducks.admin}
          store={store}
        />
        <AuthPage
          path="/auth"
          dispatch={dispatch}
          duck={ducks.auth}
          store={store}
        />
        <AuthPage
          path="/auth/registry"
          dispatch={dispatch}
          duck={ducks.auth}
          store={store}
        />
        <HelpPage
          path="/help"
          dispatch={dispatch}
          duck={ducks.help}
          store={store}
        />
      </Router>
      <GlobalStyle />
    </AppWrapper>
  );
}

export default connectWithDuck(purify(App), RootDuck);
