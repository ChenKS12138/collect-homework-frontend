import React, { useEffect } from "react";
import {
  Scaffold,
  EditableFormCard,
  CommonModal,
  EditableTagSet,
} from "@/components/index";
import styled from "styled-components";
import {
  Card,
  Button,
  Row,
  Col,
  Statistic,
  Drawer,
  Tag,
  Input,
  DatePicker,
  Form,
} from "antd";
import { AdminPageDuck } from ".";
import {
  useRouteMatch,
  distributeArray,
  navigateTo,
  IProjectItem,
  useSagaDuckState,
} from "@/utils";
import { DuckCmpProps, purify } from "saga-duck";
import { useWindowSize } from "react-use";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import AdminPageCreateProjectFormDuck from "./AdminPageCreateFormDuck";
import { useForm } from "antd/lib/form/Form";
import { greetByTime, RouterLink } from "@/utils";

const AdminWrapper = styled.div`
  max-width: 800px;
`;

const WelcomeText = styled.span`
  color: black;
`;

const editFormProperty = [
  {
    key: "adminName",
    label: "管理员",
    renderShow: (item) => <div>{item.adminName}</div>,
  },
  {
    key: "fileNameExtensions",
    label: "文件后缀名",
    renderShow: (item) => (
      <div>
        {item.fileNameExtensions?.map((tag, tagIndex) => (
          <Tag key={tagIndex}>{tag}</Tag>
        ))}
      </div>
    ),
    renderEdit: (item, formInstance: FormInstance) => {
      const formatedList = Array.from(item.fileNameExtensions)?.map(
        (x: string) => ({
          key: x,
          text: x,
        })
      );
      return (
        <EditableTagSet
          tagSet={formatedList}
          onInputConfirm={(value) => {
            console.log(value);
          }}
        />
      );
    },
  },
  {
    key: "fileNameExample",
    label: "文件名示例",
    renderShow: (item) => <div>{item.fileNameExample}</div>,
    renderEdit: (item, formInstance: FormInstance) => (
      <Input
        defaultValue={item.fileNameExample}
        onChange={(event) => {
          formInstance.setFieldsValue({ fileNameExample: event.target.value });
        }}
      />
    ),
  },
  {
    key: "fileNamePattern",
    label: "文件名正则表达式",
    renderShow: (item) => <div>{item.fileNamePattern}</div>,
    renderEdit: (item, formInstance: FormInstance) => (
      <Input
        defaultValue={item.fileNamePattern}
        onChange={(event) => {
          formInstance.setFieldsValue({ fileNamePattern: event.target.value });
        }}
      />
    ),
  },
  {
    key: "createAt",
    label: "创建时间",
    renderShow: (item) => <div>{item.createAt}</div>,
  },
];

export default function AdminPage() {
  const { dispatch, duck, store } = useSagaDuckState<AdminPageDuck>(
    AdminPageDuck
  );
  const { selector, ducks } = duck;
  const { projectOwn, basicInfo } = selector(store);
  const { width, height } = useWindowSize();

  const showCreate = useRouteMatch("/admin/create") !== false;

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
      <AdminWrapper className="app-mlr-auto app-mt-3n">
        <Card
          title="概览"
          extra={[
            <Button type="link" danger key="logout">
              登出
            </Button>,
          ]}
        >
          <WelcomeText className="app-text-size-10n app-mb-6n">
            {greetByTime(moment())}，cattchen
          </WelcomeText>
          <Row className="app-mt-5n" gutter={50}>
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
                value={basicInfo?.totalSize ?? "-"}
                suffix="B"
              />
            </Col>
          </Row>
        </Card>
        <Card
          title="作业项目"
          className="app-mt-2n"
          extra={[
            <Button type="primary" key="new">
              <RouterLink to="/admin/create">新建</RouterLink>
            </Button>,
          ]}
        >
          {projectOwn?.length ? (
            <ProjectOwnWrapper
              projectOwn={projectOwn}
              dispatch={dispatch}
              store={store}
              duck={duck}
            />
          ) : null}
        </Card>
      </AdminWrapper>
      <Drawer
        visible={showCreate}
        title="新建"
        height={height}
        width={width * 0.7}
        placement="right"
        closable
        onClose={() => navigateTo("/admin")}
      >
        <AdminPageCreate
          duck={ducks.createProject}
          dispatch={dispatch}
          store={store}
        />
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
  const distributedProjectOwn = distributeArray<IProjectItem>(projectOwn, 2);
  const { selector } = duck;
  const { filesInfoMap } = selector(store);
  return (
    <>
      {distributedProjectOwn?.map((row, rowIndex) => (
        <Row gutter={[16, 16]} key={rowIndex}>
          {row?.map((col, colIndex) => {
            const currentFileInfo = filesInfoMap.get(String(col.id));
            return (
              <Col span={12} key={colIndex}>
                <EditableFormCard
                  title={col.name}
                  initFormValue={col}
                  formAttr={editFormProperty}
                  extra={({ isEdit, setIsEdit, formInstance }) => [
                    <Button
                      size="small"
                      type="text"
                      key="edit"
                      onClick={() => {
                        if (isEdit) {
                          console.log(formInstance.getFieldsValue());
                          setIsEdit(false);
                        } else {
                          setIsEdit(true);
                        }
                      }}
                    >
                      {isEdit ? "完成" : "编辑"}
                    </Button>,
                    <CommonModal
                      key="delete"
                      title="删除"
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
                          删除
                        </Button>
                      )}
                    >
                      <div>确认删除？</div>
                    </CommonModal>,
                  ]}
                  actions={({ isEdit, setIsEdit }) => [
                    <CommonModal
                      innerComponent={(visible, setVisible) => (
                        <Button
                          size="small"
                          type="link"
                          key="overview"
                          onClick={() => {
                            setVisible(true);
                            dispatch(duck.creators.fetchFiles((col as any).id));
                          }}
                        >
                          查看文件
                        </Button>
                      )}
                      title="查看文件"
                      footer={null}
                    >
                      {currentFileInfo?.reason ? (
                        <div>{currentFileInfo?.reason}</div>
                      ) : currentFileInfo?.data ? (
                        <div>{JSON.stringify(currentFileInfo)}</div>
                      ) : (
                        <div>加载中...</div>
                      )}
                    </CommonModal>,
                    <Button size="small" type="link" key="download">
                      一键下载
                    </Button>,
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
}: DuckCmpProps<AdminPageCreateProjectFormDuck>) {
  const {
    formData: createProjectFormData,
    formError: createProjectFormError,
    formLoading: createProjectFormLoading,
  } = duck.selector(store);
  const [formInstance] = useForm();
  return (
    <Form>
      <Form.Item label="项目名称">
        <Input
          defaultValue={createProjectFormData?.name}
          onChange={(event) => {
            formInstance.setFieldsValue({ name: event.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="截止日期">
        <DatePicker
          format="YYYY-MM-DD"
          defaultValue={moment(createProjectFormData?.due)}
          onChange={(value) => {
            formInstance.setFieldsValue({
              due: moment(value).format("YYYY-MM-DD"),
            });
          }}
        />
      </Form.Item>
      <Form.Item label="文件后缀名">
        <EditableTagSet
          tagSet={
            [] ||
            createProjectFormData?.nameExtensions?.map?.((x: string) => ({
              key: x,
              text: x,
            }))
          }
          onInputConfirm={(value) => {
            console.log(value);
          }}
        />
      </Form.Item>
      <Form.Item label="文件名示例">
        <Input
          defaultValue={createProjectFormData?.name}
          onChange={(event) => {
            formInstance.setFieldsValue({ name: event.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="文件名正则表达式">
        <Input
          defaultValue={createProjectFormData?.name}
          onChange={(event) => {
            formInstance.setFieldsValue({ name: event.target.value });
          }}
        />
      </Form.Item>
    </Form>
  );
}
