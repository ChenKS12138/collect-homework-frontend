import React from "react";
import { Scaffold } from "@/components/index";
import { DuckCmpProps } from "saga-duck";
import { HelpPageDuck } from ".";

export default function HelpPage({}: DuckCmpProps<HelpPageDuck>) {
  return (
    <Scaffold
      links={[
        {
          link: "/help",
          text: "帮助",
        },
        {
          link: "/",
          text: "主页",
        },
      ]}
    >
      <div className="app-mt-4n app-text-align-center">开发中...</div>
    </Scaffold>
  );
}
