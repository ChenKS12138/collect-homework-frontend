import React, { Dispatch, ReactNode, useEffect, useState } from "react";
import { Card, Button, Tag } from "antd";
import { Form } from "base-component";
import { FormDuck } from "@/ducks";

export interface IRenderShow<T extends FormDuck = any> {
  duck: T;
  dispatch: Dispatch<any>;
  store: any;
}

export interface IRenderEdit<T extends FormDuck = any> {
  duck: T;
  dispatch: Dispatch<any>;
  store: any;
}

interface IManageCard<T = any> {
  title: string;
  instance: T;
  columns: {
    key: string;
    label: string;
    name?: string;
    renderShow: (instance: T) => ReactNode;
    renderEdit?: (options: IRenderEdit) => ReactNode;
  }[];
  actions?: (options: { isEdit: boolean; setIsEdit: Function }) => ReactNode[];
  extra?: (options: { isEdit: boolean; setIsEdit: Function }) => ReactNode[];
  duck: FormDuck;
  dispatch: Dispatch<any>;
  store: any;
}

export default function ManageCard({
  columns,
  title,
  actions,
  extra,
  duck,
  dispatch,
  store,
  instance,
}: IManageCard) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Card
      title={title}
      extra={extra({ isEdit, setIsEdit })}
      actions={actions({ isEdit, setIsEdit })}
    >
      <Form>
        {columns?.map?.((attr) => (
          <Form.Item key={attr.key} label={attr.label} name={attr?.name}>
            {attr.renderEdit && isEdit
              ? attr.renderEdit({ duck, dispatch, store })
              : attr.renderShow(instance)}
          </Form.Item>
        ))}
      </Form>
    </Card>
  );
}
