'use client';
import { ReactNode } from 'react';
import '@/styles/AuthPokedex.css';



/* ── Composant layout partagé ── */
export function DexFormLayout({ title, subtitle, error, children }: {
  title: string;
  subtitle: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="dex-auth-layout">
        {/* Panneau gauche */}
        <div className="dex-side dex-side-left"><div className="half-circle" /></div>

        {/* Centre */}
        <div className="dex-col">
          <div className="dex-band" />
          <div className="dex-bar dex-bar-top" />

          <div className="dex-screen">
            <div className="form-card">
              <div className="form-pokeball" />
              <div className="form-title">{title}</div>
              <div className="form-subtitle">{subtitle}</div>
              {children}
              {error && <div className="form-error">⚠ {error}</div>}
            </div>
          </div>

          <div className="dex-bar dex-bar-bottom" />
          <div className="dex-band" />
        </div>

        {/* Panneau droit */}
        <div className="dex-side dex-side-right"><div className="half-circle" /></div>
      </div>
    </>
  );
}

/* ── Input stylisé ── */
const ICONS: Record<string, string> = { email: '✉', password: '🔒', text: '👤' };

export function DexInput({ type, placeholder, value, onChange }: {
  type: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="dex-input-wrap">
      <span className="dex-input-icon">{ICONS[type] ?? '📝'}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="dex-input"
      />
    </div>
  );
}

/* ── Bouton stylisé ── */
export function DexButton({ children, loading }: { children: ReactNode; loading?: boolean }) {
  return (
    <button type="submit" disabled={loading} className="dex-btn">
      {loading ? '...' : children}
    </button>
  );
}
