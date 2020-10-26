import { classnames } from "@/utils";
import React from "react";
import styles from "./Form.module.less";

interface IForm {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface IFormItem {
  label?: string;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function Form({ children, className, style }: IForm) {
  return (
    <form
      className={classnames({
        [styles.container]: true,
        [className]: className?.length,
      })}
      style={{ ...style }}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {children}
    </form>
  );
}

function Item({ children, label, required, className }: IFormItem) {
  return (
    <div
      className={classnames({
        [styles.item]: true,
        [className]: className?.length,
      })}
    >
      {label?.length && (
        <label
          title={label}
          className={classnames({
            [styles.label]: true,
            [styles["label-required"]]: required,
          })}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
Form.Item = Item;
