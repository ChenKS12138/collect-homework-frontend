import { classnames } from "@/utils";
import React from "react";
import styles from "./Layout.module.less";

interface ILayout {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export default function Layout({ style, children, className }: ILayout) {
  return (
    <section
      className={classnames({
        [styles.container]: true,
        [className]: className?.length,
      })}
      style={style}
    >
      {children}
    </section>
  );
}

function Header({ children, className, style }: ILayout) {
  return (
    <header
      className={classnames({
        [styles.header]: true,
        [className]: className?.length,
      })}
      style={style}
    >
      {children}
    </header>
  );
}

function Content({ children, className, style }: ILayout) {
  return (
    <main
      className={classnames({
        [styles.content]: true,
        [className]: className?.length,
      })}
      style={style}
    >
      {children}
    </main>
  );
}

function Footer({ children, className, style }: ILayout) {
  return (
    <footer
      className={classnames({
        [styles.footer]: true,
        [className]: className?.length,
      })}
    >
      {children}
    </footer>
  );
}

Layout.Header = Header;
Layout.Content = Content;
Layout.Footer = Footer;
