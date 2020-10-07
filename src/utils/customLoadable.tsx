import React, { useEffect, useState } from "react";

interface ILoadable {
  loader: () => Promise<{
    default: () => JSX.Element;
  }>;
  loading?: JSX.Element;
  minDuration?: number; // 确保足够长的loading时间，避免页面闪烁
}

export function loadable({
  loader,
  loading = null,
  minDuration = 0,
}: ILoadable): () => JSX.Element {
  let LastComponent: any = null;
  return function LoadableComponent(props) {
    const [currentElement, setCurrentElement] = useState(
      LastComponent ? <LastComponent {...props} /> : loading
    );
    useEffect(() => {
      if (!LastComponent) {
        const start = Date.now();
        loader().then((mod) => {
          LastComponent = mod.default;
          setTimeout(() => {
            setCurrentElement(<LastComponent {...props} />);
          }, Math.max(0, minDuration - (Date.now() - start)));
        });
      }
    }, []);
    return currentElement;
  } as any;
}
