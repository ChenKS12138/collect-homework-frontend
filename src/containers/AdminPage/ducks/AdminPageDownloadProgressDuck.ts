import { ProgressDuck } from "@/ducks";
import { Watcher } from "@/utils";

export default class AdminPageDownloadProgressDuck extends ProgressDuck {
  progressWatcher: Watcher;
  constructor(props) {
    super(props);
    this.progressWatcher = new Watcher(0);
  }
  emitProgress = (emit) => {
    const cb = (value) => {
      emit(value);
    };
    this.progressWatcher.add(cb);
    return () => {
      this.progressWatcher.cancel(cb);
    };
  };
  emit(progress) {
    this.progressWatcher.update(progress);
  }
}
