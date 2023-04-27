import { useState, useEffect, useMemo, RefObject } from 'react'
type Options = {
  rootMargin: string,
  threshold: number,
}
export const useOnScreen = <T extends Element>(options: Options, targetRef: RefObject<T> | null) => {
  const [isVisibile, setIsVisible] = useState(false);
  const callbackFunction = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };
  const optionsMemo = useMemo(() => {
    return options;
  }, [options]);
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo);
    const currentTarget = targetRef?.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [targetRef, optionsMemo]);
  return isVisibile;
};