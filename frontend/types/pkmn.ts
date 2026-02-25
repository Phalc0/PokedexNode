export interface Region {
    regionName: string;
    regionPokedexNumber: string;
}

export interface Pkmn {
    _id: string;
    name: string;
    types: string[];
    description: string;
    regions: Region[];
    imgUrl: string;
}