"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/Modal";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatMoney, formatNumber } from "@/lib/format";
import {
  AppRoles,
  OrderStatus,
  OrderStatusLabels,
  type ApiResult,
  type ClientDto,
  type CreateOrderRequest,
  type OrderDto,
  type PaginatedList,
  type VehicleDto,
} from "@/lib/types";

const PAGE_SIZE = 20;

type ModalActionKind = "finance" | "dispatch" | "quarry" | "weigh" | "close";
type SimpleActionKind = "transit" | "delivered";
type ActionKind = ModalActionKind | SimpleActionKind;

export default function OrdersPage() {
  const { user } = useAuth();
  const role = user?.role;

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [action, setAction] = useState<{ kind: ModalActionKind; order: OrderDto } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (statusFilter !== null) query.set("status", String(statusFilter));
      const res = await api.get<ApiResult<PaginatedList<OrderDto>>>(`/orders?${query.toString()}`);
      if (res.success && res.data) {
        setOrders(res.data.items);
        setTotalPages(Math.max(1, res.data.totalPages));
      } else {
        setError(res.error ?? "Не удалось загрузить заказы.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить заказы.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  function availableActions(order: OrderDto): { kind: ActionKind; label: string }[] {
    const actions: { kind: ActionKind; label: string }[] = [];
    if (order.status === OrderStatus.New && role === AppRoles.Accountant) {
      actions.push({ kind: "finance", label: "Финансовое согласование" });
    }
    if (order.status === OrderStatus.Paid && role === AppRoles.Dispatcher) {
      actions.push({ kind: "dispatch", label: "Назначить транспорт" });
    }
    if (order.status === OrderStatus.InProduction && role === AppRoles.QuarryChief) {
      actions.push({ kind: "quarry", label: "Подтвердить на карьере" });
    }
    if (order.status === OrderStatus.InProduction && role === AppRoles.Weigher) {
      actions.push({ kind: "weigh", label: "Взвесить" });
    }
    if (order.status === OrderStatus.AtScale && (role === AppRoles.Dispatcher || role === AppRoles.Driver)) {
      actions.push({ kind: "transit", label: "Отправить в путь" });
    }
    if (order.status === OrderStatus.InTransit && (role === AppRoles.Dispatcher || role === AppRoles.Driver)) {
      actions.push({ kind: "delivered", label: "Отметить доставку" });
    }
    if (order.status === OrderStatus.Delivered && role === AppRoles.Accountant) {
      actions.push({ kind: "close", label: "Закрыть заказ" });
    }
    return actions;
  }

  async function runSimpleAction(order: OrderDto, kind: SimpleActionKind) {
    setError(null);
    try {
      const path = kind === "transit" ? `/orders/${order.id}/start-transit` : `/orders/${order.id}/delivered`;
      const res = await api.post<ApiResult<OrderDto>>(path);
      if (!res.success) {
        setError(res.error ?? "Не удалось выполнить действие.");
        return;
      }
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить действие.");
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Заказы</h1>
          <p className="page-subtitle">Сквозной пайплайн от продажи до закрытия</p>
        </div>
        {role === AppRoles.SalesManager && (
          <button type="button" className="btn btn-accent" onClick={() => setCreateOpen(true)}>
            Новый заказ
          </button>
        )}
      </div>

      <div className="toolbar" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`filter-pill${statusFilter === null ? " active" : ""}`}
          onClick={() => {
            setStatusFilter(null);
            setPage(1);
          }}
        >
          Все
        </button>
        {Object.entries(OrderStatusLabels).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`filter-pill${statusFilter === Number(value) ? " active" : ""}`}
            onClick={() => {
              setStatusFilter(Number(value));
              setPage(1);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">Заказы не найдены.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Клиент</th>
                    <th>Материал</th>
                    <th className="numeric">Объём, т</th>
                    <th className="numeric">Сумма</th>
                    <th>Статус</th>
                    <th>Транспорт</th>
                    <th>Создан</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const actions = availableActions(order);
                    return (
                      <tr key={order.id}>
                        <td>{order.clientName}</td>
                        <td>{order.materialType}</td>
                        <td className="numeric">{formatNumber(order.quantityOrdered)}</td>
                        <td className="numeric">{formatMoney(order.totalSum)}</td>
                        <td>
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="text-muted">{order.assignedVehiclePlate ?? "—"}</td>
                        <td className="text-muted">{formatDateTime(order.createdAt)}</td>
                        <td className="text-right">
                          {actions.map((a) => {
                            const kind = a.kind;
                            const onClick =
                              kind === "transit" || kind === "delivered"
                                ? () => runSimpleAction(order, kind)
                                : () => setAction({ kind, order });
                            return (
                              <button
                                key={kind}
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ marginLeft: 6 }}
                                onClick={onClick}
                              >
                                {a.label}
                              </button>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
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
        <CreateOrderModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            load();
          }}
        />
      )}

      {action && (
        <OrderActionModal
          kind={action.kind}
          order={action.order}
          onClose={() => setAction(null)}
          onDone={() => {
            setAction(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function CreateOrderModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [clientId, setClientId] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [quantityOrdered, setQuantityOrdered] = useState("");
  const [pricePerTon, setPricePerTon] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<ApiResult<PaginatedList<ClientDto>>>("/clients?page=1&pageSize=100")
      .then((res) => {
        if (res.success && res.data) setClients(res.data.items);
      })
      .catch(() => setError("Не удалось загрузить список клиентов."));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const body: CreateOrderRequest = {
        clientId,
        materialType,
        quantityOrdered: Number(quantityOrdered),
        pricePerTon: Number(pricePerTon),
        deliveryAddress,
        notes: notes || null,
      };
      const res = await api.post<ApiResult<OrderDto>>("/orders", body);
      if (!res.success) {
        setError(res.error ?? "Не удалось создать заказ.");
        return;
      }
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось создать заказ.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Новый заказ" onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="clientId">Клиент</label>
          <select id="clientId" className="select" required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="" disabled>
              Выберите клиента
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="materialType">Материал</label>
          <input
            id="materialType"
            className="input"
            required
            placeholder="Щебень фракции 20-40"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="quantityOrdered">Объём, т</label>
            <input
              id="quantityOrdered"
              type="number"
              min={0}
              step="0.01"
              className="input"
              required
              value={quantityOrdered}
              onChange={(e) => setQuantityOrdered(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="pricePerTon">Цена за тонну, ₽</label>
            <input
              id="pricePerTon"
              type="number"
              min={0}
              step="0.01"
              className="input"
              required
              value={pricePerTon}
              onChange={(e) => setPricePerTon(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="deliveryAddress">Адрес доставки</label>
          <input
            id="deliveryAddress"
            className="input"
            required
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="notes">Примечание</label>
          <textarea id="notes" className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Создание…" : "Создать заказ"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function OrderActionModal({
  kind,
  order,
  onClose,
  onDone,
}: {
  kind: ModalActionKind;
  order: OrderDto;
  onClose: () => void;
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // finance
  const [approved, setApproved] = useState(true);
  const [comment, setComment] = useState("");

  // dispatch
  const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
  const [vehicleId, setVehicleId] = useState("");

  // weigh
  const [weightIn, setWeightIn] = useState("");
  const [weightOut, setWeightOut] = useState("");

  // close
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    if (kind === "dispatch") {
      api
        .get<ApiResult<PaginatedList<VehicleDto>>>("/vehicles?page=1&pageSize=100")
        .then((res) => {
          if (res.success && res.data) setVehicles(res.data.items.filter((v) => v.status === 0));
        })
        .catch(() => setError("Не удалось загрузить список транспорта."));
    }
  }, [kind]);

  const titles: Record<ModalActionKind, string> = {
    finance: "Финансовое согласование",
    dispatch: "Назначение транспорта",
    quarry: "Подтверждение на карьере",
    weigh: "Взвешивание",
    close: "Закрытие заказа",
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      let res: ApiResult<OrderDto> | undefined;
      switch (kind) {
        case "finance":
          res = await api.post<ApiResult<OrderDto>>(`/orders/${order.id}/finance-approval`, {
            approved,
            comment: comment || null,
          });
          break;
        case "dispatch":
          res = await api.post<ApiResult<OrderDto>>(`/orders/${order.id}/dispatch`, {
            vehicleId,
            driverId: null,
          });
          break;
        case "quarry":
          res = await api.post<ApiResult<OrderDto>>(`/orders/${order.id}/quarry-confirm`, {
            materialAvailable: true,
            comment: comment || null,
          });
          break;
        case "weigh":
          res = await api.post<ApiResult<OrderDto>>(`/orders/${order.id}/weigh`, {
            weightIn: Number(weightIn),
            weightOut: Number(weightOut),
            vehicleId: null,
            driverId: null,
          });
          break;
        case "close":
          res = await api.post<ApiResult<OrderDto>>(`/orders/${order.id}/close`, {
            paymentReference: paymentReference || null,
          });
          break;
      }
      if (!res || !res.success) {
        setError(res?.error ?? "Не удалось выполнить действие.");
        return;
      }
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось выполнить действие.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={titles[kind]} onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <p className="text-muted" style={{ marginTop: 0, marginBottom: 18, fontSize: 13 }}>
        Заказ: {order.clientName} · {order.materialType} · {formatNumber(order.quantityOrdered)} т
      </p>
      <form onSubmit={handleSubmit}>
        {kind === "finance" && (
          <>
            <div className="field">
              <label htmlFor="approved">Решение</label>
              <select
                id="approved"
                className="select"
                value={approved ? "yes" : "no"}
                onChange={(e) => setApproved(e.target.value === "yes")}
              >
                <option value="yes">Одобрить</option>
                <option value="no">Отклонить</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="comment">Комментарий</label>
              <textarea id="comment" className="textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
          </>
        )}

        {kind === "dispatch" && (
          <div className="field">
            <label htmlFor="vehicleId">Транспорт</label>
            <select id="vehicleId" className="select" required value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
              <option value="" disabled>
                Выберите транспорт
              </option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} — {v.model} ({formatNumber(v.capacity)} т)
                </option>
              ))}
            </select>
            {vehicles.length === 0 && <span className="field-hint">Нет свободного транспорта.</span>}
          </div>
        )}

        {kind === "quarry" && (
          <div className="field">
            <label htmlFor="comment">Комментарий</label>
            <textarea
              id="comment"
              className="textarea"
              placeholder="Материал проверен и готов к отгрузке"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        )}

        {kind === "weigh" && (
          <div className="field-row">
            <div className="field">
              <label htmlFor="weightIn">Вес тары, т</label>
              <input
                id="weightIn"
                type="number"
                min={0}
                step="0.01"
                className="input"
                required
                value={weightIn}
                onChange={(e) => setWeightIn(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="weightOut">Вес брутто, т</label>
              <input
                id="weightOut"
                type="number"
                min={0}
                step="0.01"
                className="input"
                required
                value={weightOut}
                onChange={(e) => setWeightOut(e.target.value)}
              />
            </div>
          </div>
        )}

        {kind === "close" && (
          <div className="field">
            <label htmlFor="paymentReference">Номер платёжного документа</label>
            <input
              id="paymentReference"
              className="input"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
            />
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Сохранение…" : "Подтвердить"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
