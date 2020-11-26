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
    title: "管理员",
    dataIndex: "adminName",
  },
  {
    title: "标签",
    dataIndex: "labels",
    render(labels) {
      return (
        <Space>
          {labels?.length ? (
            labels?.map?.((label, labelIndex) => (
              <Tag color={Tag.getColor(label)} key={labelIndex}>
                {label}
              </Tag>
            ))
          ) : (
            <span>暂无标签</span>
          )}
        </Space>
      );
    },
  },
  {
    title: "作业名称",
    dataIndex: "name",
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
