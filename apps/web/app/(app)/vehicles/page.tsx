"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/Modal";
import { VehicleStatusBadge } from "@/components/StatusBadge";
import { formatNumber } from "@/lib/format";
import {
  AppRoles,
  VehicleStatusLabels,
  type ApiResult,
  type CreateVehicleRequest,
  type PaginatedList,
  type VehicleDto,
} from "@/lib/types";

const PAGE_SIZE = 20;

export default function VehiclesPage() {
  const { user } = useAuth();
  const canManage = user?.role === AppRoles.Dispatcher;

  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState<VehicleDto | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResult<PaginatedList<VehicleDto>>>(`/vehicles?page=${page}&pageSize=${PAGE_SIZE}`);
      if (res.success && res.data) {
        setVehicles(res.data.items);
        setTotalPages(Math.max(1, res.data.totalPages));
      } else {
        setError(res.error ?? "Не удалось загрузить транспорт.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить транспорт.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Транспорт</h1>
          <p className="page-subtitle">Парк собственных и привлечённых машин</p>
        </div>
        {canManage && (
          <button type="button" className="btn btn-accent" onClick={() => setCreateOpen(true)}>
            Добавить транспорт
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">Транспорт не найден.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Гос. номер</th>
                    <th>Модель</th>
                    <th className="numeric">Грузоподъёмность, т</th>
                    <th>Принадлежность</th>
                    <th>Статус</th>
                    {canManage && <th />}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td>{v.plateNumber}</td>
                      <td>{v.model}</td>
                      <td className="numeric">{formatNumber(v.capacity)}</td>
                      <td className="text-muted">{v.isOwned ? "Собственный" : "Привлечённый"}</td>
                      <td>
                        <VehicleStatusBadge status={v.status} />
                      </td>
                      {canManage && (
                        <td className="text-right">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatusTarget(v)}>
                            Изменить статус
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

      {createOpen && (
        <CreateVehicleModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            load();
          }}
        />
      )}

      {statusTarget && (
        <UpdateStatusModal
          vehicle={statusTarget}
          onClose={() => setStatusTarget(null)}
          onUpdated={() => {
            setStatusTarget(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateVehicleModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [gpsTrackerId, setGpsTrackerId] = useState("");
  const [isOwned, setIsOwned] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const body: CreateVehicleRequest = {
        plateNumber,
        model,
        capacity: Number(capacity),
        gpsTrackerId: gpsTrackerId || null,
        isOwned,
      };
      const res = await api.post<ApiResult<VehicleDto>>("/vehicles", body);
      if (!res.success) {
        setError(res.error ?? "Не удалось добавить транспорт.");
        return;
      }
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось добавить транспорт.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Новый транспорт" onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="plateNumber">Гос. номер</label>
            <input id="plateNumber" className="input" required value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="model">Модель</label>
            <input id="model" className="input" required value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="capacity">Грузоподъёмность, т</label>
            <input
              id="capacity"
              type="number"
              min={0}
              step="0.01"
              className="input"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="gpsTrackerId">GPS-трекер</label>
            <input id="gpsTrackerId" className="input" value={gpsTrackerId} onChange={(e) => setGpsTrackerId(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="isOwned">Принадлежность</label>
          <select id="isOwned" className="select" value={isOwned ? "owned" : "leased"} onChange={(e) => setIsOwned(e.target.value === "owned")}>
            <option value="owned">Собственный</option>
            <option value="leased">Привлечённый</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Сохранение…" : "Добавить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function UpdateStatusModal({
  vehicle,
  onClose,
  onUpdated,
}: {
  vehicle: VehicleDto;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [status, setStatus] = useState(vehicle.status);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.patch<ApiResult<VehicleDto>>(`/vehicles/${vehicle.id}/status`, { status });
      if (!res.success) {
        setError(res.error ?? "Не удалось обновить статус.");
        return;
      }
      onUpdated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось обновить статус.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={`Статус: ${vehicle.plateNumber}`} onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="status">Новый статус</label>
          <select id="status" className="select" value={status} onChange={(e) => setStatus(Number(e.target.value))}>
            {Object.entries(VehicleStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
