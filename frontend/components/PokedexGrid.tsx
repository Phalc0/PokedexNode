import { Trainer } from '@/types/trainer';
import CardPokemon from './CardPokemon';

interface Props {
  pokemons: any[] | undefined;
  trainer: Trainer | undefined;
}

export default function PokemonGrid({ pokemons, trainer }: Props) {
  if (!pokemons || pokemons.length === 0 || !trainer) {
    return (
      <div className="no-pokemon">
        Aucun Pokémon trouvé
      </div>
    );
  }

  return (
    <div className="pokemon-grid">
      {pokemons.map((p: any) => (
        <CardPokemon key={p._id} pokemon={p} trainer={trainer} />
      ))}
    </div>
  );
}