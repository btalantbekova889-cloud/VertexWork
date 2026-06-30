"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/Modal";
import { formatNumber } from "@/lib/format";
import { AppRoles, type ApiResult, type WarehouseStockDto } from "@/lib/types";

export default function WarehousePage() {
  const { user } = useAuth();
  const canAdjust = user?.role === AppRoles.Storekeeper;

  const [stock, setStock] = useState<WarehouseStockDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<WarehouseStockDto | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResult<WarehouseStockDto[]>>("/warehouse/stock");
      if (res.success && res.data) {
        setStock(res.data);
      } else {
        setError(res.error ?? "Не удалось загрузить остатки склада.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить остатки склада.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Склад</h1>
          <p className="page-subtitle">Остатки материалов по участкам</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : stock.length === 0 ? (
            <div className="empty-state">Данные по складу отсутствуют.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Участок</th>
                    <th>Материал</th>
                    <th className="numeric">Остаток, т</th>
                    <th className="numeric">Резерв, т</th>
                    <th className="numeric">Доступно, т</th>
                    {canAdjust && <th />}
                  </tr>
                </thead>
                <tbody>
                  {stock.map((s) => (
                    <tr key={s.id}>
                      <td>{s.siteName}</td>
                      <td>{s.materialType}</td>
                      <td className="numeric">{formatNumber(s.quantityTons)}</td>
                      <td className="numeric text-muted">{formatNumber(s.reservedTons)}</td>
                      <td className="numeric">{formatNumber(s.availableTons)}</td>
                      {canAdjust && (
                        <td className="text-right">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAdjustTarget(s)}>
                            Корректировка
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {adjustTarget && (
        <AdjustStockModal
          stock={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onAdjusted={() => {
            setAdjustTarget(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function AdjustStockModal({
  stock,
  onClose,
  onAdjusted,
}: {
  stock: WarehouseStockDto;
  onClose: () => void;
  onAdjusted: () => void;
}) {
  const [quantityDelta, setQuantityDelta] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post<ApiResult<WarehouseStockDto>>(`/warehouse/stock/${stock.id}/adjust`, {
        quantityDelta: Number(quantityDelta),
        reason,
      });
      if (!res.success) {
        setError(res.error ?? "Не удалось выполнить корректировку.");
        return;
      }
      onAdjusted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить корректировку.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Корректировка: ${stock.siteName} · ${stock.materialType}`} onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="quantityDelta">Изменение, т (положительное или отрицательное)</label>
          <input
            id="quantityDelta"
            type="number"
            step="0.01"
            className="input"
            required
            value={quantityDelta}
            onChange={(e) => setQuantityDelta(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="reason">Причина</label>
          <textarea id="reason" className="textarea" required value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Сохранение…" : "Применить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
