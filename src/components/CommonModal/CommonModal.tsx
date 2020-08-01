import React, { useState, Props, ReactNode, Component } from "react";
import { Modal } from "antd";
import { ModalProps } from "antd/lib/modal";

interface IAdminPageDeleteModel extends Props<null>, ModalProps {
  innerComponent?: (any, Function) => ReactNode;
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
