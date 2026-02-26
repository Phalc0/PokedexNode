'use client';

import { useParams } from "next/navigation";
import { useTrainer, Trainer } from "@/hooks/useTrainer";
import Image from "next/image";

export default function TrainerPage() {
    const params = useParams();
    const usernameParam = params.username;

    // Vérification que ce soit bien une string
    const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;

    const { trainer, loading, error, markPkmn } = useTrainer(username || "");

    if (loading) return <div>Loading trainer...</div>;
    if (error) return <div>Error loading trainer</div>;
    if (!trainer) return <div>Trainer not found</div>;

    const handleMarkPkmn = (pkmnId: string, isCaught: boolean) => {
        markPkmn({ pkmnId, isCaught });
    };


    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Profil du dresseur */}
            <div className="flex items-center space-x-4 mb-6">
                <Image
                    src={trainer.imgUrl}
                    alt={trainer.trainerName}
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-gray-300"
                />
                <div>
                    <h1 className="text-2xl font-bold">{trainer.trainerName}</h1>
                    <p className="text-gray-500">Username: {trainer.username}</p>
                    <p className="text-gray-400 text-sm">Joined: {new Date(trainer.creationDate).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Pokémon vus */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Pokémon Seen</h2>
                <div className="grid grid-cols-6 gap-4">
                    {trainer.pkmnSeen.map((pkmn: any) => (
                        <div key={pkmn._id} className="text-center">
                            <Image src={pkmn.imgUrl} alt={pkmn.name} width={60} height={60} />
                            <p className="text-sm">{pkmn.name}</p>
                            <button
                                onClick={() => handleMarkPkmn(pkmn._id, true)}
                                className="mt-1 px-2 py-1 text-xs bg-green-500 text-white rounded"
                            >
                                Mark Caught
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pokémon capturés */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Pokémon Caught</h2>
                <div className="grid grid-cols-6 gap-4">
                    {trainer.pkmnCaught.map((pkmn: any) => (
                        <div key={pkmn._id} className="text-center">
                            <Image src={pkmn.imgUrl} alt={pkmn.name} width={60} height={60} />
                            <p className="text-sm">{pkmn.name}</p>
                            <button
                                onClick={() => handleMarkPkmn(pkmn._id, false)}
                                className="mt-1 px-2 py-1 text-xs bg-red-500 text-white rounded"
                            >
                                Unmark Caught
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}