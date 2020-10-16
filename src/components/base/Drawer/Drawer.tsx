import React from "react";
import ReactDOM from "react-dom";
import styles from "./Drawer.module.less";

interface IDrawer {
  visible?: boolean;
  title?: React.ReactNode;
  height: React.ReactText;
  width: React.ReactText;
  placement: "right" | "top" | "bottom" | "left";
  closable?: boolean;
  onClose?: (e: any) => void;
  children?: React.ReactNode;
}

export default class Drawer extends React.Component<
  IDrawer,
  { showDrawer: boolean }
> {
  ele: HTMLElement;
  hasRenderBefore: boolean;
  constructor(props) {
    super(props);
    this.ele = document.createElement("div");
    this.hasRenderBefore = false;
    this.state = {
      showDrawer: false,
    };
  }
  componentWillUnmount() {
    this.ele.remove();
  }
  renderDrawer() {
    const {
      placement,
      width,
      height,
      closable,
      children,
      title,
      visible,
    } = this.props;
    const { showDrawer } = this.state;
    return (
      <div
        style={{ zIndex: visible || showDrawer ? 9 : -9 }}
        className={styles.container}
        onWheel={this.handleDrawerWheel}
      >
        <div
          style={{
            backgroundColor: visible ? "rgba(0, 0, 0, 0.45)" : "rgba(0,0,0,0)",
          }}
          className={styles.mask}
          onClick={this.handleClickClose}
          onTransitionEnd={this.handleTransitionComplete}
        >
          <div
            className={styles.drawer}
            style={{
              width,
              height,
              ...getPlacementStyle(placement, visible),
            }}
            onClick={this.handleContentClick}
          >
            {(title || closable) && (
              <div className={styles["drawer-header"]}>
                {title && <div className={styles.title}>{title}</div>}
                <button
                  onClick={this.handleClickClose}
                  className={styles.close}
                >
                  {closable && (
                    <span className={styles["close-icon"]}>
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
                </button>
              </div>
            )}
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
  handleContentClick = (e) => {
    e.stopPropagation();
  };
  handleClickClose = (e) => {
    this.props.onClose(e);
    e.preventDefault();
  };
  handleTransitionComplete = () => {
    this.setState({ showDrawer: this.props.visible });
  };
  handleDrawerWheel = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };
  getContainer() {
    if (!this.hasRenderBefore) {
      (document.getElementById("portal-root") ?? document.body).appendChild(
        this.ele
      );
      this.hasRenderBefore = true;
    }
    return this.ele;
  }
  componentDidMount() {
    this.getContainer();
  }
  render() {
    if (!this.hasRenderBefore && !this.props.visible) {
      return null;
    }
    return ReactDOM.createPortal(this.renderDrawer(), this.getContainer());
  }
}

const conditions: {
  [key: string]: React.CSSProperties;
} = {
  right: { top: 0, right: 0 },
  ["right-hidden"]: { top: 0, right: "-100%" },
  top: { top: 0, left: 0 },
  ["top-hidden"]: { top: "-100%", left: 0 },
  bottom: { bottom: 0, left: 0 },
  ["bottom-hidden"]: { bottom: "-100%", left: 0 },
  left: { top: 0, left: 0 },
  ["left-hidden"]: { top: 0, left: "-100%" },
};

function getPlacementStyle(
  placement: "right" | "top" | "bottom" | "left",
  visible: boolean
) {
  return conditions[visible ? placement : `${placement}-hidden`];
}
