import { OrderStatusLabels, VehicleStatusLabels } from "@/lib/types";

const ORDER_TONE: Record<number, string> = {
  0: "badge-neutral",
  1: "badge-info",
  2: "badge-info",
  3: "badge-warning",
  4: "badge-warning",
  5: "badge-success",
  6: "badge-success",
  7: "badge-danger",
};

const VEHICLE_TONE: Record<number, string> = {
  0: "badge-success",
  1: "badge-info",
  2: "badge-warning",
};

export function OrderStatusBadge({ status }: { status: number }) {
  return <span className={`badge ${ORDER_TONE[status] ?? "badge-neutral"}`}>{OrderStatusLabels[status] ?? "—"}</span>;
}

export function VehicleStatusBadge({ status }: { status: number }) {
  return <span className={`badge ${VEHICLE_TONE[status] ?? "badge-neutral"}`}>{VehicleStatusLabels[status] ?? "—"}</span>;
}
