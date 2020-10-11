import React from "react";
import styles from "./List.module.less";

interface IList {
  dataSource: any[];
  bordered: boolean;
  renderItem: (any) => React.ReactNode;
  size: "small" | "default" | "large";
}

export default function List({ dataSource, renderItem }: IList) {
  return (
    <ol className={styles["list-ol"]}>
      {dataSource.map((item, index) => (
        <li className={styles["list-li"]} key={index}>
          {renderItem?.(item)}
        </li>
      ))}
    </ol>
  );
}
