import { STAT_LABELS } from '../utils/pkmnTypesColor';



interface Stat { name: string; value: number }
interface Region { regionName: string; regionPokedexNumber: number }


interface InfoProps {
  description?: string;
  height?: number;
  weight?: number;
  abilities?: string[];
  generation?: string;
  types?: string[];
  baseExp?: number;
}

export function TabInfo({ description, height, weight, abilities, generation, types, baseExp }: InfoProps) {
  return (
    <div className="info-card">
      {description && <p className="info-desc">"{description}"</p>}

      {height != null && <InfoRow label="Taille"      value={`${(height / 10).toFixed(1)} m`} />}
      {weight != null && <InfoRow label="Poids"       value={`${(weight / 10).toFixed(1)} kg`} />}
      {abilities?.length  && <InfoRow label="Talents"    value={abilities.join(', ')} />}
      {generation         && <InfoRow label="Génération" value={generation} />}
      {types?.length      && <InfoRow label="Types"      value={types.join(' · ')} />}
      {baseExp != null    && <InfoRow label="Exp. de base" value={String(baseExp)} />}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-val">{value}</span>
    </div>
  );
}



export function TabStats({ stats }: { stats?: Stat[] }) {
  if (!stats?.length) return <p className="empty-msg">Pas de stats disponibles</p>;

  return (
    <div className="info-card">
      {stats.map((s) => {
        const pct = Math.min((s.value / 255) * 100, 100);
        const color = pct > 66 ? '#22c55e' : pct > 33 ? '#f59e0b' : '#ef4444';
        return (
          <div key={s.name} className="stat-row">
            <span className="stat-label-sm">{STAT_LABELS[s.name] ?? s.name}</span>
            <span className="stat-val">{s.value}</span>
            <div className="stat-track">
              <div
                className="stat-fill"
                style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}80` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}


export function TabRegions({ regions }: { regions?: Region[] }) {
  if (!regions?.length) return <p className="empty-msg">Aucune région enregistrée</p>;

  return (
    <div className="info-card">
      <div className="regions-list">
        {regions.map((r) => (
          <div key={r.regionName} className="region-row">
            <span className="region-name">{r.regionName}</span>
            <span className="region-num">#{String(r.regionPokedexNumber).padStart(3, '0')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
