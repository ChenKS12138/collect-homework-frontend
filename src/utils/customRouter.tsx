import React, {
  Props,
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from "react";
import { LinkProps } from "react-router-dom";
import { Watcher } from "@/utils/utils";
import { pathToRegexp, match } from "path-to-regexp";

const HistoryContext = React.createContext("history");
const pathWatcher = new Watcher<{ path: string; matched: string[] }>({
  path: window.location.pathname,
  matched: [],
});

export class Router extends React.Component<Props<null>, { path: string }> {
  historyState: any;
  constructor(props) {
    super(props);
    this.state = {
      path: pathWatcher.value.path,
    };
    this.historyState = {};
  }
  componentDidMount() {
    pathWatcher.add(this.handlePathChange);
  }
  componentWillUnmount() {
    pathWatcher.cancel(this.handlePathChange);
  }
  handlePathChange = ({ path }) => {
    this.setState({ path });
    window.history.pushState(this.historyState, path, path);
  };
  render() {
    return (
      <HistoryContext.Provider value={this.state.path}>
        {this.props.children}
      </HistoryContext.Provider>
    );
  }
}

export class Route extends React.Component<
  PropsWithChildren<{ path: string | string[] }>,
  any
> {
  static contextType = HistoryContext;
  pathMatch = (path: string) => {
    return pathToRegexp(path).test(this.context);
  };
  render() {
    const { path, children } = this.props;
    if (Array.isArray(path)) {
      const pathFinder = path.find((value) => this.pathMatch(value));
      if (pathFinder) {
        return children;
      }
    } else {
      if (this.pathMatch(path)) {
        return children;
      }
    }
    return null;
  }
}

export class RouterLink extends React.Component<LinkProps, any> {
  handleClick = (event) => {
    pathWatcher.update({
      path: (this.props?.to as string) || "#",
      matched: [],
    });
    if (this.props?.onClick instanceof Function) {
      this.props.onClick(event);
    }
  };
  render() {
    const { to, ...rest } = this.props;
    return (
      <a onClick={this.handleClick} {...rest}>
        {this.props.children}
      </a>
    );
  }
}

export const navigateTo = (path: string) => {
  pathWatcher.update({
    path: path,
    matched: [],
  });
};

export const getCurrentRoute = () => pathWatcher.value;

export function useRouteMatch<T extends object = any>(pattern) {
  type MatchType = {
    index: number;
    path: string;
    params: T;
  };
  const [matched, setMatched] = useState(
    match(pattern)(getCurrentRoute().path)
  );
  const handlePathChange = useCallback(
    ({ path }) => {
      setMatched(match(pattern)(path));
    },
    [pattern]
  );
  useEffect(() => {
    handlePathChange(getCurrentRoute());
  }, [pattern]);
  useEffect(() => {
    pathWatcher.add(handlePathChange);
    return () => {
      pathWatcher.cancel(handlePathChange);
    };
  }, []);
  return matched as MatchType | false;
}

window.addEventListener("popstate", function () {
  pathWatcher.update({
    path: window.location.pathname,
    matched: [],
  });
});
