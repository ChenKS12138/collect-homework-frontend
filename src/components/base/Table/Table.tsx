import { classnames } from "@/utils";
import React from "react";
import styles from "./Table.module.less";

interface ITable {
  rowKey?: string;
  bordered?: boolean;
  loading?: boolean;
  dataSource: any[];
  pagination?: false;
  columns: any[];
  locale: {
    emptyText: React.ReactNode;
  };
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  };
  className?: string;
  rowClassName?: string;
}

export default function Table({
  columns,
  dataSource,
  className,
  rowClassName,
  locale,
  loading,
}: ITable) {
  return (
    <div
      className={classnames({
        [styles["spin-container"]]: loading,
        [className]: className?.length,
      })}
    >
      {loading && (
        <div className={styles.spin}>
          <span className={styles["span-cell"]}>
            <i
              className={styles["span-cell-circle"]}
              style={{ top: 0, left: 0, animationDelay: "0s" }}
            />
            <i
              className={styles["span-cell-circle"]}
              style={{ top: 0, right: 0, animationDelay: "1s" }}
            />
            <i
              className={styles["span-cell-circle"]}
              style={{ bottom: 0, left: 0, animationDelay: "2s" }}
            />
            <i
              className={styles["span-cell-circle"]}
              style={{ bottom: 0, right: 0, animationDelay: "3s" }}
            />
          </span>
        </div>
      )}
      <div
        className={classnames({
          [styles.container]: true,
        })}
      >
        <table className={styles.table}>
          <colgroup />
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  className={styles.cell}
                  key={index}
                  data-index={column?.dataIndex}
                >
                  {column?.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource?.length ? (
              dataSource.map((instance, index) => (
                <tr
                  className={classnames({
                    [styles.tr]: true,
                    [rowClassName]: rowClassName?.length,
                  })}
                  key={index}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      className={classnames({
                        [styles.cell]: true,
                        [styles.td]: true,
                      })}
                      key={index + "_" + colIndex}
                    >
                      {column?.render
                        ? column?.render?.(instance?.[column?.dataIndex])
                        : instance?.[column?.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr style={{ padding: "10px auto" }}>
                <td
                  colSpan={columns?.length}
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  {locale?.emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
