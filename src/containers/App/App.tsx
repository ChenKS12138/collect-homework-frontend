import React, { Suspense, lazy } from "react";
import styled from "styled-components";
import { Router, Route } from "@/utils";
import { ListPage } from "@/containers/ListPage";
import { GlobalStyle, Scaffold } from "@/components/index";

const AppWrapper = styled.div`
  padding: 0;
  margin: 0;
  border: 0;
`;

const AuthPage = lazy(
  () =>
    import(
      /*webpackChunkName: 'auth_page' */
      /* webpackPrefetch: true */
      "@/containers/AuthPage/AuthPage"
    )
);
const HelpPage = lazy(
  () =>
    import(
      /*webpackChunkName: 'help_page' */
      /* webpackPrefetch: true */
      "@/containers/HelpPage/HelpPage"
    )
);
const AdminPage = lazy(
  () =>
    import(
      /*webpackChunkName: 'admin_page' */
      /* webpackPrefetch: true */
      "@/containers/AdminPage/AdminPage"
    )
);

function App() {
  return (
    <AppWrapper>
      <Router>
        <Route path={["/", "/detail/:id"]}>
          <ListPage />
        </Route>
        <Route path={["/auth", "/auth/registry"]}>
          <Suspense fallback={() => <Scaffold />}>
            <AuthPage />
          </Suspense>
        </Route>
        <Route path={["/admin", "/admin/create"]}>
          <Suspense fallback={() => <Scaffold />}>
            <AdminPage />
          </Suspense>
        </Route>
        <Route path={["/help"]}>
          <Suspense fallback={() => <Scaffold />}>
            <HelpPage />
          </Suspense>
        </Route>
      </Router>
      <GlobalStyle />
    </AppWrapper>
  );
}

export default App;
