import React from "react";
import { classnames } from "@/utils";
import styles from "./Switch.module.less";

interface ISwitch {
  disabled?: boolean;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Switch({ checked, disabled, onChange }: ISwitch) {
  return (
    <button
      className={classnames({
        [styles["container-checked"]]: checked,
        [styles.container]: true,
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
      onClick={() => {
        onChange(!checked);
      }}
    >
      <div
        className={classnames({
          [styles.handle]: true,
          [styles["handle-checked"]]: checked,
        })}
      />
      <span className={styles.inner} />
    </button>
  );
}
