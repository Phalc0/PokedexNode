'use client';
import { useState } from 'react';
import { useAllPokemon, useSearchPokemon } from '@/hooks/usePokemon';
import { useQuery } from '@tanstack/react-query';
import { getTrainerByUsername } from '@/services/api';
import { Trainer } from '@/types/trainer';
import { useAuth } from '@/hooks/useAuth';
import { markPkmn } from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function PokedexPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: allPkmn, isLoading: loadingAll } = useAllPokemon();
  const { data: searchResult } = useSearchPokemon(search);
  const { data: trainer, isLoading: loadingTrainer } = useQuery<Trainer>({
    queryKey: ['trainer', user?.username],
    queryFn: () => getTrainerByUsername(user!.username),
    enabled: !!user?.username,
  });

  const allData = allPkmn as { count: number; data: any[] } | undefined;
  const pokemons = search.length > 3 ? searchResult : allData?.data;

  if (loadingAll || loadingTrainer) return <Loader />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }

        .dex-layout { min-height:100vh; display:flex; align-items:stretch; background:#1a0a0a; overflow:hidden; font-family:'Exo 2',sans-serif; }

        .dex-side { width:80px; flex-shrink:0; background:linear-gradient(160deg,#d03e4f 0%,#c30d23 55%,#8a0818 100%); position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:center; align-items:center; }
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
          pointer-events:none; z-index:0;
        }
        .dex-side::after { content:''; position:absolute; top:0;left:0;right:0;height:38%; background:linear-gradient(180deg,rgba(255,255,255,0.10) 0%,transparent 100%); pointer-events:none; z-index:0; }
        .dex-side-left .half-circle  { position:absolute; top:50%; right:-3px; transform:translateY(-50%); width:54px; height:110px; background:linear-gradient(90deg,#2a2624,#1e1a18); border-radius:110px 0 0 110px; border:3px solid #1a1614; border-right:none; z-index:2; box-shadow:inset -8px 0 18px rgba(0,0,0,0.7),inset 2px 0 4px rgba(255,255,255,0.02); }
        .dex-side-right .half-circle { position:absolute; top:50%; left:-3px;  transform:translateY(-50%); width:54px; height:110px; background:linear-gradient(270deg,#2a2624,#1e1a18); border-radius:0 110px 110px 0; border:3px solid #1a1614; border-left:none;  z-index:2; box-shadow:inset 8px 0 18px rgba(0,0,0,0.7),inset -2px 0 4px rgba(255,255,255,0.02); }

        .dex-col { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

        .dex-band { height:16px; flex-shrink:0; background:linear-gradient(90deg,rgba(157,228,244,0.15) 0%,#9ce9f6 20%,#c8f5ff 50%,#9ce9f6 80%,rgba(157,228,244,0.15) 100%); border-top:1px solid rgba(255,255,255,0.5); border-bottom:1px solid rgba(200,245,255,0.4); box-shadow:0 0 20px rgba(157,228,244,0.4),0 2px 8px rgba(0,0,0,0.3); position:relative; z-index:5; }

        .dex-bar { height:24px; flex-shrink:0; background:#2f2b2a; position:relative; z-index:4; }
        .dex-bar-top    { border-radius:14px 14px 0 0; box-shadow:0 4px 12px rgba(0,0,0,0.5); }
        .dex-bar-bottom { border-radius:0 0 14px 14px; box-shadow:0 -4px 12px rgba(0,0,0,0.5); }

        .dex-screen { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative;
          background: radial-gradient(ellipse 80% 60% at 50% 10%,rgba(255,255,255,0.55) 0%,rgba(157,228,244,0.6) 30%,transparent 70%),
                      radial-gradient(ellipse 100% 100% at 50% 50%,#9de4f4 0%,#62c8e0 35%,#2a9ab8 65%,#0d5f7a 100%); }
        .dex-screen::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px); pointer-events:none; z-index:1; }

        /* ── Header ── */
        .screen-header { padding:12px 14px 10px; border-bottom:1px solid rgba(0,80,100,0.25); position:relative; z-index:2; background:rgba(255,255,255,0.08); backdrop-filter:blur(4px); }

        .header-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }

        .screen-title { font-family:'Exo 2',sans-serif; font-size:13px; font-weight:900; letter-spacing:0.3em; color:rgba(5,50,65,0.85); text-transform:uppercase; text-shadow:0 1px 0 rgba(255,255,255,0.4); flex:1; text-align:center; }

        /* Bouton profil */
        .profile-btn {
          width:34px; height:34px; border-radius:50%;
          background:rgba(255,255,255,0.28);
          border:1.5px solid rgba(255,255,255,0.55);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; font-size:17px;
          transition:all 0.18s; flex-shrink:0;
          box-shadow:0 2px 8px rgba(0,80,100,0.12);
        }
        .profile-btn:hover { background:rgba(255,255,255,0.5); transform:scale(1.1); box-shadow:0 4px 14px rgba(0,80,100,0.22); }
        .profile-btn:active { transform:scale(0.94); }

        /* Spacer pour centrer le titre */
        .header-spacer { width:34px; flex-shrink:0; }

        .search-wrap { position:relative; }
        .search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:12px; opacity:0.5; pointer-events:none; }
        .search-input { width:100%; background:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.45); border-radius:20px; padding:7px 12px 7px 30px; font-size:12px; color:#062030; outline:none; font-family:'Exo 2',sans-serif; font-weight:600; transition:all 0.2s; backdrop-filter:blur(4px); }
        .search-input::placeholder { color:rgba(5,50,65,0.45); }
        .search-input:focus { background:rgba(255,255,255,0.35); border-color:rgba(255,255,255,0.7); box-shadow:0 0 16px rgba(255,255,255,0.2); }

        .pokemon-grid { flex:1; overflow-y:auto; padding:10px 8px; display:grid; grid-template-columns:repeat(2,1fr); gap:8px; position:relative; z-index:2; align-content:start; }
        .pokemon-grid::-webkit-scrollbar { width:4px; }
        .pokemon-grid::-webkit-scrollbar-track { background:transparent; }
        .pokemon-grid::-webkit-scrollbar-thumb { background:rgba(5,50,65,0.25); border-radius:4px; }

        .pkmn-card { background:rgba(255,255,255,0.22); border:1px solid rgba(255,255,255,0.4); border-radius:12px; padding:10px 8px 8px; text-align:center; transition:all 0.2s; backdrop-filter:blur(6px); box-shadow:0 2px 8px rgba(0,80,100,0.12); cursor:pointer; }
        .pkmn-card:hover { background:rgba(255,255,255,0.35); border-color:rgba(255,255,255,0.7); transform:translateY(-2px); box-shadow:0 6px 16px rgba(0,80,100,0.2); }
        .pkmn-card.caught { background:rgba(255,255,255,0.30); border-color:rgba(255,255,255,0.6); box-shadow:0 2px 12px rgba(0,100,50,0.2); }
        .pkmn-card.seen   { background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.3); }
        .pkmn-card.unseen { background:rgba(0,50,70,0.2); border-color:rgba(0,80,100,0.3); }

        .pkmn-img { width:62px; height:62px; object-fit:contain; margin:0 auto 4px; display:block; transition:transform 0.2s; }
        .pkmn-card:hover .pkmn-img { transform:scale(1.08); }
        .pkmn-img.hidden-img { filter:brightness(0) opacity(0.35); }

        .pkmn-name { font-family:'Exo 2',sans-serif; font-size:11px; font-weight:800; color:#052838; letter-spacing:0.04em; text-transform:uppercase; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:0 1px 0 rgba(255,255,255,0.4); }
        .pkmn-card.unseen .pkmn-name { color:rgba(5,40,56,0.5); }

        .pkmn-type { display:inline-block; font-size:8px; font-weight:700; font-family:'Exo 2',sans-serif; color:rgba(5,50,70,0.75); background:rgba(255,255,255,0.3); border-radius:20px; padding:1px 7px; margin-bottom:6px; letter-spacing:0.05em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.4); max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .pkmn-status-bar { display:flex; gap:3px; justify-content:center; margin-bottom:7px; }
        .status-dot { width:7px; height:7px; border-radius:50%; border:1px solid rgba(0,0,0,0.15); }
        .status-dot.active-caught { background:#22c55e; box-shadow:0 0 5px rgba(34,197,94,0.6); }
        .status-dot.active-seen   { background:#3b82f6; box-shadow:0 0 5px rgba(59,130,246,0.5); }
        .status-dot.inactive      { background:rgba(0,50,70,0.2); }

        .pkmn-actions { display:flex; gap:4px; justify-content:center; }
        .btn-action { font-size:9px; padding:4px 8px; border-radius:20px; border:none; cursor:pointer; font-family:'Exo 2',sans-serif; font-weight:700; letter-spacing:0.04em; transition:all 0.15s; text-transform:uppercase; }
        .btn-action:active { transform:scale(0.92); }
        .btn-seen    { background:rgba(255,255,255,0.4); color:#052838; border:1px solid rgba(255,255,255,0.6); }
        .btn-seen:hover { background:rgba(255,255,255,0.6); }
        .btn-catch   { background:#c30d23; color:#fff; box-shadow:0 2px 8px rgba(195,13,35,0.4); }
        .btn-catch:hover { background:#e01530; }
        .btn-release { background:rgba(0,50,70,0.25); color:rgba(5,40,56,0.7); border:1px solid rgba(0,80,100,0.3); }
        .btn-release:hover { background:rgba(0,50,70,0.35); }

        .screen-footer { padding:8px 16px; border-top:1px solid rgba(0,80,100,0.2); display:flex; justify-content:space-around; align-items:center; background:rgba(255,255,255,0.1); backdrop-filter:blur(4px); position:relative; z-index:2; }
        .footer-stat { text-align:center; font-family:'Exo 2',sans-serif; }
        .footer-stat-num { font-size:16px; font-weight:900; color:#052838; line-height:1; text-shadow:0 1px 0 rgba(255,255,255,0.4); }
        .footer-stat-label { font-size:8px; font-weight:700; letter-spacing:0.15em; color:rgba(5,50,70,0.6); text-transform:uppercase; margin-top:1px; }
        .footer-divider { width:1px; height:24px; background:rgba(0,80,100,0.2); }
      `}</style>

      <div className="dex-layout">
        <div className="dex-side dex-side-left"><div className="half-circle" /></div>

        <div className="dex-col">
          <div className="dex-band" />
          <div className="dex-bar dex-bar-top" />

          <div className="dex-screen">
            <div className="screen-header">
              <div className="header-top">
                {/* Spacer gauche pour centrer le titre */}
                <div className="header-spacer" />
                <div className="screen-title">Pokédex</div>
                {/* Bouton profil */}
                <button
                  className="profile-btn"
                  onClick={() => router.push('/profile')}
                  title="Mon profil"
                >
                  🧢
                </button>
              </div>
              <div className="search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un Pokémon..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="pokemon-grid">
              {pokemons && pokemons.length > 0 && trainer ? (
                pokemons.map((p: any) => (
                  <CardPokemon key={p._id} pokemon={p} trainer={trainer} />
                ))
              ) : (
                <div style={{ gridColumn:'1/-1', textAlign:'center', color:'rgba(5,40,56,0.5)', fontFamily:"'Exo 2',sans-serif", fontSize:12, paddingTop:48, fontWeight:600 }}>
                  Aucun Pokémon trouvé
                </div>
              )}
            </div>

            {trainer && (
              <div className="screen-footer">
                <div className="footer-stat">
                  <div className="footer-stat-num">{trainer.pkmnSeen.length}</div>
                  <div className="footer-stat-label">Vus</div>
                </div>
                <div className="footer-divider" />
                <div className="footer-stat">
                  <div className="footer-stat-num">{trainer.pkmnCaught.length}</div>
                  <div className="footer-stat-label">Capturés</div>
                </div>
                <div className="footer-divider" />
                <div className="footer-stat">
                  <div className="footer-stat-num">{allData?.count ?? '—'}</div>
                  <div className="footer-stat-label">Total</div>
                </div>
              </div>
            )}
          </div>

          <div className="dex-bar dex-bar-bottom" />
          <div className="dex-band" />
        </div>

        <div className="dex-side dex-side-right"><div className="half-circle" /></div>
      </div>
    </>
  );
}

function CardPokemon({ pokemon, trainer }: { pokemon: any; trainer: Trainer }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCaught = trainer.pkmnCaught.includes(pokemon._id);
  const isSeen   = trainer.pkmnSeen.includes(pokemon._id);

  const handleMarkSeen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markPkmn(pokemon._id, false);
    queryClient.invalidateQueries({ queryKey: ['trainer'] });
  };

  const handleMarkCaught = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markPkmn(pokemon._id, !isCaught);
      queryClient.invalidateQueries({ queryKey: ['trainer'] });
    } catch (err: any) {
      console.error('Erreur markPkmn:', err.response?.data || err.message);
    }
  };

  return (
    <div
      className={`pkmn-card ${isCaught ? 'caught' : isSeen ? 'seen' : 'unseen'}`}
      onClick={() => router.push(`/pokedex/pokemon/${pokemon._id}`)}
    >
      <img src={pokemon.imgUrl} alt={pokemon.name} className={`pkmn-img ${!isSeen && !isCaught ? 'hidden-img' : ''}`} />
      <div className="pkmn-name">{pokemon.name}</div>
      <div className="pkmn-type">{pokemon.types?.join(' · ') || '—'}</div>

      <div className="pkmn-status-bar">
        {[0,1,2].map(i => (
          <div key={i} className={`status-dot ${isCaught ? 'active-caught' : isSeen && i < 2 ? 'active-seen' : 'inactive'}`} />
        ))}
      </div>

      <div className="pkmn-actions">
        {!isSeen && !isCaught && (
          <button className="btn-action btn-seen" onClick={handleMarkSeen}>👁 Vu</button>
        )}
        <button className={`btn-action ${isCaught ? 'btn-release' : 'btn-catch'}`} onClick={handleMarkCaught}>
          {isCaught ? 'Relâcher' : '⚡ Capturer'}
        </button>
      </div>
    </div>
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
