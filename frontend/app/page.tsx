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

      <div className={`Homedex-wrap ${phase === 'zooming' ? 'zooming' : ''}`}>
        <div className="Homedex-shadow Homedex-body">
          <div className={`Homedex-screen ${phase !== 'idle' ? 'visible' : ''}`}>
            <div className="Homedex-screen__lines">
              <div className="Homedex-screen__line" /><div className="Homedex-screen__line" />
              <div className="Homedex-screen__line" /><div className="Homedex-screen__line" />
            </div>
          </div>

          <div className={`Homedex-panel Homedex-panel--top ${phase !== 'idle' ? 'open' : ''}`} />

          <div className="Homedex-belt">
            <PokeballButton onClick={handleEnter} />
          </div>

          <div className={`Homedex-panel Homedex-panel--bottom ${phase !== 'idle' ? 'open' : ''}`} />
        </div>

        <p className="Homedex-screen__label">Appuyer pour ouvrir</p>
      </div>
    </div>
  );
}
