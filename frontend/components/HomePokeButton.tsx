'use client'


interface PokeballButtonProps {
    onClick: () => void;
}

export default function PokeballButton({ onClick }: PokeballButtonProps) {
    return (
        <button className="homedex-btn" onClick={onClick} aria-label="Ouvrir le Pokédex">
            <div className="homedex-btn__shine" />
        </button>
    )
}