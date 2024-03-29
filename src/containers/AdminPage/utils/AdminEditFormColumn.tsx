import React from "react";
import { EditableTagSet } from "@/components";
import { IRenderEdit } from "@/duckComponents/EditableFormCard/EditableFormCard";
import { formatDate } from "@/utils";
import { IProjectItem } from "@/utils/interface";
import { Tag, Switch, Input } from "base-component";
import AdminPageEditFormDuck from "../ducks/AdminPageEditFormDuck";

const editFormColumns = [
  {
    key: "adminName",
    label: "管理员",
    renderShow(instance: IProjectItem) {
      return <div>{instance.adminName}</div>;
    },
  },
  {
    key: "fileNameExtensions",
    label: "文件后缀名",
    renderShow(instance) {
      return (
        <div>
          {instance.fileNameExtensions?.length ? (
            instance.fileNameExtensions?.map((tag, tagIndex) => (
              <Tag key={tagIndex}>{tag}</Tag>
            ))
          ) : (
            <span>暂无要求</span>
          )}
        </div>
      );
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const fileNameExtensions =
        duck.selectors(store)?.formData?.fileNameExtensions ?? [];

      const formatedList = Array.from(fileNameExtensions)?.map((x: string) => ({
        key: x,
        text: x,
      }));
      return (
        <EditableTagSet
          tagSet={formatedList}
          onTagSetChange={(value) => {
            dispatch(
              duck.creators.setFormDataPartly({
                fileNameExtensions: value?.map?.((x) => x.text) ?? [],
              })
            );
          }}
        />
      );
    },
  },
  {
    key: "labels",
    label: "标签",
    renderShow(instance) {
      return (
        <div>
          {instance.labels?.length ? (
            instance.labels?.map((label, labelIndex) => (
              <Tag key={labelIndex}>{label}</Tag>
            ))
          ) : (
            <span>暂无标签</span>
          )}
        </div>
      );
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const labels = duck.selectors(store)?.formData?.labels ?? [];
      const formatedList = Array.from(labels)?.map((x: string) => ({
        key: x,
        text: x,
      }));
      return (
        <EditableTagSet
          tagSet={formatedList}
          onTagSetChange={(value) => {
            dispatch(
              duck.creators.setFormDataPartly({
                labels: value?.map?.((x) => x.text) ?? [],
              })
            );
          }}
        />
      );
    },
  },
  {
    key: "fileNameExample",
    label: "文件名示例",
    renderShow(instance: IProjectItem) {
      return (
        <div>
          {instance?.fileNameExample?.length
            ? instance?.fileNameExample
            : "暂无示例"}
        </div>
      );
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const fileNameExample =
        duck.selectors(store)?.formData?.fileNameExample ?? "";
      return (
        <Input
          defaultValue={fileNameExample}
          onChange={(event) => {
            dispatch(
              duck.creators.setFormDataPartly({
                fileNameExample: event.target.value,
              })
            );
          }}
        />
      );
    },
  },
  {
    key: "fileNamePattern",
    label: "文件名正则表达式",
    renderShow(instance: IProjectItem) {
      return (
        <div>
          {instance?.fileNamePattern?.length
            ? instance?.fileNamePattern
            : "暂无要求"}
        </div>
      );
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const fileNamePattern =
        duck.selectors(store)?.formData?.fileNamePattern ?? "";
      return (
        <Input
          defaultValue={fileNamePattern}
          onChange={(event) => {
            dispatch(
              duck.creators.setFormDataPartly({
                fileNamePattern: event.target.value,
              })
            );
          }}
        />
      );
    },
  },
  {
    key: "visible",
    label: "是否对外公布",
    renderShow(instance: IProjectItem) {
      return <Switch disabled checked={instance.visible} />;
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const visible = duck.selectors(store)?.formData?.visible;
      return (
        <Switch
          checked={visible}
          onChange={(checked) => {
            dispatch(duck.creators.setFormDataPartly({ visible: checked }));
          }}
        />
      );
    },
  },
  {
    key: "sendEmail",
    label: "是否发送邮件提醒",
    renderShow(instance: IProjectItem) {
      return <Switch disabled checked={instance.sendEmail} />;
    },
    renderEdit({ store, duck, dispatch }: IRenderEdit<AdminPageEditFormDuck>) {
      const sendEmail = duck.selectors(store)?.formData?.sendEmail;
      return (
        <Switch
          checked={sendEmail}
          onChange={(checked) => {
            dispatch(duck.creators.setFormDataPartly({ sendEmail: checked }));
          }}
        />
      );
    },
  },
  {
    key: "createAt",
    label: "创建时间",
    renderShow(instance: IProjectItem) {
      return <div>{formatDate(instance.createAt)}</div>;
    },
  },
];

export default editFormColumns;
