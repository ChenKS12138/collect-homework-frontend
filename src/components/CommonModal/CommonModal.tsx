import React, { useState, ReactNode } from "react";
import { Modal } from "base-component";

interface IAdminPageDeleteModel {
  innerComponent?: (any, Function) => ReactNode;
  children?: ReactNode;
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  closeable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  title?: React.ReactNode | string;
  footer?: React.ReactNode;
}

export default function CommonModal({
  children,
  onOk,
  onClose,
  innerComponent,
  title,
  closeable,
  footer,
}: IAdminPageDeleteModel) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {innerComponent(visible, setVisible)}
      <Modal
        title={title}
        visible={visible}
        onClose={(event) => {
          onClose?.(event);
          setVisible(false);
        }}
        closeable={closeable}
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
