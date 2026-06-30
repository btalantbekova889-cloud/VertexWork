"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Modal } from "@/components/Modal";
import { formatMoney } from "@/lib/format";
import {
  AppRoles,
  type ApiResult,
  type ClientDto,
  type CreateClientRequest,
  type PaginatedList,
  type UpdateClientRequest,
} from "@/lib/types";

const PAGE_SIZE = 20;

export default function ClientsPage() {
  const { user } = useAuth();
  const canManage = user?.role === AppRoles.SalesManager || user?.role === AppRoles.CommercialDirector;

  const [clients, setClients] = useState<ClientDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientDto | null>(null);

  async function load(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResult<PaginatedList<ClientDto>>>(`/clients?page=${targetPage}&pageSize=${PAGE_SIZE}`);
      if (res.success && res.data) {
        setClients(res.data.items);
        setTotalPages(Math.max(1, res.data.totalPages));
      } else {
        setError(res.error ?? "Не удалось загрузить клиентов.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Не удалось загрузить клиентов.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(client: ClientDto) {
    setEditing(client);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    load(page);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Клиенты</h1>
          <p className="page-subtitle">Карточки контрагентов, лимиты и баланс взаиморасчётов</p>
        </div>
        {canManage && (
          <button type="button" className="btn btn-accent" onClick={openCreate}>
            Добавить клиента
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : clients.length === 0 ? (
            <div className="empty-state">Клиенты не найдены.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Компания</th>
                    <th>ИНН</th>
                    <th>Контакты</th>
                    <th>Менеджер</th>
                    <th className="numeric">Баланс</th>
                    <th className="numeric">Лимит</th>
                    {canManage && <th />}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.companyName}</td>
                      <td>{client.inn}</td>
                      <td className="text-muted">
                        {client.phone ?? "—"}
                        {client.email ? ` · ${client.email}` : ""}
                      </td>
                      <td>{client.managerName ?? "—"}</td>
                      <td className="numeric">{formatMoney(client.balance)}</td>
                      <td className="numeric">{formatMoney(client.creditLimit)}</td>
                      {canManage && (
                        <td className="text-right">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(client)}>
                            Изменить
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

      {modalOpen && (
        <ClientFormModal client={editing} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}

function ClientFormModal({
  client,
  onClose,
  onSaved,
}: {
  client: ClientDto | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [companyName, setCompanyName] = useState(client?.companyName ?? "");
  const [inn, setInn] = useState(client?.inn ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [email, setEmail] = useState(client?.email ?? "");
  const [creditLimit, setCreditLimit] = useState(client ? String(client.creditLimit) : "0");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (client) {
        const body: UpdateClientRequest = {
          companyName,
          phone: phone || null,
          email: email || null,
          creditLimit: Number(creditLimit),
        };
        const res = await api.put<ApiResult<ClientDto>>(`/clients/${client.id}`, body);
        if (!res.success) {
          setError(res.error ?? "Не удалось сохранить изменения.");
          return;
        }
      } else {
        const body: CreateClientRequest = {
          companyName,
          inn,
          phone: phone || null,
          email: email || null,
          creditLimit: Number(creditLimit),
        };
        const res = await api.post<ApiResult<ClientDto>>("/clients", body);
        if (!res.success) {
          setError(res.error ?? "Не удалось создать клиента.");
          return;
        }
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Произошла ошибка. Попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal title={client ? "Изменить клиента" : "Новый клиент"} onClose={onClose}>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="companyName">Название компании</label>
          <input
            id="companyName"
            className="input"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="inn">ИНН</label>
          <input
            id="inn"
            className="input"
            required
            disabled={!!client}
            value={inn}
            onChange={(e) => setInn(e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="phone">Телефон</label>
            <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="creditLimit">Кредитный лимит, ₽</label>
          <input
            id="creditLimit"
            type="number"
            min={0}
            step="0.01"
            className="input"
            required
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
          />
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
