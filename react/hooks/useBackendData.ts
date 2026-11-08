import { useEffect, useState } from "react";

export type BackendDataStatus =
  "loading" | "ready" | "empty" | "error" | "idle";

interface UseBackendDataOptions {
  enabled?: boolean;
}

export interface UseBackendDataResult<T> {
  data: T | null;
  status: BackendDataStatus;
  error: string | null;
  reload: () => void;
}

type BackendLoader<T> = (signal: AbortSignal) => Promise<T>;

function hideLoadingOverlay(): void {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) overlay.classList.add("hidden");
}

//Exercise 6 - Demo 8: this hook owns the shared asynchronous lifecycle,
//including loading, errors, cleanup, cancellation, and stale-result guards.
export function useBackendData<T>(
  loader: BackendLoader<T>,
  options: UseBackendDataOptions = {},
): UseBackendDataResult<T> {
  const enabled = options.enabled ?? true;
  const [reloadVersion, setReloadVersion] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<BackendDataStatus>(
    enabled ? "loading" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }

    let isCurrent = true;
    const controller = new AbortController();

    //Exercise 6 - Demo 10: this status controls the loading/error/empty UX
    //that the component presents while the Promise changes state.
    setStatus("loading");
    setError(null);

    loader(controller.signal)
      .then((nextData) => {
        if (isCurrent) {
          setData(nextData);
          setStatus(
            Array.isArray(nextData) && nextData.length === 0
              ? "empty"
              : "ready",
          );
        }
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") {
          return;
        }

        if (isCurrent) {
          setError(
            reason instanceof Error ? reason.message : "Unknown loading error",
          );
          setStatus("error");
        }
      })
      .finally(() => {
        if (isCurrent) hideLoadingOverlay();
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [enabled, loader, reloadVersion]);

  function reload(): void {
    setReloadVersion((version) => version + 1);
  }

  return { data, status, error, reload };
}
