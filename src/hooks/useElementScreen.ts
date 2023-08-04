import { useEffect, useMemo, useState } from "react";

type OptionsTypes = {
  root?: any,
  rootMargin: string,
  threshold: number,
}

export const useElementScreen = (options: OptionsTypes, targetRef: any) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const callbackFunction = (entries: any) => {
    const [entry] = entries; //const entry = entries[0]
    setIsVisible(entry.isIntersecting);
  };
  const optionsMemo = useMemo(() => {
    return options;
  }, [options]);
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, optionsMemo);
    const currentTarget = targetRef.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [targetRef, optionsMemo]);
  return isVisible;
};