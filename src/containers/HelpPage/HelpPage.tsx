import React from "react";
import {
  Scaffold,
  OptionButtonHelp,
  OptionButtonList,
} from "@/components/index";
import { DuckCmpProps } from "saga-duck";
import { HelpPageDuck } from ".";
import { RouteComponentProps } from "@reach/router";

export default function HelpPage({}: DuckCmpProps<HelpPageDuck> &
  RouteComponentProps) {
  return (
    <Scaffold
      optionRight={{
        element: [
          <OptionButtonHelp key="help" />,
          <OptionButtonList key="list" />,
        ],
        span: 2,
      }}
    >
      <div className="app-mt-4n app-text-align-center">开发中...</div>
    </Scaffold>
  );
}
