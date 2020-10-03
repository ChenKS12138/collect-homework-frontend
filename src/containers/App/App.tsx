import React, { Props, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Router, Route } from "@/utils";
import { ListPage } from "@/containers/ListPage";
import { AuthPage } from "@/containers/AuthPage";
import { HelpPage } from "@/containers/HelpPage";
import { AdminPage } from "@/containers/AdminPage";
import { GlobalStyle } from "@/components/index";

const AppWrapper = styled.div`
  padding: 0;
  margin: 0;
  border: 0;
`;

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
