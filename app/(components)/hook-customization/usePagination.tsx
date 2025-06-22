import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const usePagination = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read from query params, fallback to defaults
  const page = parseInt(searchParams.get("page") || "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);

  const paginationModel = React.useMemo(() => ({ page, pageSize }), [page, pageSize]);

  const setPaginationModel = React.useCallback(
    (model: { page: number; pageSize: number }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(model.page));
      params.set("pageSize", String(model.pageSize));
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return { paginationModel, setPaginationModel };
};
