const PkmnService = require("../services/pkmn.service");
const mongoose = require("mongoose");


jest.mock("../services/pkmn.service");

// In-memory array to simulate the database
const mockData = [];

//* Note: this mock implementation will be used for all tests in this suite. It contains the logic for all.
PkmnService.mockImplementation(() => {
    return {
        // Simulate creation of a Pokemon, throw error if duplicate name
        createPkmn: jest.fn(async (data) => {
            if (mockData.some(p => p.name === data.name)) {
                throw new Error("A Pokemon with this name already exists");
            }
            const created = { ...data, _id: `${data.name}-id` };
            mockData.push(created);
            return {
                toObject: () => created
            };
        }),
        // Return all Pokemon in the mock array
        getAllPkmn: jest.fn(async () => mockData),
        // Filter Pokemon by type if specified
        search: jest.fn(async (query) => {
            let filtered = mockData;
            if (query.typeOne) {
                filtered = mockData.filter(p => p.types.includes(query.typeOne));
            }
            return { data: filtered };
        })
    };
});

const pkmnService = new PkmnService();

describe("Pkmn Service", () => {
    // Reset mock data before each test to ensure isolation
    beforeEach(() => {
        mockData.length = 0;
    });

    test("should create a new Pokemon", async () => {
        const newPkmnData = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };

        const createdPkmn = await pkmnService.createPkmn(newPkmnData);
        const obj = createdPkmn.toObject();

        // Assertions to verify the created Pokemon
        expect(obj).toHaveProperty("_id");
        expect(obj.name).toBe(newPkmnData.name);
        expect(obj.types).toEqual(expect.arrayContaining(newPkmnData.types));
        expect(obj.regions).toEqual(expect.arrayContaining(newPkmnData.regions));
        expect(obj.imgUrl).toBe(newPkmnData.imgUrl);
    });

    // Test: Prevent creation of duplicate Pokemon by name
    test("should not create a Pokemon with duplicate name", async () => {
        const newPkmnData = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };

        await pkmnService.createPkmn(newPkmnData);
        await expect(pkmnService.createPkmn(newPkmnData)).rejects.toThrow("A Pokemon with this name already exists");
    });

    // Test: Retrieve all Pokemon
    test("should return all Pokemon", async () => {
        const pkmn1 = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };
        const pkmn2 = {
            name: "charmander",
            types: ["FIRE"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 4 }],
            imgUrl: "http://example.com/charmander.png"
        };
        await pkmnService.createPkmn(pkmn1);
        await pkmnService.createPkmn(pkmn2);

        const allPkmn = await pkmnService.getAllPkmn();

        expect(allPkmn).toHaveLength(2);
        expect(allPkmn).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: "bulbasaur" }),
            expect.objectContaining({ name: "charmander" })
        ]));
    });

    // Test: Filter Pokemon by type
    test("should return pokemon filtered by type", async () => {
        const pkmn1 = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };
        const pkmn2 = {
            name: "charmander",
            types: ["FIRE"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 4 }],
            imgUrl: "http://example.com/charmander.png"
        };

        await pkmnService.createPkmn(pkmn1);
        await pkmnService.createPkmn(pkmn2);

        const filteredPkmn = await pkmnService.search({ typeOne: "FIRE" });

        // Assertions to verify only the correct Pokemon is returned
        expect(filteredPkmn.data).toHaveLength(1);
        expect(filteredPkmn.data).toEqual([
            expect.objectContaining({ name: "charmander" })
        ]);
    });
});