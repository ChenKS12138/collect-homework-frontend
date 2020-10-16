import React, { useState } from "react";
import styles from "./Collspase.module.less";

interface ICollapse {
  accordion?: boolean;
  children?: React.ReactNode;
}

export default function Collspase({ children }: ICollapse) {
  return <div className={styles.container}>{children}</div>;
}

interface IPanel {
  header: React.ReactNode;
  children: React.ReactNode;
}

function Panel({ header, children }: IPanel) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.panel}>
      <div
        className={styles.header}
        onClick={() => {
          setShow(!show);
        }}
      >
        <span className={styles.spin}>
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="right"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            style={{ transform: `rotate(${show ? 90 : 0}deg)` }}
          >
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
          </svg>
        </span>
        {header}
      </div>
      <div className={show ? styles.content : styles["content-hidden"]}>
        {children}
      </div>
    </div>
  );
}

Collspase.Panel = Panel;
