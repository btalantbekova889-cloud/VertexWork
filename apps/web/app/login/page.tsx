"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { LoginResponse } from "@/lib/types";

type LoginEnvelope = {
  success: boolean;
  data?: LoginResponse;
  error?: string;
};

export default function LoginPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"credentials" | "totp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await api.post<LoginEnvelope>("/auth/login", {
        email,
        password,
        totpCode: step === "totp" ? totpCode : undefined,
      });

      if (!result.success || !result.data) {
        setError(result.error ?? "Не удалось войти. Проверьте данные.");
        return;
      }

      if (result.data.requiresTwoFactor) {
        setStep("totp");
        return;
      }

      setUser({
        userId: result.data.userId,
        email: result.data.email,
        fullName: result.data.fullName,
        role: result.data.role,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Сервер недоступен. Попробуйте позже.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Vertex Work</h1>
          <p>ERP · CRM · WMS</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === "credentials" ? (
            <>
              <div className="field">
                <label htmlFor="email">Электронная почта</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Пароль</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="field">
              <label htmlFor="totp">Код из приложения-аутентификатора</label>
              <input
                id="totp"
                type="text"
                inputMode="numeric"
                className="input"
                autoComplete="one-time-code"
                placeholder="000000"
                required
                autoFocus
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
              />
              <span className="field-hint">Вход выполняется для {email}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
            {submitting ? "Проверка…" : step === "totp" ? "Подтвердить" : "Войти"}
          </button>

          {step === "totp" && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => {
                setStep("credentials");
                setTotpCode("");
              }}
            >
              Назад
            </button>
          )}
        </form>

        <div className="login-demo">
          <strong>Демо-доступ:</strong> director@vertex.ru, sales@vertex.ru, finance@vertex.ru,
          dispatch@vertex.ru, weigher@vertex.ru, quarry@vertex.ru — пароль Vertex2026!
        </div>
      </div>
    </div>
  );
}
