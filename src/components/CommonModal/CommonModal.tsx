import React, { useState, ReactNode } from "react";
import { Modal } from "base-component";

interface IAdminPageDeleteModel {
  innerComponent?: (any, Function) => ReactNode;
  children?: ReactNode;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  title?: React.ReactNode | string;
  footer?: React.ReactNode;
}

export default function CommonModal({
  children,
  onOk,
  onCancel,
  innerComponent,
  title,
  footer,
}: IAdminPageDeleteModel) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {innerComponent(visible, setVisible)}
      <Modal
        title={title}
        visible={visible}
        onCancel={(event) => {
          onCancel?.(event);
          setVisible(false);
        }}
        onOk={(event) => {
          onOk?.(event);
          setVisible(false);
        }}
        footer={footer}
      >
        {children}
      </Modal>
    </>
  );
}
