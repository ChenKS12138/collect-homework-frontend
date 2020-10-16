import { classnames } from "@/utils";
import React from "react";
import styles from "./Card.module.less";

interface ICard {
  title: React.ReactNode;
  extra?: React.ReactNode;
  actions?: React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
}

export default function Card({
  title,
  actions,
  children,
  extra,
  className,
}: ICard) {
  return (
    <div
      className={classnames({
        [styles.container]: true,
        [className]: className?.length,
      })}
    >
      <div className={styles.head}>
        <div className={styles.title}>{title}</div>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
      <div className={styles.body}>{children}</div>
      {actions?.length && (
        <ul className={styles.actions}>
          {actions?.map?.((action, key) => (
            <li
              key={key}
              className={styles["action-item"]}
              style={{ width: 100 / actions.length + "%" }}
            >
              {action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
