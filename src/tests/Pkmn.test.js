const PkmnService = require("../services/pkmn.service");
const pkmnService = new PkmnService();
const mongoose = require("mongoose");

describe("Pkmn Service", () => {
    beforeAll(async () => {
        // Connect to the test database before running any tests
        await mongoose.connect("mongodb://127.0.0.1:27017/td_test");
    });
    // Clean the collection before each test to ensure isolation (No double Pokemon and so test failed)
    beforeEach(async () => {
        await mongoose.connection.collection("pkmns").deleteMany({}); // lowercase + plural by default with Mongoose, so for  ex model Pkmn = "Pkmn" => "pkmns"
    });

    test("should create a new Pokemon", async () => {
        const newPkmnData = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };

        const createdPkmn = await pkmnService.createPkmn(newPkmnData);

        // ensure there is no fake positives
        const obj = createdPkmn.toObject();
        // Exemple
        // Expected: ArrayContaining [{"regionName": "Kanto", "regionPokedexNumber": 1}]   
        // Received: [{"regionName": "Kanto", "regionPokedexNumber": 1}]

        expect(obj).toHaveProperty("_id");
        expect(obj.name).toBe(newPkmnData.name);
        expect(obj.types).toEqual(expect.arrayContaining(newPkmnData.types));
        expect(obj.regions).toEqual(expect.arrayContaining(newPkmnData.regions));
        expect(obj.imgUrl).toBe(newPkmnData.imgUrl);
    });
    test("should not create a Pokemon with duplicate name", async () => {
        const newPkmnData = {
            name: "bulbasaur",
            types: ["GRASS", "POISON"],
            regions: [{ regionName: "Kanto", regionPokedexNumber: 1 }],
            imgUrl: "http://example.com/bulbasaur.png"
        };

        await pkmnService.createPkmn(newPkmnData);

        // Try to create the same Pokemon again
        await expect(pkmnService.createPkmn(newPkmnData)).rejects.toThrow("A Pokemon with this name already exists");
    });
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

        expect(filteredPkmn.data).toHaveLength(1);
        expect(filteredPkmn.data).toEqual([expect.objectContaining({ name: "charmander" })]);
    });

    afterAll(async () => {
        //! Close the connection after all tests are done
        await mongoose.connection.close();
    });
});