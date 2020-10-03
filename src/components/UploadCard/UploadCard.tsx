import React, { Props, ReactNode } from "react";
import {
  Form,
  Input,
  Popover,
  Upload,
  Divider,
  Button,
  Space,
  Tag,
  Alert,
  Result,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { IProjectItem } from "@/utils";
const { Dragger } = Upload;

const UploadCardWrapper = styled.div`
  max-width: 600px;
`;

const CodeInput = styled(Input)`
  max-width: 400px;
`;

interface IUploadCard extends Props<null> {
  currentProject: IProjectItem;
  showSuccess: boolean;
  showLoading: boolean;
  onUpload: Function;
  successResultExtra: ReactNode | ReactNode[];
}

export default function UploadCard({
  currentProject,
  showSuccess,
  showLoading,
  successResultExtra,
}: IUploadCard) {
  if (showSuccess) {
    return (
      <UploadCardWrapper className="app-mlr-auto">
        <Result
          className="app-mlr-auto"
          status="success"
          title="文件上传成功"
          extra={successResultExtra}
        />
      </UploadCardWrapper>
    );
  }

  return (
    <UploadCardWrapper className="app-mlr-auto">
      <Form>
        <Form.Item label="作业名称">
          <div>{currentProject?.name}</div>
        </Form.Item>
        <Form.Item label="管理员">
          <div>{currentProject?.adminName}</div>
        </Form.Item>
        <Form.Item label="提交人数">
          <div>99/100</div>
        </Form.Item>
        <Divider />
        <Form.Item name="codes" label="口令" rules={[{ required: true }]}>
          <Popover content="用于在下次提交时,确认你是你">
            <CodeInput disabled={showLoading} placeholder="请输入一条口令" />
          </Popover>
        </Form.Item>
        <Alert
          message="请注意不合规则的文件名将会被拒绝提交"
          type="info"
          showIcon
          className="app-mb-2n"
        />
        <Form.Item label="支持的文件格式">
          <Space>
            {currentProject?.fileNameExtensions?.map((tag, tagIndex) => (
              <Tag key={tagIndex}>{tag}</Tag>
            ))}
          </Space>
        </Form.Item>
        <Form.Item label="正确的文件名示例">
          <Popover
            content={`对应的正则表达式为${currentProject?.fileNamePattern}`}
          >
            <span>{currentProject?.fileNameExample}</span>
          </Popover>
        </Form.Item>
        <Dragger disabled={showLoading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-hint">点击或者将文件拖拽到此处</p>
        </Dragger>
        <Button
          type="primary"
          htmlType="button"
          block
          className="app-mt-3n"
          loading={showLoading}
        >
          {showLoading ? "提交中" : "确认提交"}
        </Button>
      </Form>
    </UploadCardWrapper>
  );
}
