import { classnames } from "@/utils";
import React from "react";
import styles from "./Button.module.less";
import { LoadingOutlined } from "@ant-design/icons";

interface IButton {
  type?: "text" | "link" | "ghost" | "primary" | "default" | "dashed";
  size?: "small" | "middle" | "large" | undefined;
  danger?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
  block?: boolean;
  htmlType?: "button" | "submit" | "reset";
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Button({
  disabled,
  block,
  className,
  danger,
  htmlType,
  loading,
  onClick,
  size = "middle",
  style,
  type = "default",
  children,
}: IButton) {
  return (
    <button
      className={classnames({
        [styles.btn]: true,
        [styles["btn-primary"]]: type === "primary",
        [styles["btn-sm"]]: size === "small",
        [styles[getThemeCls("link", danger)]]: type === "link",
        [styles[getThemeCls("text", danger)]]: type === "text",
        [styles["btn-block"]]: block,
        [className]: className?.length,
      })}
      style={style}
      onClick={onClick}
      type={htmlType}
      disabled={disabled || loading}
    >
      {loading && <LoadingOutlined style={{ marginRight: "5px" }} />}
      {children}
    </button>
  );
}

function getThemeCls(type, danger) {
  return `btn-${type}${danger ? "-danger" : ""}`;
}
