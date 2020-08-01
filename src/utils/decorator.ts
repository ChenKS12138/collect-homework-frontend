/**
 * 单例模式 装饰器
 */
export const singleton = (props?: { runOnceMethods?: string[] }) => {
  const { runOnceMethods } = props;
  return (Target) => {
    let instance = null;
    return function (...args) {
      if (!instance) {
        instance = new Target(...args);
        runOnceMethods.forEach((funcName) => {
          const func = instance[funcName];
          let runBefore = false;
          instance[funcName] = function (...funcArgs) {
            if (runBefore) return;
            runBefore = true;
            return func.call(instance, ...funcArgs);
          } as typeof func;
        });
      }
      return instance;
    } as typeof Target;
  };
};
