import React, { useEffect } from "react";

import { Scaffold, Avatar, ListCard, UploadCard, Modal } from "@/components";
import { Button, Drawer } from "antd";
import styled from "styled-components";
import { avatarImage } from "@/assets";
import { DuckCmpProps, purify } from "saga-duck";
import { ListPageDuck } from "@/containers/ListPage";
import {
  RouterLink,
  navigateTo,
  useRouteMatch,
  useSagaDuckState,
} from "@/utils";
import { useWindowSize } from "react-use";

const TitleText = styled.div`
  color: rgba(0, 0, 0, 0.65);
`;
const TitleLineThroughText = styled.span`
  text-decoration: line-through;
  text-decoration-color: red;
`;

export default function ListPage() {
  const { dispatch, duck, store } = useSagaDuckState<ListPageDuck>(
    ListPageDuck
  );

  const { selector, ducks } = duck;
  const { projects, currentProject } = selector(store);
  const { height, width } = useWindowSize();
  const matched = useRouteMatch<{ id: string }>("/detail/:id");
  const showDetail = matched !== false;
  const machedID: string = matched ? matched?.params?.id : "";

  return (
    <Scaffold
      links={[
        {
          link: "/help",
          text: "帮助",
        },
        {
          link: "/auth",
          text: "管理员",
        },
      ]}
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
          navigateTo("/");
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
              <RouterLink to="/">返回首页</RouterLink>
            </Button>
          }
        />
      </Drawer>
    </Scaffold>
  );
}
