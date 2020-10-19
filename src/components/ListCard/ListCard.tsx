import React, { Props, AllHTMLAttributes } from "react";
import { Button, Table, Empty, Tag, Space } from "base-component";
import styled from "styled-components";
import { IProjectItem } from "@/utils/interface";
import { RouterLink } from "router";

const ListCardWrapper = styled(Table)`
  border-radius: 8px;
  max-width: 90vw;
`;

const columns = [
  {
    title: "作业名称",
    dataIndex: "name",
  },
  {
    title: "管理员",
    dataIndex: "adminName",
  },
  {
    title: "支持的文件格式",
    dataIndex: "fileNameExtensions",
    render(tags) {
      return (
        <Space>
          {tags?.length ? (
            tags?.map?.((tag, tagIndex) => <Tag key={tagIndex}>{tag}</Tag>)
          ) : (
            <span>暂无要求</span>
          )}
        </Space>
      );
    },
  },
  {
    title: "文件名示例",
    dataIndex: "fileNameExample",
    render(example: string) {
      return <span>{example?.length ? example : "暂无要求"}</span>;
    },
  },
  {
    title: "创建时间",
    dataIndex: "createAt",
  },
  {
    title: "操作",
    dataIndex: "id",
    render(id) {
      return (
        <RouterLink
          style={{ color: "#ffffff" }}
          className="app-text-size-1n"
          to={`/detail/${id}`}
        >
          <Button type="primary" size="small">
            去提交
          </Button>
        </RouterLink>
      );
    },
  },
];

interface IListCard extends Props<null>, AllHTMLAttributes<null> {
  dataSource: IProjectItem[];
  loading: boolean;
}

export default function ListCard(props: IListCard) {
  const { className, style, dataSource = [], loading } = props;

  return (
    <ListCardWrapper
      rowKey="id"
      bordered
      loading={loading}
      dataSource={dataSource}
      pagination={false}
      columns={columns}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无作业需要提交"
          ></Empty>
        ),
      }}
      scroll={{
        x: true,
      }}
      className={`app-mlr-auto app-mt-4n app-box-shadow-default ${className}`}
      rowClassName="app-text-size-1n"
    />
  );
}
