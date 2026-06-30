"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { AppRoles, OrderStatusNameLabels, type ApiResult, type DashboardSummaryDto, type OrderPipelineItemDto } from "@/lib/types";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const canSeeSummary = user?.role === AppRoles.GeneralDirector || user?.role === AppRoles.CommercialDirector;

  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [pipeline, setPipeline] = useState<OrderPipelineItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const requests: Promise<void>[] = [
          api.get<ApiResult<OrderPipelineItemDto[]>>("/dashboard/pipeline").then((res) => {
            if (!cancelled && res.success && res.data) setPipeline(res.data);
          }),
        ];
        if (canSeeSummary) {
          requests.push(
            api.get<ApiResult<DashboardSummaryDto>>("/dashboard/summary").then((res) => {
              if (!cancelled && res.success && res.data) setSummary(res.data);
            }),
          );
        }
        await Promise.all(requests);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Не удалось загрузить данные.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [canSeeSummary]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Сводка</h1>
          <p className="page-subtitle">Ключевые показатели и текущий пайплайн заказов</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {summary && (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Выручка</div>
            <div className="kpi-value">{formatMoney(summary.totalRevenue)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Расходы</div>
            <div className="kpi-value">{formatMoney(summary.totalExpenses)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Чистая прибыль</div>
            <div className="kpi-value kpi-value--accent">{formatMoney(summary.netProfit)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Маржинальность</div>
            <div className="kpi-value">{formatNumber(summary.marginPercent)}%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Активные заказы</div>
            <div className="kpi-value">{summary.activeOrders}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">В пути</div>
            <div className="kpi-value">{summary.ordersInTransit}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Свободный транспорт</div>
            <div className="kpi-value">{summary.availableVehicles}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Остаток на складе</div>
            <div className="kpi-value">{formatNumber(summary.totalStockTons)} т</div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Пайплайн заказов</h2>
          <Link href="/orders" className="btn btn-secondary btn-sm">
            Все заказы
          </Link>
        </div>
        <div className="card-body--flush">
          {loading ? (
            <div className="loading-state">Загрузка…</div>
          ) : pipeline.length === 0 ? (
            <div className="empty-state">Нет активных заказов в пайплайне.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Клиент</th>
                    <th>Материал</th>
                    <th className="numeric">Объём, т</th>
                    <th>Статус</th>
                    <th>Создан</th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.map((item) => (
                    <tr key={item.orderId}>
                      <td>{item.clientName}</td>
                      <td>{item.materialType}</td>
                      <td className="numeric">{formatNumber(item.quantityOrdered)}</td>
                      <td>
                        <span className="badge badge-info">{OrderStatusNameLabels[item.status] ?? item.status}</span>
                      </td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
