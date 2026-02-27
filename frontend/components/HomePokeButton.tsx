'use client'
interface PokeballButtonProps {
    onClick: () => void;
}


export default function PokeballButton({ onClick }: PokeballButtonProps) {
    return (
        <button className="pokeball-btn" onClick={onClick} aria-label="Ouvrir le Pokédex">
            <div className="pb-shine" />
        </button>
    )
}