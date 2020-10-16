import { ProgressDuck } from "@/ducks";
import { Observer } from "@/utils";

export default class AdminPageDownloadProgressDuck extends ProgressDuck {
  progressObserver: Observer;
  constructor(props) {
    super(props);
    this.progressObserver = new Observer(0);
  }
  emitProgress = (emit) => {
    const cb = (value) => {
      emit(value);
    };
    this.progressObserver.listen(cb);
    return () => {
      this.progressObserver.cancel(cb);
    };
  };
  emit(progress) {
    this.progressObserver.update(progress);
  }
}
