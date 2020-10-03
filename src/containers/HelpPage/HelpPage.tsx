import React from "react";
import { Scaffold } from "@/components/index";

export default function HelpPage() {
  return (
    <Scaffold
      links={[
        {
          link: "/",
          text: "主页",
        },
        {
          link: "/auth",
          text: "管理员",
        },
      ]}
    >
      <div className="app-mt-4n app-text-align-center">开发中...</div>
    </Scaffold>
  );
}
