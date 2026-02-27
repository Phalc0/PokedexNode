'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getPkmnById, getTrainerByUsername, markPkmn } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Trainer } from '@/types/trainer';
import { Pkmn } from '@/types/pkmn';
import Loader from '@/components/Loader';
import { NotFound } from '@/components/NotFound';
import { PokemonHero } from '../../../../components/PokemonHero';
import { TabInfo, TabStats, TabRegions } from '../../../../components/PokemonTabs';
import '@/styles/Pokemon.css';

type Tab = 'info' | 'stats' | 'regions';

const TABS: { key: Tab; label: string }[] = [
  { key: 'info',    label: '📋 Infos'   },
  { key: 'stats',   label: '📊 Stats'   },
  { key: 'regions', label: '🗺 Régions' },
];

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('info');

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

  if (isLoading) return <Loader />;
  if (!pokemon)  return <NotFound onBack={() => router.back()} />;

  const pkmn = pokemon as any;
  const isCaught = trainer?.pkmnCaught?.includes(pokemon._id ?? '') ?? false;
  const isSeen   = trainer?.pkmnSeen?.includes(pokemon._id ?? '') ?? false;

  const handleMarkCaught = async () => {
    if (!pokemon._id) return;
    await markPkmn(pokemon._id, !isCaught);
    queryClient.invalidateQueries({ queryKey: ['trainer'] });
  };

  const handleMarkSeen = async () => {
    if (!pokemon._id) return;
    await markPkmn(pokemon._id, false);
    queryClient.invalidateQueries({ queryKey: ['trainer'] });
  };

  return (
    <div className="dex-layout">
      <div className="dex-side dex-side-left"><div className="half-circle" /></div>

      <div className="dex-col">
        <div className="dex-band" />
        <div className="dex-bar dex-bar-top" />

        <div className="dex-screen">

          {/* Header */}
          <div className="detail-header">
            <button className="back-btn" onClick={() => router.back()}>←</button>
            <div className="header-name">{pokemon.name}</div>
            <StatusPill isCaught={isCaught} isSeen={isSeen} />
          </div>

          <div className="detail-body">
            <PokemonHero
              name={pokemon.name}
              imgUrl={pokemon.imgUrl}
              types={pokemon.types ?? []}
              description={pkmn.description}
              visible={isSeen || isCaught}
            />

            {/* Tabs */}
            <div className="tabs-row">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {activeTab === 'info' && (
                <TabInfo
                  description={pkmn.description}
                  height={pkmn.height}
                  weight={pkmn.weight}
                  abilities={pkmn.abilities}
                  generation={pkmn.generation}
                  types={pokemon.types}
                  baseExp={pkmn.baseExp}
                />
              )}
              {activeTab === 'stats'   && <TabStats stats={pkmn.stats} />}
              {activeTab === 'regions' && <TabRegions regions={pkmn.regions} />}
            </div>
          </div>

          {/* Footer */}
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
  );
}


function StatusPill({ isCaught, isSeen }: { isCaught: boolean; isSeen: boolean }) {
  const dotStyle = {
    background: isCaught ? '#22c55e' : isSeen ? '#3b82f6' : 'rgba(0,50,70,0.3)',
    boxShadow:  isCaught ? '0 0 4px rgba(34,197,94,0.7)' : isSeen ? '0 0 4px rgba(59,130,246,0.6)' : 'none',
  };

  return (
    <div className={`status-pill ${isCaught ? 'pill-caught' : isSeen ? 'pill-seen' : 'pill-unseen'}`}>
      <div className="pill-dot" style={dotStyle} />
      {isCaught ? 'Capturé' : isSeen ? 'Vu' : 'Inconnu'}
    </div>
  );
}
