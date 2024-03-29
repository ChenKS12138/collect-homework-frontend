import React from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.less";
import { Button } from "base-component";
import DisableBodyScrollStyle from "../DisableBodyScrollStyle/DisableBodyScrollStyle";

interface IModal {
  title?: React.ReactNode;
  visible?: boolean;
  closeable?: boolean;
  onClose?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onOk?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
export default class Modal extends React.Component<
  IModal,
  { showModal: boolean; hasRenderBefore: boolean }
> {
  ele: HTMLElement;
  hasRenderBefore: boolean;
  ref: React.RefObject<any>;
  constructor(props) {
    super(props);
    this.ele = document.createElement("div");
    this.state = {
      hasRenderBefore: false,
      showModal: false,
    };
    this.ref = React.createRef();
  }
  componentWillUnmount() {
    this.ele.remove();
  }
  renderContent() {
    const { children, footer, onOk, title, visible, closeable } = this.props;
    const { showModal, hasRenderBefore } = this.state;
    const shoudleVisible = hasRenderBefore && visible;
    return (
      <div
        className={styles.container}
        style={{ zIndex: shoudleVisible || showModal ? 9 : -9 }}
      >
        {shoudleVisible && <DisableBodyScrollStyle />}
        <div
          className={styles.mask}
          style={{
            backgroundColor: shoudleVisible
              ? "rgba(0,0,0,0.45)"
              : "rgba(0,0,0,0)",
          }}
          onClick={this.handleCancel}
          onTransitionEnd={this.handleTransionEnd}
        />
        <div
          className={styles.wrapper}
          style={{
            transform: shoudleVisible
              ? "translate(-50%,0) scale(1)"
              : "translate(-50%,0) scale(1.1)",
            opacity: shoudleVisible ? 1 : 0,
          }}
        >
          <div className={styles.content}>
            {closeable && (
              <button className={styles.close} onClick={this.handleCancel}>
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
              </button>
            )}
            {title && (
              <div className={styles.header}>
                <div className={styles.title}>{title}</div>
              </div>
            )}
            <div className={styles.body} ref={this.ref}>
              {children}
            </div>
            {footer !== null && (
              <div className={styles.footer}>
                <Button
                  style={{ marginRight: "8px" }}
                  onClick={this.handleCancel}
                >
                  Canlel
                </Button>
                <Button type="primary" onClick={onOk}>
                  OK
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  handleTransionEnd = () => {
    this.setState({ showModal: this.props.visible });
  };
  handleCancel = (e) => {
    e.preventDefault();
    if (this.props.closeable !== false) {
      this.props.onClose(e);
    }
  };
  getContainer() {
    if (!this.state.hasRenderBefore) {
      (document.getElementById("portal-root") ?? document.body).appendChild(
        this.ele
      );
      // 首次渲染Modal会有副作用，进行第二次渲染
      setTimeout(() => {
        this.setState({
          hasRenderBefore: true,
        });
      });
    }
    return this.ele;
  }
  render() {
    if (!this.state.hasRenderBefore && !this.props.visible) {
      return null;
    }
    return ReactDOM.createPortal(this.renderContent(), this.getContainer());
  }
}
