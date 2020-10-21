import React from "react";
import ReactDOM from "react-dom";
import styles from "./Popover.module.less";

interface IPopover {
  content: React.ReactText;
  children: React.ReactNode;
}

export default class Popover extends React.Component<
  IPopover,
  { visible: boolean; x: number; y: number; showContent: boolean }
> {
  ele: HTMLElement;
  hasRenderBefore: boolean;
  ref: React.RefObject<any>;
  constructor(props) {
    super(props);
    this.ele = document.createElement("div");
    this.hasRenderBefore = false;
    this.state = {
      visible: false,
      x: 0,
      y: 0,
      showContent: false,
    };
    this.ref = React.createRef();
  }
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
    this.setState({
      x: this.ref.current.offsetLeft + this.ref.current.clientWidth / 2,
      y: this.ref.current.offsetTop + this.ref.current.clientHeight / 2,
    });
  }
  componentWillUnmount() {
    this.ele.remove();
  }
  renderContent() {
    if (!this.hasRenderBefore && !this.state.visible) {
      return null;
    }
    const { x, y, visible, showContent } = this.state;
    const content = (
      <div
        className={styles.content}
        style={{
          zIndex: visible || showContent ? 9 : -9,
          top: y,
          left: x,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate(-50%, -150%) scale(1)"
            : "translate(-50%, -150%) scale(0)",
        }}
        onTransitionEnd={this.handleTransitionEnd}
      >
        <div className={styles.arrow}>
          <span className={styles["arrow-content"]}></span>
        </div>
        <div className={styles.inner}>
          <div className={styles["inner-content"]}>{this.props.content}</div>
        </div>
      </div>
    );
    return ReactDOM.createPortal(content, this.ele);
  }
  render() {
    return (
      <>
        <span
          ref={this.ref}
          onMouseOver={this.handleMouseEnter}
          onMouseOut={this.handleMouseLeave}
        >
          {this.props.children}
        </span>
        {this.renderContent()}
      </>
    );
  }
  handleTransitionEnd = () => {
    this.setState({ showContent: this.state.visible });
  };
  handleMouseEnter = (e) => {
    const clientRect = this.ref.current?.getBoundingClientRect?.();
    const top =
      clientRect?.top + clientRect?.height / 2 ??
      this.ref.current.offsetLeft + this.ref.current.clientWidth / 2;
    const left =
      clientRect?.left + clientRect?.width / 2 ??
      this.ref.current.offsetTop + this.ref.current.clientHeight / 2;
    this.setState({
      visible: true,
      x: left,
      y: top,
    });
    e.preventDefault();
  };
  handleMouseLeave = (e) => {
    this.setState({
      visible: false,
    });
  };
}
