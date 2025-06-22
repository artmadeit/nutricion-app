import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useQueryState = (paramName: string, { defaultValue }: { defaultValue: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from query params, fallback to defaults
  const param = searchParams.get(paramName) || defaultValue;

  const setParam = React.useCallback(
    (model: { param: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, String(model.param));
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return [param, setParam];
};
