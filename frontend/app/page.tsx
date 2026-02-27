'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import PokeballButton from '@/components/HomePokeButton';
import '@/styles/HomePokedex.css';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<'idle' | 'opening' | 'zooming'>('idle');

  const handleEnter = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setTimeout(() => setPhase('zooming'), 800);
    setTimeout(() => {
      router.push(isAuthenticated ? '/pokedex' : '/auth/login');
    }, 1600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at center, #3a3636 0%, #1a1010 100%)' }}>

      <div className={`homedex-wrap ${phase === 'zooming' ? 'zooming' : ''}`}>
        <div className="homedex-shadow homedex-body">
          <div className={`homedex-screen ${phase !== 'idle' ? 'visible' : ''}`}>
            <div className="homedex-screen__lines">
              <div className="homedex-screen__line" /><div className="homedex-screen__line" />
              <div className="homedex-screen__line" /><div className="homedex-screen__line" />
            </div>
          </div>

          <div className={`homedex-panel homedex-panel--top ${phase !== 'idle' ? 'open' : ''}`} />

          <div className="homedex-belt">
            <PokeballButton onClick={handleEnter} />
          </div>

          <div className={`homedex-panel homedex-panel--bottom ${phase !== 'idle' ? 'open' : ''}`} />
        </div>

        <p className="homedex-screen__label">Appuyer pour ouvrir</p>
      </div>
    </div>
  );
}
