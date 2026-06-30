"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { ApiResult, AuditLogDto, PaginatedList } from "@/lib/types";

const PAGE_SIZE = 50;

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<ApiResult<PaginatedList<AuditLogDto>>>(`/audit?page=${page}&pageSize=${PAGE_SIZE}`);
        if (cancelled) return;
        if (res.success && res.data) {
          setLogs(res.data.items);
          setTotalPages(Math.max(1, res.data.totalPages));
        } else {
          setError(res.error ?? "Не удалось загрузить журнал аудита.");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Не удалось загрузить журнал аудита.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Журнал аудита</h1>
          <p className="page-subtitle">Неизменяемый журнал действий пользователей системы</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : logs.length === 0 ? (
            <div className="empty-state">Записи отсутствуют.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Время</th>
                    <th>Пользователь</th>
                    <th>Действие</th>
                    <th>Объект</th>
                    <th>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="text-muted">{formatDateTime(log.timestamp)}</td>
                      <td>{log.userName ?? "Система"}</td>
                      <td>
                        <span className="badge badge-neutral">{log.action}</span>
                      </td>
                      <td className="text-muted">
                        {log.entityName}
                        {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                      </td>
                      <td className="text-muted">{log.ipAddress ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="toolbar" style={{ marginTop: 16, justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Назад
          </button>
          <span className="text-muted" style={{ fontSize: 13 }}>
            Стр. {page} из {totalPages}
          </span>
          <button type="button" className="btn btn-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Далее
          </button>
        </div>
      )}
    </div>
  );
}
