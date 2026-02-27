'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getPkmnById, getTrainerByUsername, markPkmn } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Trainer } from '@/types/trainer';
import { Pkmn } from '@/types/pkmn';
import { useEffect, useRef, useState } from 'react';

const TYPE_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  feu:       { bg: '#ff6b35', text: '#fff',    glow: 'rgba(255,107,53,0.6)' },
  eau:       { bg: '#4a9eff', text: '#fff',    glow: 'rgba(74,158,255,0.6)' },
  plante:    { bg: '#4caf50', text: '#fff',    glow: 'rgba(76,175,80,0.6)' },
  électrik:  { bg: '#ffd700', text: '#1a1a00', glow: 'rgba(255,215,0,0.7)' },
  psychique: { bg: '#e91e8c', text: '#fff',    glow: 'rgba(233,30,140,0.6)' },
  glace:     { bg: '#80deea', text: '#003',    glow: 'rgba(128,222,234,0.6)' },
  dragon:    { bg: '#7c4dff', text: '#fff',    glow: 'rgba(124,77,255,0.6)' },
  ténèbres:  { bg: '#424242', text: '#fff',    glow: 'rgba(66,66,66,0.7)' },
  combat:    { bg: '#c62828', text: '#fff',    glow: 'rgba(198,40,40,0.6)' },
  poison:    { bg: '#9c27b0', text: '#fff',    glow: 'rgba(156,39,176,0.6)' },
  sol:       { bg: '#a1887f', text: '#fff',    glow: 'rgba(161,136,127,0.6)' },
  vol:       { bg: '#90caf9', text: '#003',    glow: 'rgba(144,202,249,0.6)' },
  insecte:   { bg: '#8bc34a', text: '#fff',    glow: 'rgba(139,195,74,0.6)' },
  roche:     { bg: '#78909c', text: '#fff',    glow: 'rgba(120,144,156,0.6)' },
  spectre:   { bg: '#512da8', text: '#fff',    glow: 'rgba(81,45,168,0.6)' },
  acier:     { bg: '#90a4ae', text: '#fff',    glow: 'rgba(144,164,174,0.6)' },
  normal:    { bg: '#bdbdbd', text: '#333',    glow: 'rgba(189,189,189,0.5)' },
  fée:       { bg: '#f8bbd0', text: '#880e4f', glow: 'rgba(248,187,208,0.6)' },
  fire:      { bg: '#ff6b35', text: '#fff',    glow: 'rgba(255,107,53,0.6)' },
  water:     { bg: '#4a9eff', text: '#fff',    glow: 'rgba(74,158,255,0.6)' },
  grass:     { bg: '#4caf50', text: '#fff',    glow: 'rgba(76,175,80,0.6)' },
  electric:  { bg: '#ffd700', text: '#1a1a00', glow: 'rgba(255,215,0,0.7)' },
  psychic:   { bg: '#e91e8c', text: '#fff',    glow: 'rgba(233,30,140,0.6)' },
  ice:       { bg: '#80deea', text: '#003',    glow: 'rgba(128,222,234,0.6)' },
  dark:      { bg: '#424242', text: '#fff',    glow: 'rgba(66,66,66,0.7)' },
  fighting:  { bg: '#c62828', text: '#fff',    glow: 'rgba(198,40,40,0.6)' },
  poison2:   { bg: '#9c27b0', text: '#fff',    glow: 'rgba(156,39,176,0.6)' },
  ground:    { bg: '#a1887f', text: '#fff',    glow: 'rgba(161,136,127,0.6)' },
  flying:    { bg: '#90caf9', text: '#003',    glow: 'rgba(144,202,249,0.6)' },
  bug:       { bg: '#8bc34a', text: '#fff',    glow: 'rgba(139,195,74,0.6)' },
  rock:      { bg: '#78909c', text: '#fff',    glow: 'rgba(120,144,156,0.6)' },
  ghost:     { bg: '#512da8', text: '#fff',    glow: 'rgba(81,45,168,0.6)' },
  steel:     { bg: '#90a4ae', text: '#fff',    glow: 'rgba(144,164,174,0.6)' },
  fairy:     { bg: '#f8bbd0', text: '#880e4f', glow: 'rgba(248,187,208,0.6)' },
  dragon2:   { bg: '#7c4dff', text: '#fff',    glow: 'rgba(124,77,255,0.6)' },
};

const getTypeStyle = (type: string) =>
  TYPE_COLORS[type?.toLowerCase()] ?? { bg: 'rgba(255,255,255,0.3)', text: '#052838', glow: 'transparent' };

const STAT_LABELS: Record<string, string> = {
  hp: 'PV', attack: 'ATQ', defense: 'DEF',
  'special-attack': 'ATQ.S', 'special-defense': 'DEF.S', speed: 'VIT',
};

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [speaking, setSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'regions'>('info');

  const { data: pokemon, isLoading } = useQuery<Pkmn>({
    queryKey: ['pokemon', id],
    queryFn: () => getPkmnById(id as string),
    enabled: !!id,
  });

  const { data: trainer } = useQuery<Trainer>({
    queryKey: ['trainer', user?.username],
    queryFn: () => getTrainerByUsername(user!.username),
    enabled: !!user?.username,
  });

  const isCaught = trainer?.pkmnCaught?.includes(pokemon?._id ?? '') ?? false;
  const isSeen   = trainer?.pkmnSeen?.includes(pokemon?._id ?? '') ?? false;

  // ── Web Speech API ──
  const handleSpeak = () => {
    const desc = (pokemon as any)?.description;
    if (!desc) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utter = new SpeechSynthesisUtterance(desc);
    utter.lang = 'fr-FR'; utter.rate = 0.9; utter.pitch = 1.05;
    const frVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('fr'));
    if (frVoice) utter.voice = frVoice;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  const handleMarkCaught = async () => {
    if (!pokemon?._id) return;
    await markPkmn(pokemon._id, !isCaught);
    queryClient.invalidateQueries({ queryKey: ['trainer'] });
  };

  const handleMarkSeen = async () => {
    if (!pokemon?._id) return;
    await markPkmn(pokemon._id, false);
    queryClient.invalidateQueries({ queryKey: ['trainer'] });
  };

  if (isLoading) return <Loader />;
  if (!pokemon)  return <NotFound onBack={() => router.back()} />;

  const primaryType = (pokemon.types?.[0] ?? 'normal').toLowerCase();
  const typeStyle   = getTypeStyle(primaryType);
  const pkmn = pokemon as any; // pour les champs optionnels non typés

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }

        .dex-layout { min-height:100vh; display:flex; align-items:stretch; background:#1a0a0a; overflow:hidden; font-family:'Exo 2',sans-serif; }

        /* Panneaux rouges */
        .dex-side { width:80px; flex-shrink:0; background:linear-gradient(160deg,#d03e4f 0%,#c30d23 55%,#8a0818 100%); position:relative; overflow:hidden; }
        .dex-side-left  { border-radius:28px 0 0 28px; box-shadow:inset -3px 0 8px rgba(0,0,0,0.35),4px 0 20px rgba(0,0,0,0.4); }
        .dex-side-right { border-radius:0 28px 28px 0; box-shadow:inset 3px 0 8px rgba(0,0,0,0.35),-4px 0 20px rgba(0,0,0,0.4); }
        .dex-side::before {
          content:''; position:absolute; inset:-10px;
          background:
            radial-gradient(circle 65px at -10px -10px, transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at -10px -10px, transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at calc(100% + 10px) -10px, transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at calc(100% + 10px) -10px, transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at -10px calc(100% + 10px), transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at -10px calc(100% + 10px), transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%),
            radial-gradient(circle 65px at calc(100% + 10px) calc(100% + 10px), transparent 50%,rgba(0,0,0,0.42) 51%,rgba(0,0,0,0.42) 64%,transparent 65%),
            radial-gradient(circle 42px at calc(100% + 10px) calc(100% + 10px), transparent 50%,rgba(0,0,0,0.30) 51%,rgba(0,0,0,0.30) 63%,transparent 64%);
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

        /* Écran */
        .dex-screen { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative;
          background: radial-gradient(ellipse 80% 60% at 50% 10%,rgba(255,255,255,0.55) 0%,rgba(157,228,244,0.6) 30%,transparent 70%),
                      radial-gradient(ellipse 100% 100% at 50% 50%,#9de4f4 0%,#62c8e0 35%,#2a9ab8 65%,#0d5f7a 100%); }
        .dex-screen::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px); pointer-events:none; z-index:0; }

        /* Header */
        .detail-header { display:flex; align-items:center; gap:8px; padding:10px 12px 8px; border-bottom:1px solid rgba(0,80,100,0.2); background:rgba(255,255,255,0.1); backdrop-filter:blur(4px); position:relative; z-index:2; flex-shrink:0; }
        .back-btn { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.5); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:all 0.15s; flex-shrink:0; }
        .back-btn:hover { background:rgba(255,255,255,0.55); transform:translateX(-2px); }
        .header-name { font-size:14px; font-weight:900; color:#052838; letter-spacing:0.12em; text-transform:uppercase; text-shadow:0 1px 0 rgba(255,255,255,0.4); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .header-num  { font-size:10px; font-weight:700; color:rgba(5,50,70,0.5); letter-spacing:0.1em; flex-shrink:0; }
        .status-pill { display:flex; align-items:center; gap:3px; padding:3px 8px; border-radius:20px; font-size:8px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; flex-shrink:0; }
        .pill-caught { background:rgba(34,197,94,0.2);  color:#166534; border:1px solid rgba(34,197,94,0.3); }
        .pill-seen   { background:rgba(59,130,246,0.2); color:#1e3a5f; border:1px solid rgba(59,130,246,0.3); }
        .pill-unseen { background:rgba(0,50,70,0.15);   color:rgba(5,40,56,0.5); border:1px solid rgba(0,80,100,0.2); }
        .pill-dot { width:5px; height:5px; border-radius:50%; }

        /* Body scrollable */
        .detail-body { flex:1; overflow-y:auto; position:relative; z-index:2; }
        .detail-body::-webkit-scrollbar { width:3px; }
        .detail-body::-webkit-scrollbar-thumb { background:rgba(5,50,70,0.2); border-radius:3px; }

        /* Hero */
        .pokemon-hero { display:flex; flex-direction:column; align-items:center; padding:18px 16px 10px; position:relative; }
        .pokemon-glow { position:absolute; width:140px; height:140px; border-radius:50%; filter:blur(35px); opacity:0.45; top:14px; pointer-events:none; }
        .pokemon-sprite { width:115px; height:115px; object-fit:contain; position:relative; z-index:1; filter:drop-shadow(0 6px 18px rgba(0,0,0,0.22)); animation:floatPkmn 3.2s ease-in-out infinite; }
        @keyframes floatPkmn { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }

        .types-row { display:flex; gap:6px; margin-top:10px; position:relative; z-index:1; }
        .type-badge { padding:3px 14px; border-radius:20px; font-size:10px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; }

        /* Bouton voix */
        .speak-btn { margin-top:10px; display:flex; align-items:center; gap:7px; padding:7px 18px; border-radius:20px; border:1.5px solid rgba(255,255,255,0.5); background:rgba(255,255,255,0.25); cursor:pointer; font-family:'Exo 2',sans-serif; font-size:10px; font-weight:700; color:#052838; letter-spacing:0.1em; text-transform:uppercase; transition:all 0.2s; position:relative; z-index:1; backdrop-filter:blur(4px); }
        .speak-btn:hover { background:rgba(255,255,255,0.45); }
        .speak-btn.speaking { background:rgba(195,13,35,0.15); border-color:rgba(195,13,35,0.45); color:#7a0a15; animation:speakPulse 1.2s ease-in-out infinite; }
        @keyframes speakPulse { 0%,100%{box-shadow:0 0 0 0 rgba(195,13,35,0)} 50%{box-shadow:0 0 0 6px rgba(195,13,35,0.12)} }
        .sound-bars { display:flex; align-items:flex-end; gap:2px; height:14px; }
        .sound-bar  { width:3px; border-radius:2px; background:#c30d23; animation:soundAnim 0.5s ease-in-out infinite alternate; }
        .sound-bar:nth-child(1){height:4px;animation-delay:0s}
        .sound-bar:nth-child(2){height:10px;animation-delay:0.12s}
        .sound-bar:nth-child(3){height:6px;animation-delay:0.24s}
        .sound-bar:nth-child(4){height:13px;animation-delay:0.08s}
        @keyframes soundAnim { from{transform:scaleY(0.35)} to{transform:scaleY(1)} }

        /* Tabs */
        .tabs-row { display:flex; padding:10px 12px 0; gap:4px; position:relative; z-index:2; }
        .tab-btn { flex:1; padding:7px 4px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.15); font-family:'Exo 2',sans-serif; font-size:9px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:rgba(5,40,56,0.55); cursor:pointer; transition:all 0.18s; }
        .tab-btn:hover  { background:rgba(255,255,255,0.28); }
        .tab-btn.active { background:rgba(255,255,255,0.42); border-color:rgba(255,255,255,0.7); color:#052838; box-shadow:0 2px 10px rgba(0,80,100,0.14); }

        /* Contenu */
        .tab-content { padding:10px 12px; position:relative; z-index:2; }
        .info-card { background:rgba(255,255,255,0.22); border:1px solid rgba(255,255,255,0.4); border-radius:14px; padding:14px; backdrop-filter:blur(6px); }
        .info-desc { font-size:12px; line-height:1.75; color:#052838; font-weight:500; margin-bottom:12px; font-style:italic; padding-bottom:12px; border-bottom:1px solid rgba(0,80,100,0.1); }
        .info-row  { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid rgba(0,80,100,0.08); }
        .info-row:last-child { border-bottom:none; }
        .info-label { font-size:9px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(5,50,70,0.5); }
        .info-val   { font-size:12px; font-weight:800; color:#052838; text-shadow:0 1px 0 rgba(255,255,255,0.3); }

        /* Stats */
        .stat-row { display:flex; align-items:center; gap:8px; margin-bottom:9px; }
        .stat-label-sm { font-size:8px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:rgba(5,50,70,0.6); width:36px; flex-shrink:0; text-align:right; }
        .stat-val      { font-size:11px; font-weight:900; color:#052838; width:28px; flex-shrink:0; text-align:right; }
        .stat-track { flex:1; height:7px; background:rgba(0,50,70,0.12); border-radius:4px; overflow:hidden; }
        .stat-fill  { height:100%; border-radius:4px; transition:width 0.8s cubic-bezier(0.4,0,0.2,1); }

        /* Moves */
        .moves-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; }
        .move-chip  { background:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.4); border-radius:8px; padding:5px 8px; font-size:9px; font-weight:700; color:#052838; text-transform:uppercase; letter-spacing:0.04em; text-align:center; }

        /* Régions */
        .regions-list { display:flex; flex-direction:column; gap:6px; }
        .region-row   { display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.35); border-radius:10px; padding:8px 12px; }
        .region-name  { font-size:11px; font-weight:800; color:#052838; text-transform:capitalize; }
        .region-num   { font-size:10px; font-weight:700; color:rgba(5,50,70,0.6); letter-spacing:0.05em; }

        /* Footer */
        .detail-footer { padding:8px 12px; border-top:1px solid rgba(0,80,100,0.15); display:flex; gap:8px; background:rgba(255,255,255,0.1); backdrop-filter:blur(4px); position:relative; z-index:2; flex-shrink:0; }
        .footer-btn { flex:1; padding:9px 8px; border:none; border-radius:10px; font-family:'Exo 2',sans-serif; font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; cursor:pointer; transition:all 0.18s; }
        .footer-btn:active { transform:scale(0.96); }
        .btn-catch   { background:#c30d23; color:#fff; box-shadow:0 3px 10px rgba(195,13,35,0.4); }
        .btn-catch:hover { background:#e0102a; }
        .btn-release { background:rgba(0,50,70,0.2); color:rgba(5,40,56,0.7); border:1px solid rgba(0,80,100,0.3); }
        .btn-release:hover { background:rgba(0,50,70,0.32); }
        .btn-see     { background:rgba(255,255,255,0.3); color:#052838; border:1px solid rgba(255,255,255,0.5); }
        .btn-see:hover { background:rgba(255,255,255,0.5); }

        .empty-msg { color:rgba(5,40,56,0.45); font-size:12px; text-align:center; padding:20px 0; font-weight:600; }
      `}</style>

      <div className="dex-layout">
        <div className="dex-side dex-side-left"><div className="half-circle" /></div>

        <div className="dex-col">
          <div className="dex-band" />
          <div className="dex-bar dex-bar-top" />

          <div className="dex-screen">

            {/* ── Header ── */}
            <div className="detail-header">
              <button className="back-btn" onClick={() => router.back()}>←</button>
              <div className="header-name">{pokemon.name}</div>
              <div
                className={`status-pill ${isCaught ? 'pill-caught' : isSeen ? 'pill-seen' : 'pill-unseen'}`}
              >
                <div className="pill-dot" style={{
                  background: isCaught ? '#22c55e' : isSeen ? '#3b82f6' : 'rgba(0,50,70,0.3)',
                  boxShadow: isCaught ? '0 0 4px rgba(34,197,94,0.7)' : isSeen ? '0 0 4px rgba(59,130,246,0.6)' : 'none'
                }} />
                {isCaught ? 'Capturé' : isSeen ? 'Vu' : 'Inconnu'}
              </div>
            </div>

            <div className="detail-body">

              {/* ── Hero ── */}
              <div className="pokemon-hero">
                <div className="pokemon-glow" style={{ background: typeStyle.bg }} />
                <img
                  src={pokemon.imgUrl}
                  alt={pokemon.name}
                  className="pokemon-sprite"
                  style={!isSeen && !isCaught ? { filter: 'brightness(0) opacity(0.4)' } : {}}
                />
                <div className="types-row">
                  {pokemon.types?.map((t: string) => {
                    const ts = getTypeStyle(t);
                    return (
                      <span key={t} className="type-badge"
                        style={{ background: ts.bg, color: ts.text, boxShadow: `0 2px 10px ${ts.glow}` }}>
                        {t}
                      </span>
                    );
                  })}
                </div>

                {/* Bouton voix — seulement si description disponible */}
                {pkmn.description && (
                  <button className={`speak-btn ${speaking ? 'speaking' : ''}`} onClick={handleSpeak}>
                    {speaking ? (
                      <><div className="sound-bars">{[1,2,3,4].map(i=><div key={i} className="sound-bar"/>)}</div> Arrêter</>
                    ) : (
                      <>🔊 Écouter</>
                    )}
                  </button>
                )}
              </div>

              {/* ── Tabs ── */}
              <div className="tabs-row">
                {(['info','stats','regions'] as const).map(tab => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab as any)}
                  >
                    {tab === 'info' ? '📋 Infos' : tab === 'stats' ? '📊 Stats' : '🗺 Régions'}
                  </button>
                ))}
              </div>

              {/* ── Contenu ── */}
              <div className="tab-content">

                {/* Info */}
                {activeTab === 'info' && (
                  <div className="info-card">
                    {pkmn.description && <p className="info-desc">"{pkmn.description}"</p>}
                    {pkmn.height != null && (
                      <div className="info-row">
                        <span className="info-label">Taille</span>
                        <span className="info-val">{(pkmn.height / 10).toFixed(1)} m</span>
                      </div>
                    )}
                    {pkmn.weight != null && (
                      <div className="info-row">
                        <span className="info-label">Poids</span>
                        <span className="info-val">{(pkmn.weight / 10).toFixed(1)} kg</span>
                      </div>
                    )}
                    {pkmn.abilities?.length > 0 && (
                      <div className="info-row">
                        <span className="info-label">Talents</span>
                        <span className="info-val">{pkmn.abilities.join(', ')}</span>
                      </div>
                    )}
                    {pkmn.generation && (
                      <div className="info-row">
                        <span className="info-label">Génération</span>
                        <span className="info-val">{pkmn.generation}</span>
                      </div>
                    )}
                    {pokemon.types?.length > 0 && (
                      <div className="info-row">
                        <span className="info-label">Types</span>
                        <span className="info-val">{pokemon.types.join(' · ')}</span>
                      </div>
                    )}
                    {pkmn.baseExp != null && (
                      <div className="info-row">
                        <span className="info-label">Exp. de base</span>
                        <span className="info-val">{pkmn.baseExp}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                {activeTab === 'stats' && (
                  <div className="info-card">
                    {pkmn.stats?.length > 0 ? pkmn.stats.map((s: any) => {
                      const pct = Math.min((s.value / 255) * 100, 100);
                      const color = pct > 66 ? '#22c55e' : pct > 33 ? '#f59e0b' : '#ef4444';
                      return (
                        <div key={s.name} className="stat-row">
                          <span className="stat-label-sm">{STAT_LABELS[s.name] ?? s.name}</span>
                          <span className="stat-val">{s.value}</span>
                          <div className="stat-track">
                            <div className="stat-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}80` }} />
                          </div>
                        </div>
                      );
                    }) : <p className="empty-msg">Pas de stats disponibles</p>}
                  </div>
                )}

                {/* Régions — utilise le champ `regions` de ton modèle */}
                {activeTab === 'regions' && (
                  <div className="info-card">
                    {pkmn.regions?.length > 0 ? (
                      <div className="regions-list">
                        {pkmn.regions.map((r: any) => (
                          <div key={r.regionName} className="region-row">
                            <span className="region-name">{r.regionName}</span>
                            <span className="region-num">#{String(r.regionPokedexNumber).padStart(3, '0')}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="empty-msg">Aucune région enregistrée</p>}
                  </div>
                )}

              </div>
            </div>

            {/* ── Footer actions ── */}
            <div className="detail-footer">
              {!isSeen && !isCaught && (
                <button className="footer-btn btn-see" onClick={handleMarkSeen}>👁 Vu</button>
              )}
              <button
                className={`footer-btn ${isCaught ? 'btn-release' : 'btn-catch'}`}
                onClick={handleMarkCaught}
              >
                {isCaught ? '↩ Relâcher' : '⚡ Capturer'}
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

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#1a0a0a', gap:16 }}>
      <div style={{ fontSize:48 }}>❓</div>
      <div style={{ color:'rgba(157,228,244,0.7)', fontSize:13, fontFamily:'monospace', letterSpacing:'0.2em' }}>POKÉMON INTROUVABLE</div>
      <button onClick={onBack} style={{ padding:'8px 20px', background:'#c30d23', color:'#fff', border:'none', borderRadius:8, fontFamily:'monospace', cursor:'pointer', letterSpacing:'0.1em' }}>← RETOUR</button>
    </div>
  );
}
