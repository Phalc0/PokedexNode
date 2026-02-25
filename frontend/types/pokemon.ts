// The same thing that is in the model

export interface Region {
    regionName: string;
    regionPokedexNumber: number;
}

export interface Pkmn {
    _id: string;
    name: string;
    types: string[];
    description?: string;
    regions: Region[];
    imgUrl?: string;
}
