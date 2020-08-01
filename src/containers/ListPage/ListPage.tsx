import React from "react";

import {
  Scaffold,
  Avatar,
  ListCard,
  UploadCard,
  OptionButtonHelp,
  OptionButtonAuth,
} from "@/components/index";
import { Button, Drawer } from "antd";
import styled from "styled-components";
import { avatarImage } from "@/assets/index";
import { DuckCmpProps, purify } from "saga-duck";
import { ListPageDuck } from "@/containers/ListPage/index";
import { Link, RouteComponentProps, useMatch } from "@reach/router";
import { useWindowSize } from "react-use";

const TitleText = styled.div`
  color: rgba(0, 0, 0, 0.65);
`;
const TitleLineThroughText = styled.span`
  text-decoration: line-through;
  text-decoration-color: red;
`;

export default purify(function ListPage({
  dispatch,
  duck,
  store,
}: DuckCmpProps<ListPageDuck> & RouteComponentProps) {
  const { selector, ducks } = duck;
  const { projects, currentProject } = selector(store);
  const { height, width } = useWindowSize();
  const { path } = ducks.route.selector(store);
  const showDetail = useMatch("/detail/:id");

  return (
    <Scaffold
      optionRight={{
        element: [
          <OptionButtonHelp key="help" />,
          <OptionButtonAuth key="auth" />,
        ],
        span: 2,
      }}
    >
      <TitleText className="app-mt-4n app-text-size-11n app-text-align-center app-text-weight-6n">
        <span>各种作业</span>
        <TitleLineThroughText>程序语言实验设计报告</TitleLineThroughText>
        <span>提交平台</span>
      </TitleText>
      <Avatar
        src={avatarImage}
        className="app-mlr-auto app-mt-1n app-box-shadow-default"
      />
      <ListCard dataSource={projects} />
      <Drawer
        title="提交作业"
        closable={true}
        onClose={() => {
          dispatch(ducks.route.creators.navigate("/"));
        }}
        visible={showDetail}
        height={height * 0.9}
        width={width}
        placement="bottom"
      >
        <UploadCard
          currentProject={currentProject}
          showSuccess={false}
          showLoading={false}
          onUpload={() => {}}
          successResultExtra={
            <Button type="primary">
              <Link to="/">返回首页</Link>
            </Button>
          }
        />
      </Drawer>
    </Scaffold>
  );
});
