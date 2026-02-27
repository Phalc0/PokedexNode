'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getTrainerByUsername } from '@/services/api';
import { Trainer } from '@/types/trainer';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth(); // adapte selon ton useAuth

  const { data: trainer, isLoading } = useQuery<Trainer>({
    queryKey: ['trainer', user?.username],
    queryFn: () => getTrainerByUsername(user!.username),
    enabled: !!user?.username,
  });

  const handleLogout = async () => {
    try {
      await logout?.();
    } catch (_) {}
    localStorage.removeItem('user');
    router.push('/');
  };

  if (isLoading) return <Loader />;

  const caught  = trainer?.pkmnCaught?.length ?? 0;
  const seen    = trainer?.pkmnSeen?.length ?? 0;
  const total   = 1025; // ou récupère allData.count si tu veux le dynamique
  const pctCaught = Math.round((caught / total) * 100);
  const pctSeen   = Math.round((seen   / total) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }

        .dex-layout { min-height:100vh; display:flex; align-items:stretch; background:#1a0a0a; overflow:hidden; font-family:'Exo 2',sans-serif; }

        /* ── Panneaux rouges ── */
        .dex-side { width:80px; flex-shrink:0; background:linear-gradient(160deg,#d03e4f 0%,#c30d23 55%,#8a0818 100%); position:relative; overflow:hidden; }
        .dex-side-left  { border-radius:28px 0 0 28px; box-shadow:inset -3px 0 8px rgba(0,0,0,0.35),4px 0 20px rgba(0,0,0,0.4); }
        .dex-side-right { border-radius:0 28px 28px 0; box-shadow:inset 3px 0 8px rgba(0,0,0,0.35),-4px 0 20px rgba(0,0,0,0.4); }
        .dex-side::before {
          content:''; position:absolute; inset:-10px;
          background:
            radial-gradient(circle 65px at -10px -10px,transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at -10px -10px,transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at calc(100% + 10px) -10px,transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at calc(100% + 10px) -10px,transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at -10px calc(100% + 10px),transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at -10px calc(100% + 10px),transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at calc(100% + 10px) calc(100% + 10px),transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at calc(100% + 10px) calc(100% + 10px),transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%);
          pointer-events:none;
        }
        .dex-side::after { content:''; position:absolute; top:0;left:0;right:0;height:38%; background:linear-gradient(180deg,rgba(255,255,255,0.10) 0%,transparent 100%); pointer-events:none; }
        .dex-side-left .half-circle  { position:absolute; top:50%; right:-3px; transform:translateY(-50%); width:54px; height:110px; background:linear-gradient(90deg,#2a2624,#1e1a18); border-radius:110px 0 0 110px; border:3px solid #1a1614; border-right:none; z-index:2; box-shadow:inset -8px 0 18px rgba(0,0,0,0.7); }
        .dex-side-right .half-circle { position:absolute; top:50%; left:-3px;  transform:translateY(-50%); width:54px; height:110px; background:linear-gradient(270deg,#2a2624,#1e1a18); border-radius:0 110px 110px 0; border:3px solid #1a1614; border-left:none;  z-index:2; box-shadow:inset 8px 0 18px rgba(0,0,0,0.7); }

        .dex-col { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
        .dex-band { height:16px; flex-shrink:0; background:linear-gradient(90deg,rgba(157,228,244,0.15) 0%,#9ce9f6 20%,#c8f5ff 50%,#9ce9f6 80%,rgba(157,228,244,0.15) 100%); border-top:1px solid rgba(255,255,255,0.5); border-bottom:1px solid rgba(200,245,255,0.4); box-shadow:0 0 20px rgba(157,228,244,0.4),0 2px 8px rgba(0,0,0,0.3); position:relative; z-index:5; }
        .dex-bar { height:24px; flex-shrink:0; background:#2f2b2a; position:relative; z-index:4; }
        .dex-bar-top    { border-radius:14px 14px 0 0; box-shadow:0 4px 12px rgba(0,0,0,0.5); }
        .dex-bar-bottom { border-radius:0 0 14px 14px; box-shadow:0 -4px 12px rgba(0,0,0,0.5); }

        /* ── Écran ── */
        .dex-screen { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative;
          background: radial-gradient(ellipse 80% 60% at 50% 10%,rgba(255,255,255,0.55) 0%,rgba(157,228,244,0.6) 30%,transparent 70%),
                      radial-gradient(ellipse 100% 100% at 50% 50%,#9de4f4 0%,#62c8e0 35%,#2a9ab8 65%,#0d5f7a 100%); }
        .dex-screen::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px); pointer-events:none; z-index:0; }

        /* ── Header ── */
        .profile-header { display:flex; align-items:center; gap:8px; padding:10px 14px 10px; border-bottom:1px solid rgba(0,80,100,0.2); background:rgba(255,255,255,0.1); backdrop-filter:blur(4px); position:relative; z-index:2; flex-shrink:0; }
        .back-btn { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.3); border:1.5px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:all 0.15s; flex-shrink:0; }
        .back-btn:hover { background:rgba(255,255,255,0.55); transform:translateX(-2px); }
        .header-title { font-size:13px; font-weight:900; color:#052838; letter-spacing:0.25em; text-transform:uppercase; text-shadow:0 1px 0 rgba(255,255,255,0.4); flex:1; text-align:center; }
        .header-spacer { width:30px; flex-shrink:0; }

        /* ── Body ── */
        .profile-body { flex:1; overflow-y:auto; position:relative; z-index:2; padding:16px 14px 16px; display:flex; flex-direction:column; gap:12px; }
        .profile-body::-webkit-scrollbar { width:3px; }
        .profile-body::-webkit-scrollbar-thumb { background:rgba(5,50,70,0.2); border-radius:3px; }

        /* ── Card générique ── */
        .glass-card { background:rgba(255,255,255,0.22); border:1px solid rgba(255,255,255,0.42); border-radius:16px; padding:16px; backdrop-filter:blur(8px); box-shadow:0 2px 12px rgba(0,80,100,0.1); }

        /* ── Avatar + identité ── */
        .identity-card { display:flex; align-items:center; gap:14px; }
        .avatar-ring { width:68px; height:68px; border-radius:50%; border:3px solid rgba(255,255,255,0.6); overflow:hidden; flex-shrink:0; box-shadow:0 4px 16px rgba(0,80,100,0.2); background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; }
        .avatar-img  { width:100%; height:100%; object-fit:cover; }
        .avatar-fallback { font-size:32px; }
        .identity-info { flex:1; min-width:0; }
        .identity-name  { font-size:17px; font-weight:900; color:#052838; text-shadow:0 1px 0 rgba(255,255,255,0.4); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px; }
        .identity-email { font-size:10px; font-weight:600; color:rgba(5,50,70,0.55); letter-spacing:0.05em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:6px; }
        .identity-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; background:rgba(195,13,35,0.15); border:1px solid rgba(195,13,35,0.3); border-radius:20px; font-size:9px; font-weight:800; color:#7a0a15; letter-spacing:0.1em; text-transform:uppercase; }

        /* ── Section label ── */
        .section-label { font-size:9px; font-weight:800; letter-spacing:0.2em; text-transform:uppercase; color:rgba(5,50,70,0.5); margin-bottom:8px; }

        /* ── Stats progression ── */
        .progress-row { margin-bottom:12px; }
        .progress-row:last-child { margin-bottom:0; }
        .progress-top { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
        .progress-name { font-size:11px; font-weight:800; color:#052838; }
        .progress-val  { font-size:11px; font-weight:900; color:#052838; }
        .progress-track { height:9px; background:rgba(0,50,70,0.12); border-radius:6px; overflow:hidden; }
        .progress-fill  { height:100%; border-radius:6px; transition:width 0.9s cubic-bezier(0.4,0,0.2,1); }

        /* ── Big stats ── */
        .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        .stat-box { background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.35); border-radius:12px; padding:10px 6px; text-align:center; }
        .stat-box-num   { font-size:22px; font-weight:900; color:#052838; line-height:1; text-shadow:0 1px 0 rgba(255,255,255,0.4); }
        .stat-box-label { font-size:8px; font-weight:700; color:rgba(5,50,70,0.55); letter-spacing:0.12em; text-transform:uppercase; margin-top:3px; }

        /* ── Médailles ── */
        .medals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
        .medal { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); border-radius:12px; padding:10px 6px; text-align:center; transition:all 0.2s; }
        .medal.unlocked { background:rgba(255,255,255,0.28); border-color:rgba(255,255,255,0.55); box-shadow:0 2px 10px rgba(0,80,100,0.12); }
        .medal.locked   { opacity:0.4; filter:grayscale(0.6); }
        .medal-icon  { font-size:24px; margin-bottom:4px; }
        .medal-name  { font-size:8px; font-weight:800; color:#052838; letter-spacing:0.05em; text-transform:uppercase; }
        .medal-desc  { font-size:7px; color:rgba(5,50,70,0.5); margin-top:1px; }

        /* ── Bouton déconnexion ── */
        .logout-btn { width:100%; padding:12px; background:rgba(195,13,35,0.15); border:1.5px solid rgba(195,13,35,0.35); border-radius:12px; font-family:'Exo 2',sans-serif; font-size:12px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; color:#7a0a15; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .logout-btn:hover { background:rgba(195,13,35,0.28); border-color:rgba(195,13,35,0.55); transform:translateY(-1px); }
        .logout-btn:active { transform:scale(0.97); }
      `}</style>

      <div className="dex-layout">
        <div className="dex-side dex-side-left"><div className="half-circle" /></div>

        <div className="dex-col">
          <div className="dex-band" />
          <div className="dex-bar dex-bar-top" />

          <div className="dex-screen">

            {/* Header */}
            <div className="profile-header">
              <button className="back-btn" onClick={() => router.back()}>←</button>
              <div className="header-title">Profil</div>
              <div className="header-spacer" />
            </div>

            <div className="profile-body">

              {/* ── Identité ── */}
              <div className="glass-card identity-card">
                <div className="avatar-ring">
                  {trainer?.imgUrl
                    ? <img src={trainer.imgUrl} alt="avatar" className="avatar-img" />
                    : <span className="avatar-fallback">🧢</span>
                  }
                </div>
                <div className="identity-info">
                  <div className="identity-name">{trainer?.trainerName ?? user?.username ?? '—'}</div>
                  <div className="identity-email">{user?.email ?? '—'}</div>
                  <div className="identity-badge">🎖 Dresseur</div>
                </div>
              </div>

              {/* ── Stats ── */}
              <div className="glass-card">
                <div className="section-label">Progression</div>
                <div className="stats-grid" style={{ marginBottom: 14 }}>
                  <div className="stat-box">
                    <div className="stat-box-num">{caught}</div>
                    <div className="stat-box-label">Capturés</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-num">{seen}</div>
                    <div className="stat-box-label">Vus</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-num">{total - caught}</div>
                    <div className="stat-box-label">Restants</div>
                  </div>
                </div>

                {/* Barre capturés */}
                <div className="progress-row">
                  <div className="progress-top">
                    <span className="progress-name">⚡ Capturés</span>
                    <span className="progress-val">{caught} / {total} — {pctCaught}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${pctCaught}%`, background:'linear-gradient(90deg,#22c55e,#16a34a)', boxShadow:'0 0 8px rgba(34,197,94,0.5)' }} />
                  </div>
                </div>

                {/* Barre vus */}
                <div className="progress-row">
                  <div className="progress-top">
                    <span className="progress-name">👁 Vus</span>
                    <span className="progress-val">{seen} / {total} — {pctSeen}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${pctSeen}%`, background:'linear-gradient(90deg,#3b82f6,#2563eb)', boxShadow:'0 0 8px rgba(59,130,246,0.5)' }} />
                  </div>
                </div>
              </div>

              {/* ── Médailles ── */}
              <div className="glass-card">
                <div className="section-label">Médailles</div>
                <div className="medals-grid">
                  {[
                    { icon:'🌱', name:'Débutant',  desc:'1 capturé',    unlocked: caught >= 1 },
                    { icon:'⚡', name:'Électrique', desc:'10 capturés',  unlocked: caught >= 10 },
                    { icon:'🔥', name:'Ardent',     desc:'50 capturés',  unlocked: caught >= 50 },
                    { icon:'💧', name:'Surfeur',    desc:'100 capturés', unlocked: caught >= 100 },
                    { icon:'🌙', name:'Nocturne',   desc:'200 capturés', unlocked: caught >= 200 },
                    { icon:'👑', name:'Champion',   desc:'Tous capturés',unlocked: caught >= total },
                  ].map(m => (
                    <div key={m.name} className={`medal ${m.unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="medal-icon">{m.icon}</div>
                      <div className="medal-name">{m.name}</div>
                      <div className="medal-desc">{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Déconnexion ── */}
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Se déconnecter
              </button>

            </div>
          </div>

          <div className="dex-bar dex-bar-bottom" />
          <div className="dex-band" />
        </div>

        <div className="dex-side dex-side-right"><div className="half-circle" /></div>
      </div>
    </>
  );
}

function Loader() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#1a0a0a', gap:16 }}>
      <div style={{ width:44, height:44, borderRadius:'50%', border:'3px solid rgba(157,228,244,0.2)', borderTopColor:'#9de4f4', animation:'spin 0.8s linear infinite' }} />
      <div style={{ color:'rgba(157,228,244,0.5)', fontSize:11, fontFamily:'monospace', letterSpacing:'0.2em' }}>CHARGEMENT...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
