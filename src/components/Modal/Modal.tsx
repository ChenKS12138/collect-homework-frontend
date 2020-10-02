import React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.querySelector("#portal-root");

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }
  el: HTMLElement;
  componentDidMount() {
    modalRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
