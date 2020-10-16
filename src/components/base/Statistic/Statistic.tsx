import React from "react";
import styles from "./Statistic.module.less";

interface IStatistic {
  title: React.ReactNode;
  value: React.ReactNode;
  suffix: React.ReactNode;
}

export default function Statistic({ suffix, title, value }: IStatistic) {
  return (
    <div className={styles.statistic}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>
        <span className={styles["content-value"]}>
          <span className={styles["content-value-int"]}>{value}</span>
        </span>
        <span className={styles["content-suffix"]}>{suffix}</span>
      </div>
    </div>
  );
}
