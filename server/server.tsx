import { App } from "@/containers/App/index";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Koa from "koa";

const srv = new Koa();

console.log(<App />);

// srv.use((ctx) => {
//   ctx.set("Content-Type", "text/html");
//   ctx.body = ReactDOMServer.renderToNodeStream(<App />);
// });
// srv.listen(process.env.PORT || 3030);
