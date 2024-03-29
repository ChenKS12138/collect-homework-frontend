import React, { useEffect } from "react";
import { Scaffold, Avatar, ListCard } from "@/components";
import { UploadCard } from "@/duckComponents";
import { Button, Drawer } from "base-component";
import styled from "styled-components";
import { avatarImage } from "@/assets";
import { ListPageDuck } from "@/containers/ListPage";
import { useDuckState, useLazyState } from "@/utils";
import { RouterLink, navigateTo, useRouteMatch } from "router";
import { useWindowSize } from "react-use";
import { Helmet } from "react-helmet";

const TitleText = styled.div`
  color: rgba(0, 0, 0, 0.65);
`;
const TitleLineThroughText = styled.span`
  text-decoration: line-through;
  text-decoration-color: red;
`;

export default function ListPage() {
  const { dispatch, duck, store } = useDuckState<ListPageDuck>(ListPageDuck);

  const { selectors, ducks } = duck;
  const { projects, currentProject, currentPorjectCount } = selectors(store);
  const { height, width } = useWindowSize();
  const matched = useRouteMatch<{ id: string }>("/detail/:id");
  const [showDrawer, setShowDrawer] = useLazyState(false, 400);
  const showDetail = matched !== false;
  const matchedID: string = matched ? matched?.params?.id : "";

  useEffect(() => {
    if (matchedID?.length) {
      dispatch(duck.creators.fetchProject(matchedID));
    }
  }, [matchedID]);

  useEffect(() => {
    if (showDetail) {
      setShowDrawer(true, false);
    } else {
      setShowDrawer(false, true);
    }
  }, [showDetail]);

  const { uploadSuccess } = duck.selectors(store);
  const tableLoading = ducks.listLoading.selectors(store).isLoading;
  const uploadLoading = ducks.uploadLoading.selectors(store).isLoading;

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
      <Helmet>
        <title>首页 | 作业提交平台</title>
        <meta name="title" content="首页 | 作业提交平台" />
      </Helmet>
      <TitleText className="app-mt-4n app-text-size-11n app-text-align-center app-text-weight-6n">
        <span>各种作业</span>
        <TitleLineThroughText>程序语言实验设计报告</TitleLineThroughText>
        <span>提交平台</span>
      </TitleText>
      <Avatar
        src={avatarImage}
        className="app-mlr-auto app-mt-1n app-box-shadow-default"
      />
      <ListCard dataSource={projects} loading={tableLoading} />
      <Drawer
        title="提交作业"
        closable={true}
        onClose={() => {
          dispatch(duck.creators.setUploadSuccess(false));
          dispatch({ type: ducks.upload.types.SET_CLEAN_FORM });
          navigateTo("/");
        }}
        visible={showDrawer}
        height={height * 0.9}
        width={width}
        placement="bottom"
      >
        <UploadCard
          currentProject={currentProject}
          showSuccess={uploadSuccess}
          showLoading={uploadLoading}
          uploadCount={currentPorjectCount}
          onUpload={(uploadForm) => {
            dispatch(duck.creators.uploadFile(uploadForm));
          }}
          duck={ducks.upload}
          dispatch={dispatch}
          store={store}
          successResultExtra={
            <Button
              type="primary"
              onClick={() => {
                dispatch(duck.creators.setUploadSuccess(false));
                dispatch({ type: ducks.upload.types.SET_CLEAN_FORM });
              }}
            >
              <RouterLink to="/">返回首页</RouterLink>
            </Button>
          }
        />
      </Drawer>
    </Scaffold>
  );
}
