import React, { ReactNode, useState } from "react";
import { Card, Form, Button, Tag } from "antd";
import { FormInstance } from "antd/lib/form";
const { useForm } = Form;

interface IManageCard<T = any> {
  title: string;
  initFormValue: any;
  formAttr: {
    key: string;
    label: string;
    name?: string;
    renderShow: (item: T) => ReactNode;
    renderEdit?: (item: T, formInstance: FormInstance) => ReactNode;
  }[];
  actions?: (options: {
    isEdit: boolean;
    setIsEdit: Function;
    formInstance: FormInstance;
  }) => ReactNode[];
  extra?: (options: {
    isEdit: boolean;
    setIsEdit: Function;
    formInstance: FormInstance;
  }) => ReactNode[];
}

export default function ManageCard({
  formAttr,
  initFormValue,
  title,
  actions,
  extra,
}: IManageCard) {
  const [isEdit, setIsEdit] = useState(false);
  const [formInstance] = useForm();

  return (
    <Card
      title={title}
      extra={extra({ isEdit, setIsEdit, formInstance })}
      actions={actions({ isEdit, setIsEdit, formInstance })}
    >
      <Form initialValues={initFormValue} form={formInstance}>
        {formAttr.map((attr) => (
          <Form.Item key={attr.key} label={attr.label} name={attr?.name}>
            {attr.renderEdit && isEdit
              ? attr.renderEdit(initFormValue, formInstance)
              : attr.renderShow(initFormValue)}
          </Form.Item>
        ))}
      </Form>
    </Card>
  );
}
