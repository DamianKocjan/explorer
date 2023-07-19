import { useRef } from "react";

export function useLoading() {
  const loading = useRef(false);

  const startLoading = () => {
    loading.current = true;
  };

  const stopLoading = () => {
    loading.current = false;
  };

  return { isLoading: loading.current, start: startLoading, stop: stopLoading };
}
