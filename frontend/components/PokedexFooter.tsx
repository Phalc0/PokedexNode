import { Trainer } from '@/types/trainer';

interface Props {
  trainer: Trainer;
  totalCount: number | undefined;
}

export default function PokedexFooter({ trainer, totalCount }: Props) {
  return (
    <div className="screen-footer">
      <StatItem label="Vus" value={trainer.pkmnSeen.length} />
      <div className="footer-divider" />
      <StatItem label="Capturés" value={trainer.pkmnCaught.length} />
      <div className="footer-divider" />
      <StatItem label="Total" value={totalCount ?? '—'} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="footer-stat">
      <div className="footer-stat-num">{value}</div>
      <div className="footer-stat-label">{label}</div>
    </div>
  );
}