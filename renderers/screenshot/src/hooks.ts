import { MutableRefObject, useCallback, useRef, useState } from "react";

export const useRefState = <T>(initialState: T) => {
  const stateRef = useRef(initialState);
  const [state, _setState] = useState(initialState);

  const setState = useCallback((state: T) => {
    stateRef.current = state;
    _setState(stateRef.current);
  }, []);

  return [state, stateRef, setState] as [
    T,
    MutableRefObject<T>,
    typeof setState
  ];
};
