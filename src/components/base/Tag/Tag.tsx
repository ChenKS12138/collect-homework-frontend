import React from "react";
import {
  blue,
  green,
  cyan,
  gold,
  orange,
  lime,
  volcano,
} from "@ant-design/colors";
import styles from "./Tag.module.less";

export interface TagColor {
  font: string;
  border: string;
  background: string;
}

interface ITag {
  onClose?: () => void;
  closable?: boolean;
  color?: TagColor;
  children: React.ReactNode;
}

const defaultTagColor = {
  font: "black",
  border: "rgb(217,217,217)",
  background: "rgb(250,250,250)",
};

const colors: TagColor[] = [
  {
    font: "white",
    border: "transparent",
    background: blue[6],
  },
  {
    font: "white",
    border: "transparent",
    background: green[7],
  },
  {
    font: "white",
    border: "transparent",
    background: cyan[6],
  },
  {
    font: "white",
    border: "transparent",
    background: gold[6],
  },
  {
    font: "white",
    border: "transparent",
    background: orange[6],
  },
  {
    font: "white",
    border: "transparent",
    background: lime[6],
  },
  {
    font: "white",
    border: "transparent",
    background: volcano[6],
  },
];

export default function Tag({ children, closable, onClose, color }: ITag) {
  const { font, background, border } = color ?? defaultTagColor;
  return (
    <span
      className={styles.tag}
      style={{ color: font, backgroundColor: background, borderColor: border }}
    >
      {children}
      {closable && (
        <span
          role="img"
          aria-label="close"
          className={styles.close}
          onClick={() => {
            onClose();
          }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </span>
      )}
    </span>
  );
}

Tag.colors = colors;

Tag.getColor = function (str: String) {
  const key = str.split("").reduce((a, b) => a + b.codePointAt(0), 0);
  return colors[Number(key) % colors.length];
};
