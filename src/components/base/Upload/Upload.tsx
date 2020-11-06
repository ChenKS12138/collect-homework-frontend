import React, { useCallback, useRef } from "react";
import styles from "./Upload.module.less";

interface IDragger {
  multiple?: boolean;
  beforeUpload?: () => void;
  fileList?: File[];
  disabled?: boolean;
  onChange?: (event: { file: File }) => void;
  children?: React.ReactNode;
}

function Dragger({ fileList, disabled, onChange }: IDragger) {
  const refInput = useRef(null);

  const handleDrop = useCallback(
    (e: any) => {
      onChange({ file: e.dataTransfer.files[0] });
      e.preventDefault();
    },
    [onChange]
  );

  const handleDropOver = useCallback(
    (e: any) => {
      e.preventDefault();
    },
    [onChange]
  );

  const handleInputClick = useCallback(
    (e: any) => {
      refInput?.current?.click?.();
    },
    [refInput]
  );

  const handleInputChange = useCallback((e: any) => {
    onChange({ file: e?.srcElement?.files?.[0] });
  }, []);

  return (
    <span>
      <div
        className={styles.container}
        onDrop={handleDrop}
        onDragOver={handleDropOver}
        onClick={handleInputClick}
      >
        <span className={styles.upload}>
          <div className={styles.drag}>
            <input
              ref={refInput}
              type="file"
              style={{ display: "none" }}
              onChange={handleInputChange}
            />
            <p className={styles["drag-icon"]}>
              <span className={styles["drag-icon-inbox"]}>
                <svg
                  viewBox="0 0 1024 1024"
                  focusable="false"
                  data-icon="inbox"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                </svg>
              </span>
            </p>
            <p className={styles.hint}>单次上传限制大小 50M</p>
            <p className={styles.hint}>点击或者将文件拖拽到此处</p>
            <p className={styles.hint}>一次仅上传一个文件</p>
          </div>
        </span>
      </div>
      {fileList && (
        <span>
          <div>
            {fileList.map((file, key) => (
              <span key={key} className={styles["file-list"]}>
                <div>
                  <span className={styles["file-icon"]}>
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="paper-clip"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0012.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 00174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path>
                    </svg>
                  </span>
                </div>
                <span className={styles["file-name"]} title={file.name}>
                  {file.name}
                </span>
                {/* <span className={styles["file-action"]}>
              <button className={styles["file-delete-btn"]}>
                <span className={styles["file-delete"]}>
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="delete"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                  </svg>
                </span>
              </button>
            </span> */}
              </span>
            ))}
          </div>
        </span>
      )}
    </span>
  );
}

export default { Dragger };
