'use client';
import { ReactNode } from 'react';
import '@/styles/AuthPokedex.css';



/* ── Composant layout partagé ── */
export function AuthDexForm({ title, subtitle, error, children }: {
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="auth-dex-layout">
        {/* Panneau gauche */}
        <div className="authdex-side authdex-side-left"><div className="half-circle" /></div>

        {/* Centre */}
        <div className="authdex-col">
          <div className="authdex-band" />
          <div className="authdex-bar authdex-bar-top" />

          <div className="authdex-screen">
            <div className="form-card">
              <div className="form-pokeball" />
              <div className="form-title">{title}</div>
              <div className="form-subtitle">{subtitle}</div>
              {children}
              {error && <div className="form-error">⚠ {error}</div>}
            </div>
          </div>

          <div className="authdex-bar authdex-bar-bottom" />
          <div className="authdex-band" />
        </div>

        {/* Panneau droit */}
        <div className="authdex-side authdex-side-right"><div className="half-circle" /></div>
      </div>
    </>
  );
}

/* ── Input stylisé ── */

export function AuthDexInput({ type, placeholder, value, onChange }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="authdex-input-wrap">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="authdex-input"
      />
    </div>
  );
}

/* ── Bouton stylisé ── */
export function AuthDexButton({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading} className="authdex-btn-submit">
      {loading ? '...' : children}
    </button>
  );
}
