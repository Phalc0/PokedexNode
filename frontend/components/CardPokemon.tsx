import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Trainer } from '@/types/trainer';
import { markPkmn } from '@/services/api';

interface CardPokemonProps {
    pokemon: any;
    trainer: Trainer;
}

export default function CardPokemon({ pokemon, trainer }: CardPokemonProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const isCaught = trainer.pkmnCaught.includes(pokemon._id);
    const isSeen = trainer.pkmnSeen.includes(pokemon._id);

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
            {/* Image + badge pokéball si capturé */}
            <div className="pkmn-img-wrap">
                <img
                    src={pokemon.imgUrl}
                    alt={pokemon.name}
                    className={`pkmn-img ${!isSeen && !isCaught ? 'hidden-img' : ''}`}
                />
                {isCaught && (
                    <div className="caught-ball" title="Capturé">
                        <svg viewBox="0 0 32 32" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 16 A14 14 0 0 1 30 16 Z" fill="#c30d23" />
                            <path d="M2 16 A14 14 0 0 0 30 16 Z" fill="white" />
                            <line x1="2" y1="16" x2="30" y2="16" stroke="#1a0a0a" strokeWidth="2" />
                            <circle cx="16" cy="16" r="4" fill="white" stroke="#1a0a0a" strokeWidth="2" />
                            <circle cx="16" cy="16" r="2" fill="#9de4f4" />
                            <circle cx="16" cy="16" r="14" fill="none" stroke="#1a0a0a" strokeWidth="2" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="pkmn-name">
                {isSeen || isCaught ? pokemon.name : '???'}
            </div>

            {/* Actions contextuelles */}
            <div className="pkmn-actions" onClick={e => e.stopPropagation()}>
                {!isSeen && !isCaught && (
                    <button className="pkmn-btn pkmn-btn--see" onClick={handleMarkSeen}>
                        <span className="pkmn-btn-icon">👁</span>
                        <span className="pkmn-btn-label">Vu</span>
                    </button>
                )}
                {(isSeen || isCaught) && (
                    <button
                        className={`pkmn-btn ${isCaught ? 'pkmn-btn--release' : 'pkmn-btn--catch'}`}
                        onClick={handleMarkCaught}
                    >
                        {isCaught ? (
                            <>
                                <span className="pkmn-btn-icon">↩</span>
                                <span className="pkmn-btn-label">Relâcher</span>
                            </>
                        ) : (
                            <>
                                <span className="pkmn-btn-icon">
                                    <svg viewBox="0 0 20 20" width="11" height="11" style={{ display: 'block' }}>
                                        <path d="M1 10 A9 9 0 0 1 19 10 Z" fill="white" opacity="0.9" />
                                        <path d="M1 10 A9 9 0 0 0 19 10 Z" fill="white" opacity="0.55" />
                                        <line x1="1" y1="10" x2="19" y2="10" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                                        <circle cx="10" cy="10" r="3" fill="white" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                                        <circle cx="10" cy="10" r="1.2" fill="rgba(157,228,244,0.9)" />
                                        <circle cx="10" cy="10" r="9" fill="none" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                                    </svg>
                                </span>
                                <span className="pkmn-btn-label">Capturer</span>
                            </>
                        )}
                    </button>
                )}
                {!isSeen && !isCaught && (
                    <button className="pkmn-btn pkmn-btn--catch" onClick={handleMarkCaught}>
                        <span className="pkmn-btn-icon">
                            <svg viewBox="0 0 20 20" width="11" height="11" style={{ display: 'block' }}>
                                <path d="M1 10 A9 9 0 0 1 19 10 Z" fill="white" opacity="0.9" />
                                <path d="M1 10 A9 9 0 0 0 19 10 Z" fill="white" opacity="0.55" />
                                <line x1="1" y1="10" x2="19" y2="10" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                                <circle cx="10" cy="10" r="3" fill="white" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                                <circle cx="10" cy="10" r="1.2" fill="rgba(157,228,244,0.9)" />
                                <circle cx="10" cy="10" r="9" fill="none" stroke="rgba(195,13,35,0.8)" strokeWidth="1.5" />
                            </svg>
                        </span>
                        <span className="pkmn-btn-label">Capturer</span>
                    </button>
                )}
            </div>
        </div>
    );
}
