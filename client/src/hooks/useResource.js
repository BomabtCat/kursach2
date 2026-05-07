import { useCallback, useEffect, useMemo, useState } from "react";
import { resourceService } from "../services/resourceService";

export default function useResource(resource, initialQuery = {}) {
  const service = useMemo(() => resourceService(resource), [resource]);
  const [query, setQuery] = useState({ page: 1, limit: 8, sortBy: "createdAt", sortOrder: "desc", ...initialQuery });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await service.list(query));
    } catch (err) {
      setError(err.response?.data?.error?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [service, query]);

  useEffect(() => {
    load();
  }, [load]);

  return { service, query, setQuery, data, loading, error, reload: load };
}
