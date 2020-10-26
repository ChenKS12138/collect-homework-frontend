import React, { Dispatch, Props, ReactNode, useEffect } from "react";
import {
  Popover,
  Space,
  Input,
  Form,
  Tag,
  Result,
  Button,
  Divider,
  Alert,
  Upload,
} from "base-component";
import { InboxOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { IProjectItem } from "@/utils/interface";
import { notice } from "@/utils";
import ListPageUploadFormDuck from "@/containers/ListPage/ducks/ListPageUploadFormDuck";

const { Dragger } = Upload;

const UploadCardWrapper = styled.div`
  max-width: 600px;
`;

const CodeInput = styled(Input)`
  max-width: 400px;
`;

interface IUploadCard extends Props<null> {
  currentProject: IProjectItem;
  uploadCount: number;
  showSuccess: boolean;
  showLoading: boolean;
  onUpload: Function;
  successResultExtra: ReactNode | ReactNode[];
  duck: ListPageUploadFormDuck;
  dispatch: Dispatch<any>;
  store: any;
}

export default function UploadCard({
  currentProject,
  showSuccess,
  showLoading,
  successResultExtra,
  uploadCount,
  dispatch,
  duck,
  store,
  onUpload,
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

  useEffect(() => {
    dispatch(
      duck.creators.setFormDataPartly({ projectId: currentProject?.id })
    );
  }, [currentProject, currentProject?.id]);
  const { formData } = duck.selector(store);

  return (
    <UploadCardWrapper className="app-mlr-auto">
      <Form>
        <Form.Item className="app-text-weight-8n" label="作业名称">
          <div>{currentProject?.name}</div>
        </Form.Item>
        <Form.Item label="管理员">
          <div>{currentProject?.adminName}</div>
        </Form.Item>
        <Form.Item label="已提交份数">
          <div>{uploadCount ?? "-"}</div>
        </Form.Item>
        <Divider />
        <Form.Item name="codes" label="口令" required>
          <Popover content="用于在下次提交时,确认你是你">
            <CodeInput
              value={formData?.secret}
              disabled={showLoading}
              placeholder="请输入一条口令"
              onChange={(event) => {
                dispatch(
                  duck.creators.setFormDataPartly({
                    secret: event.target.value,
                  })
                );
              }}
            />
          </Popover>
        </Form.Item>
        <Alert
          message="请注意不合规则的文件名将会被拒绝提交"
          className="app-mb-2n"
        />
        <Form.Item label="支持的文件格式">
          <Space>
            {currentProject?.fileNameExtensions?.length ? (
              currentProject?.fileNameExtensions?.map((tag, tagIndex) => (
                <Tag key={tagIndex}>{tag}</Tag>
              ))
            ) : (
              <span>暂无要求</span>
            )}
          </Space>
        </Form.Item>
        <Form.Item label="正确的文件名示例">
          <Popover
            content={
              currentProject?.fileNamePattern?.length
                ? `文件名正则表达式要求为${currentProject?.fileNamePattern}`
                : "正则表达式无要求"
            }
          >
            <span>
              {currentProject?.fileNameExample?.length
                ? currentProject?.fileNameExample
                : "暂无文件名示例"}
            </span>
          </Popover>
        </Form.Item>
        <Dragger
          multiple={false}
          beforeUpload={() => false}
          fileList={formData?.file ? [formData?.file] : []}
          disabled={showLoading}
          onChange={(event) => {
            const { file: currentFile } = event;
            const { name: currentFileName } = currentFile;
            const [extensionName, ...prefixNameList] = currentFileName
              .split(".")
              .reverse();
            const prefixName = prefixNameList.join("");
            if (
              currentProject?.fileNameExtensions?.length &&
              !currentProject?.fileNameExtensions?.includes?.(extensionName)
            ) {
              notice.error({ text: "文件后缀名不合法" });
              return;
            }
            if (
              currentProject?.fileNamePattern?.length &&
              !new RegExp(String.raw`${currentProject?.fileNamePattern}`).test(
                prefixName
              )
            ) {
              notice.error({ text: "文件名不满足正则表达式" });
              return;
            }
            dispatch(duck.creators.setFormDataPartly({ file: currentFile }));
          }}
        >
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
          onClick={() => {
            const uploadForm = duck.selector(store)?.formData ?? {};
            onUpload(uploadForm);
          }}
        >
          {showLoading ? "提交中" : "确认提交"}
        </Button>
      </Form>
    </UploadCardWrapper>
  );
}
