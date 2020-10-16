import { classnames } from "@/utils";
import React, { useContext } from "react";
import styles from "./Grid.module.less";

interface IRow {
  gutter?: [number, number];
  align?: "middle" | "top" | "bottom" | "stretch";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  justify?: "center" | "start" | "end" | "space-around" | "space-between";
}

const GutterContext = React.createContext<[number, number]>([24, 24]);

export function Row({
  align,
  className,
  gutter = [24, 24],
  style,
  children,
  justify,
}: IRow) {
  return (
    <div
      style={{ ...style, alignItems: align, justifyContent: justify }}
      className={classnames({
        [styles.row]: true,
        [className]: className?.length,
      })}
    >
      <GutterContext.Provider value={gutter}>{children}</GutterContext.Provider>
    </div>
  );
}

interface ICol {
  style?: React.CSSProperties;
  className?: string;
  push?: number;
  span?: number;
  children?: React.ReactNode;
}

export function Col({ className, push, span, style, children }: ICol) {
  const gutter = useContext(GutterContext);
  return (
    <div
      style={{
        ...style,
        flex: span ? `0 0 ${(100 * span) / gutter[0]}%` : "1",
        maxWidth: span ? `${(100 * span) / gutter[0]}%` : "100%",
      }}
      className={classnames({
        [styles.col]: true,
        [className]: className?.length,
      })}
    >
      {children}
    </div>
  );
}
