import { EditableTagSet } from "@/components";
import { IRenderEdit } from "@/duckComponents/EditableFormCard/EditableFormCard";
import { formatDate } from "@/utils";
import { IProjectItem } from "@/utils/interface";
import { Input, Tag } from "antd";
import React from "react";
import AdminPageEditFormDuck from "./AdminPageEditFormDuck";

const editFormColumns = [
  {
    key: "adminName",
    label: "管理员",
    renderShow: (instance: IProjectItem) => <div>{instance.adminName}</div>,
  },
  {
    key: "fileNameExtensions",
    label: "文件后缀名",
    renderShow: (instance) => {
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
    renderEdit: ({
      store,
      duck,
      dispatch,
    }: IRenderEdit<AdminPageEditFormDuck>) => {
      const fileNameExtensions =
        duck.selector(store)?.formData?.fileNameExtensions ?? [];

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
    key: "fileNameExample",
    label: "文件名示例",
    renderShow: (instance: IProjectItem) => {
      return (
        <div>
          {instance?.fileNameExample?.length
            ? instance?.fileNameExample
            : "暂无示例"}
        </div>
      );
    },
    renderEdit: ({
      store,
      duck,
      dispatch,
    }: IRenderEdit<AdminPageEditFormDuck>) => {
      const fileNameExample =
        duck.selector(store)?.formData?.fileNameExample ?? "";
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
    renderShow: (instance: IProjectItem) => {
      return (
        <div>
          {instance?.fileNamePattern?.length
            ? instance?.fileNamePattern
            : "暂无要求"}
        </div>
      );
    },
    renderEdit: ({
      store,
      duck,
      dispatch,
    }: IRenderEdit<AdminPageEditFormDuck>) => {
      const fileNamePattern =
        duck.selector(store)?.formData?.fileNamePattern ?? "";
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
    key: "createAt",
    label: "创建时间",
    renderShow: (instance: IProjectItem) => (
      <div>{formatDate(instance.createAt)}</div>
    ),
  },
];

export default editFormColumns;
