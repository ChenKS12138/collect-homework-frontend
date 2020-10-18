import { classnames } from "@/utils";
import React, { useCallback } from "react";
import styles from "./Input.module.less";

interface IInput {
  type?: "text" | "password";
  size?: "small" | "middle" | "large" | undefined;
  style?: React.CSSProperties;
  className?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  className,
  size,
  onPressEnter,
  ...rest
}: IInput) {
  const handlePressEnter = useCallback(
    (event) => {
      if (event.key === "Enter") {
        onPressEnter(event);
      }
    },
    [onPressEnter]
  );
  return (
    <input
      className={classnames({
        [styles.input]: true,
        [styles["input-sm"]]: size === "small",
        [className]: className?.length,
      })}
      onKeyDown={handlePressEnter}
      {...rest}
    />
  );
}

interface IPassword {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPressEnter?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

function Password(props: IPassword) {
  return <Input {...{ ...props, type: "password" }} />;
}

Input.Password = Password;
