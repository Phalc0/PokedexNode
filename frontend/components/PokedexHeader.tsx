import { useRouter } from 'next/navigation';

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function PokedexHeader({ search, setSearch }: Props) {
  const router = useRouter();
  return (
    <div className="screen-header">
      <div className="header-top">
        <div className="header-spacer" />
        <div className="screen-title">Pokédex</div>
        <button className="profile-btn" onClick={() => router.push('/profile')} title="Mon profil">🧢</button>
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
  );
}