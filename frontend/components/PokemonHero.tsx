import { getTypeStyle } from '../utils/pkmnTypesColor';
import { useSpeak } from '../hooks/useSpeak';

interface Props {
  name: string;
  imgUrl: string;
  types: string[];
  description?: string;
  visible: boolean;
}

export function PokemonHero({ name, imgUrl, types, description, visible }: Props) {
  const primaryType = (types?.[0] ?? 'normal').toLowerCase();
  const typeStyle = getTypeStyle(primaryType);
  const { speaking, toggle } = useSpeak(description);

  return (
    <div className="pokemon-hero">
      <div className="pokemon-glow" style={{ background: typeStyle.bg }} />
      <img
        src={imgUrl}
        alt={name}
        className="pokemon-sprite"
        style={!visible ? { filter: 'brightness(0) opacity(0.4)' } : {}}
      />

      <div className="types-row">
        {types?.map((t) => {
          const ts = getTypeStyle(t);
          return (
            <span
              key={t}
              className="type-badge"
              style={{ background: ts.bg, color: ts.text, boxShadow: `0 2px 10px ${ts.glow}` }}
            >
              {t}
            </span>
          );
        })}
      </div>

      {description && (
        <button className={`speak-btn ${speaking ? 'speaking' : ''}`} onClick={toggle}>
          {speaking ? (
            <>
              <div className="sound-bars">
                {[1, 2, 3, 4].map(i => <div key={i} className="sound-bar" />)}
              </div>
              Arrêter
            </>
          ) : (
            <>🔊 Écouter</>
          )}
        </button>
      )}
    </div>
  );
}
