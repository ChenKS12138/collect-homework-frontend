import React from "react";

export default function Loading() {
  return (
    <div id="loading">
      <div className="spinner">
        <div className="rect1"></div>
        <div className="rect2"></div>
        <div className="rect3"></div>
        <div className="rect4"></div>
        <div className="rect5"></div>
      </div>
      <p className="spinner-text">加载中...</p>
    </div>
  );
}
