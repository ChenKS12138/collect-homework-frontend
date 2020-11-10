import React, { useCallback } from "react";
import { Scaffold, CommonModal, EditableTagSet } from "@/components";
import { EditableFormCard } from "@/duckComponents";
import styled from "styled-components";
import {
  Drawer,
  Statistic,
  Empty,
  Row,
  Col,
  Button,
  List,
  Form,
  Card,
  Progress,
  Input,
} from "base-component";
import { AdminPageDuck } from ".";
import {
  distributeArray,
  useSagaDuckState,
  greetByTime,
  useDiskSize,
} from "@/utils";
import { useRouteMatch, navigateTo, RouterLink } from "router";
import { IProjectItem } from "@/utils/interface";
import { DuckCmpProps } from "saga-duck";
import { useWindowSize } from "react-use";
import { cleanToken } from "@/utils/request";
import { Helmet } from "react-helmet";
import adminEditFormColumns from "./utils/AdminEditFormColumn";

const AdminWrapper = styled.div`
  max-width: 800px;
`;

const WelcomeText = styled.span`
  color: black;
`;

export default function AdminPage() {
  const { dispatch, duck, store } = useSagaDuckState<AdminPageDuck>(
    AdminPageDuck
  );
  const { selector, ducks } = duck;
  const { projectOwn, basicInfo } = selector(store);
  const { width, height } = useWindowSize();

  const showCreate = useRouteMatch("/admin/create") !== false;
  const [size, unit] = useDiskSize(basicInfo?.totalSize ?? 0);

  return (
    <Scaffold
      links={[
        {
          text: "帮助",
          link: "/help",
        },
        {
          text: "主页",
          link: "/",
        },
      ]}
    >
      <Helmet>
        <title>管理 | 作业提交平台</title>
        <meta name="title" content="管理 | 作业提交平台" />
      </Helmet>
      <AdminWrapper className="app-mlr-auto app-mt-3n">
        <Card
          title="概览"
          extra={[
            <Button
              type="link"
              danger
              key="logout"
              onClick={() => {
                cleanToken();
                navigateTo("/auth");
              }}
            >
              登出
            </Button>,
          ]}
        >
          <WelcomeText className="app-text-size-10n app-mb-6n">
            {greetByTime()}，{basicInfo?.username}
          </WelcomeText>
          <Row className="app-mt-5n" gutter={[24, 24]}>
            <Col>
              <Statistic
                title="创建的作业项目"
                value={basicInfo?.projectCount ?? "-"}
                suffix="个"
              />
            </Col>
            <Col>
              <Statistic
                title="收集到的作业文件总个数"
                value={basicInfo?.fileCount ?? "-"}
                suffix="个"
              />
            </Col>
            <Col>
              <Statistic
                title="占用的总空间数"
                value={size ?? "-"}
                suffix={unit ?? "-"}
              />
            </Col>
          </Row>
        </Card>
        <Card
          title="作业项目"
          className="app-mt-2n"
          extra={[
            <RouterLink
              key="new"
              style={{ color: "#ffffff" }}
              to="/admin/create"
            >
              <Button type="primary">新建</Button>
            </RouterLink>,
          ]}
        >
          {projectOwn?.length ? (
            <ProjectOwnWrapper
              projectOwn={projectOwn}
              dispatch={dispatch}
              store={store}
              duck={duck}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无作业项目"
            />
          )}
        </Card>
      </AdminWrapper>
      <Drawer
        visible={showCreate}
        title="新建"
        height={height}
        width={Math.max(width * 0.4, 300)}
        placement="right"
        closable
        onClose={() => navigateTo("/admin")}
      >
        <AdminPageCreate duck={duck} dispatch={dispatch} store={store} />
      </Drawer>
    </Scaffold>
  );
}

interface IProjectOwnWrapper extends DuckCmpProps<AdminPageDuck> {
  projectOwn: IProjectItem[];
}

function ProjectOwnWrapper({
  projectOwn,
  dispatch,
  store,
  duck,
}: IProjectOwnWrapper) {
  const { width } = useWindowSize();
  const distributedProjectOwn = distributeArray<IProjectItem>(
    projectOwn,
    width < 960 ? 1 : 2
  );
  const { ducks } = duck;

  return (
    <>
      {distributedProjectOwn?.map((row, rowIndex) => (
        <Row gutter={[24, 24]} key={rowIndex}>
          {row?.map((col, colIndex) => {
            const { fileList, projectSize } = duck.selector(store);
            const [size, unit] = useDiskSize(projectSize ?? 0);
            return (
              <Col
                style={{ padding: "12px" }}
                span={width < 960 ? 24 : 12}
                key={colIndex}
              >
                <EditableFormCard
                  duck={duck.ducks.editProject}
                  store={store}
                  dispatch={dispatch}
                  title={col.name}
                  instance={col}
                  columns={adminEditFormColumns}
                  extra={({ isEdit, setIsEdit }) => [
                    <Button
                      size="small"
                      type="text"
                      key="edit"
                      onClick={() => {
                        if (isEdit) {
                          const { formData } = duck.ducks.editProject.selector(
                            store
                          );
                          dispatch(duck.creators.updateProject(formData));
                          setIsEdit(false);
                        } else {
                          dispatch(
                            duck.ducks.editProject.creators.setFormData(col)
                          );
                          setIsEdit(true);
                        }
                      }}
                    >
                      {isEdit ? "完成" : "编辑"}
                    </Button>,
                    <CommonModal
                      key="delete"
                      title={col.usable ? "删除" : "恢复"}
                      onOk={() => {
                        if (col.usable) {
                          dispatch(duck.creators.deleteProject(col.id));
                        } else {
                          dispatch(duck.creators.restoreProject(col.id));
                        }
                      }}
                      innerComponent={(visible, setVisible) => (
                        <Button
                          size="small"
                          type="text"
                          danger
                          key="delete"
                          disabled={isEdit}
                          onClick={() => {
                            setVisible(true);
                          }}
                        >
                          {col.usable ? "删除" : "恢复"}
                        </Button>
                      )}
                    >
                      <div>确认{col.usable ? "删除" : "恢复"}？</div>
                    </CommonModal>,
                  ]}
                  actions={({ isEdit, setIsEdit }) => [
                    <CommonModal
                      key="files"
                      innerComponent={(visible, setVisible) => (
                        <Button
                          size="small"
                          type="link"
                          key="overview"
                          onClick={() => {
                            dispatch(duck.creators.fetchFileList(col.id));
                            dispatch(duck.creators.fetchProjectSize(col.id));
                            setVisible(true);
                          }}
                          disabled={isEdit}
                        >
                          查看文件
                        </Button>
                      )}
                      title="查看文件"
                      footer={null}
                    >
                      <>
                        {projectSize ? (
                          <div>
                            总大小: {size}
                            {unit}
                          </div>
                        ) : null}
                        {fileList?.length ? (
                          <List
                            dataSource={
                              fileList?.map?.((one) => ({ title: one })) ?? []
                            }
                            bordered
                            renderItem={(item) => <div>{item?.title}</div>}
                            size="small"
                          />
                        ) : (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="暂无提交的文件"
                          />
                        )}
                      </>
                    </CommonModal>,
                    <CommonModal
                      key="download"
                      title="下载"
                      innerComponent={(visible, setVisible) => {
                        return (
                          <Button
                            size="small"
                            type="link"
                            key="download"
                            disabled={isEdit}
                            onClick={() => {
                              setVisible(true);
                              dispatch({
                                type: duck.ducks.downloadProgress.types.RELOAD,
                              });
                              dispatch({
                                type: duck.types.SET_EXPORT_LINK,
                                payload: "",
                              });
                            }}
                          >
                            下载
                          </Button>
                        );
                      }}
                      footer={null}
                    >
                      <DownloadModal
                        store={store}
                        dispatch={dispatch}
                        duck={duck}
                        col={col}
                      />
                    </CommonModal>,
                  ]}
                />
              </Col>
            );
          })}
        </Row>
      ))}
    </>
  );
}

function AdminPageCreate({
  dispatch,
  duck,
  store,
}: DuckCmpProps<AdminPageDuck>) {
  const {
    formData: createProjectFormData,
    formError: createProjectFormError,
    formLoading: createProjectFormLoading,
  } = duck.ducks.createProject.selector(store);
  const { ducks } = duck;
  return (
    <Form>
      <Form.Item label="项目名称" name="name">
        <Input
          defaultValue={createProjectFormData?.name}
          onChange={(event) => {
            dispatch(
              ducks.createProject.creators.setFormDataPartly({
                name: event.target.value,
              })
            );
          }}
        />
      </Form.Item>
      <Form.Item label="文件后缀名" name="fileNameExtensions">
        <EditableTagSet
          tagSet={
            [] ||
            createProjectFormData?.fileNameExtensions?.map?.((x: string) => ({
              key: x,
              text: x,
            }))
          }
          onTagSetChange={(value: { text: string; key: string }[]) => {
            dispatch(
              ducks.createProject.creators.setFormDataPartly({
                fileNameExtensions: value?.map?.((x) => x.text) ?? [],
              })
            );
          }}
        />
      </Form.Item>
      <Form.Item label="文件名示例" name="fileNameExample">
        <Input
          defaultValue={createProjectFormData?.fileNameExample}
          onChange={(event) => {
            dispatch(
              ducks.createProject.creators.setFormDataPartly({
                fileNameExample: event.target.value,
              })
            );
          }}
        />
      </Form.Item>
      <Form.Item label="文件名正则表达式" name="fileNamePattern">
        <Input
          defaultValue={createProjectFormData?.fileNamePattern}
          onChange={(event) => {
            dispatch(
              ducks.createProject.creators.setFormDataPartly({
                fileNamePattern: event.target.value,
              })
            );
          }}
        />
      </Form.Item>
      <Button
        block
        type="primary"
        onClick={() => {
          dispatch(
            duck.creators.insertProject(
              duck.ducks.createProject.selectors.formatedData(store)
            )
          );
        }}
      >
        创建
      </Button>
    </Form>
  );
}

interface IDownloadModal extends DuckCmpProps<AdminPageDuck> {
  col: any;
}

function DownloadModal({ dispatch, duck, store, col }: IDownloadModal) {
  const { percentage } = duck.ducks.downloadProgress.selector(store);
  const { exportLink } = duck.selector(store);
  const handleDownload = useCallback(() => {
    dispatch(
      duck.creators.downloadFile({
        id: col.id,
        name: col.name,
      })
    );
  }, [dispatch, duck]);
  const handleExportLink = useCallback(() => {
    dispatch({
      type: duck.types.FETCH_EXPORT_LINK,
      payload: { id: col.id },
    });
  }, [col, dispatch, duck]);

  if (percentage) {
    return (
      <div>
        <Progress percent={parseFloat((percentage * 100).toFixed(2))} />
        <span style={{ color: "red" }}>
          文件压缩需要一定的时间，请耐心等待，下载中请勿关闭浏览器窗口
        </span>
      </div>
    );
  }

  if (exportLink) {
    return (
      <div>
        <p style={{ color: "red" }}>下载链接有效时间5分钟，请及时访问</p>
        <p>{exportLink}</p>
      </div>
    );
  }

  return (
    <div className="app-mlr-auto">
      <Button onClick={handleDownload}>立即下载</Button>
      <Button onClick={handleExportLink}>生成下载链接</Button>
    </div>
  );
}
