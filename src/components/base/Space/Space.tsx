import React from "react";
import styles from "./Space.module.less";

interface ISpace {
  size?: number | "small" | "large" | "middle";
  children?: React.ReactNode;
}

export default function Space({ children }: ISpace) {
  return <div className={styles.container}>{children}</div>;
}
