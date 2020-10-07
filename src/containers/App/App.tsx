import React, { Suspense, lazy } from "react";
import styled from "styled-components";
import { Router, Route } from "@/utils";
import { ListPage } from "@/containers/ListPage";
import { GlobalStyle, Loading } from "@/components";
import { loadable } from "@/utils";

const AppWrapper = styled.div`
  padding: 0;
  margin: 0;
  border: 0;
`;

const loadingElement = <Loading />;

const AuthPage = loadable({
  loader: () =>
    import(
      /*webpackChunkName: 'auth_page' */
      /* webpackPrefetch: true */
      "@/containers/AuthPage/AuthPage"
    ),
  loading: loadingElement,
  minDuration: 500,
});
const HelpPage = loadable({
  loader: () =>
    import(
      /*webpackChunkName: 'help_page' */
      /* webpackPrefetch: true */
      "@/containers/HelpPage/HelpPage"
    ),
  loading: loadingElement,
  minDuration: 500,
});
const AdminPage = loadable({
  loader: () =>
    import(
      /*webpackChunkName: 'admin_page' */
      /* webpackPrefetch: true */
      "@/containers/AdminPage/AdminPage"
    ),
  loading: loadingElement,
  minDuration: 500,
});

function App() {
  return (
    <AppWrapper>
      <Router>
        <Route path={["/", "/detail/:id"]}>
          <ListPage />
        </Route>
        <Route path={["/auth", "/auth/registry"]}>
          <AuthPage />
        </Route>
        <Route path={["/admin", "/admin/create"]}>
          <AdminPage />
        </Route>
        <Route path={["/help"]}>
          <HelpPage />
        </Route>
      </Router>
      <GlobalStyle />
    </AppWrapper>
  );
}

export default App;
