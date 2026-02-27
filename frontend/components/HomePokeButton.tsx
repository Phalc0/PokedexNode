'use client'


interface PokeballButtonProps {
    onClick: () => void;
}

export default function PokeballButton({ onClick }: PokeballButtonProps) {
    return (
        <button className="Homedex-btn" onClick={onClick} aria-label="Ouvrir le Pokédex">
            <div className="Homedex-btn__shine" />
        </button>
    )
}