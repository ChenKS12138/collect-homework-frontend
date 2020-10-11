//@ts-ignore
import React from "react";
import styles from "./Alert.module.less";

import { classnames } from "@/utils";

interface IAlert {
  message: string;
  className?: string;
}

export default function Alert({ message, className }: IAlert) {
  return (
    <div
      className={classnames({
        [styles.container]: true,
        [className]: className?.length,
      })}
    >
      <span className={styles.icon} role="img">
        <svg
          viewBox="64 64 896 896"
          width="1em"
          height="1em"
          style={{ verticalAlign: "middle" }}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"></path>
        </svg>
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
