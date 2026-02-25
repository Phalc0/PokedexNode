// tests/pkmnType.service.test.js
const PkmnTypeService = require("../services/PkmnType.service");
const pkmnTypeService = new PkmnTypeService();

describe("PkmnType Service", () => {
    test("getAllTypes return an array of strings", async () => {
        const types = await pkmnTypeService.getAllTypes();

        // Check if it's an array
        expect(Array.isArray(types)).toBe(true);

        // Check if each element is a string
        types.forEach(type => expect(typeof type).toBe("string"));

    });
    test('getAllTypes returns 18 types', async () => {
        const types = await pkmnTypeService.getAllTypes();

        console.log(types); // view 

        expect(types.length).toBe(18);
    });
});