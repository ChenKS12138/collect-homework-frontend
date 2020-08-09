import React, { useEffect } from "react";
import {
  Scaffold,
  OptionButtonHelp,
  OptionButtonList,
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
  Modal,
} from "antd";
import { AdminPageDuck } from ".";
import { DuckCmpProps, purify } from "@/utils/saga-duck";
import { IProjectItemOwn, distributeArray } from "@/utils";
import { Link, RouteComponentProps, useMatch } from "@reach/router";
import { useWindowSize } from "react-use";
import { FormInstance } from "antd/lib/form";
import moment from "moment";
import AdminPageCreateProjectFormDuck from "./AdminPageCreateFormDuck";
import { useForm } from "antd/lib/form/Form";
import { greetByTime } from "@/utils/index";

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
    key: "due",
    label: "截止时间",
    renderShow: (item) => <div>{item.due}</div>,
    renderEdit: (item, formInstance: FormInstance) => (
      <DatePicker
        format="YYYY-MM-DD"
        defaultValue={moment(item.due)}
        onChange={(value) => {
          formInstance.setFieldsValue({
            due: moment(value).format("YYYY-MM-DD"),
          });
        }}
      />
    ),
  },
  {
    key: "nameExtensions",
    label: "文件后缀名",
    renderShow: (item) => (
      <div>
        {item.nameExtensions.map((tag, tagIndex) => (
          <Tag key={tagIndex}>{tag}</Tag>
        ))}
      </div>
    ),
    renderEdit: (item, formInstance: FormInstance) => {
      const formatedList = Array.from(item.nameExtensions).map((x: string) => ({
        key: x,
        text: x,
      }));
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
    key: "nameRegDesc",
    label: "文件名示例",
    renderShow: (item) => <div>{item.nameRegDesc}</div>,
    renderEdit: (item, formInstance: FormInstance) => (
      <Input
        defaultValue={item.nameRegDesc}
        onChange={(event) => {
          formInstance.setFieldsValue({ nameRegDesc: event.target.value });
        }}
      />
    ),
  },
  {
    key: "nameRegExp",
    label: "文件名正则表达式",
    renderShow: (item) => <div>{item.nameRegExp}</div>,
    renderEdit: (item, formInstance: FormInstance) => (
      <Input
        defaultValue={item.nameRegExp}
        onChange={(event) => {
          formInstance.setFieldsValue({ nameRegExp: event.target.value });
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

export default purify(function AdminPage({
  dispatch,
  duck,
  store,
}: DuckCmpProps<AdminPageDuck> & RouteComponentProps) {
  const { selector, ducks } = duck;
  const { projectOwn, basicInfo } = selector(store);
  const { path } = ducks.route.selector(store);
  const { width, height } = useWindowSize();

  const showCreate = useMatch("/admin/create") !== null;

  useEffect(() => {
    console.log("init admin page");
  }, []);

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
                value={basicInfo?.projectsCount ?? "-"}
                suffix="个"
              />
            </Col>
            <Col>
              <Statistic
                title="收集到的作业文件总个数"
                value={basicInfo?.filesCount ?? "-"}
                suffix="个"
              />
            </Col>
            <Col>
              <Statistic
                title="占用的总空间数"
                value={basicInfo?.memoryUsed ?? "-"}
                suffix="MB"
              />
            </Col>
          </Row>
        </Card>
        <Card
          title="作业项目"
          className="app-mt-2n"
          extra={[
            <Button type="primary" key="new">
              <Link to="/admin/create">新建</Link>
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
        onClose={() => dispatch(ducks.route.creators.navigate("/admin"))}
      >
        <AdminPageCreate
          duck={ducks.createProject}
          dispatch={dispatch}
          store={store}
        />
      </Drawer>
    </Scaffold>
  );
});

interface IProjectOwnWrapper extends DuckCmpProps<AdminPageDuck> {
  projectOwn: IProjectItemOwn[];
}

function ProjectOwnWrapper({
  projectOwn,
  dispatch,
  store,
  duck,
}: IProjectOwnWrapper) {
  const distributedProjectOwn = distributeArray<IProjectItemOwn>(projectOwn, 2);
  const { selector } = duck;
  const { filesInfoMap } = selector(store);
  return (
    <>
      {distributedProjectOwn.map((row, rowIndex) => (
        <Row gutter={[16, 16]} key={rowIndex}>
          {row.map((col, colIndex) => {
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
                            dispatch(duck.creators.fetchFiles(col.id));
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
