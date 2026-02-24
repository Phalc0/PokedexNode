// Import TrainerService and Mongoose (not used, since we mock the models)
const TrainerService = require("../services/trainer.service");
const mongoose = require("mongoose");

// Mock the models used by TrainerService
jest.mock("../models/Trainer.model");
jest.mock("../models/User.model");
jest.mock("../models/Pkmn.model");

const trainerModel = require("../models/Trainer.model");
const userModel = require("../models/User.model");
const pkmnModel = require("../models/Pkmn.model");

// In-memory mock data
const mockUsers = [];
const mockTrainers = [];
const mockPkmns = [];

// Mock implementation for userModel
userModel.findById = jest.fn(async (userId) => mockUsers.find(u => u._id === userId) || null);

// Mock implementation for trainerModel
trainerModel.findOne = jest.fn(async (query) => mockTrainers.find(t => t.username === query.username) || null);
trainerModel.findOneAndUpdate = jest.fn(async (query, data) => {
    const trainer = mockTrainers.find(t => t.username === query.username);
    if (trainer) {
        Object.assign(trainer, data);
        return trainer;
    }
    return null;
});
trainerModel.findOneAndDelete = jest.fn(async (query) => {
    const idx = mockTrainers.findIndex(t => t.username === query.username);
    if (idx !== -1) {
        return mockTrainers.splice(idx, 1)[0];
    }
    return null;
});
trainerModel.create = jest.fn(async (data) => {
    const trainer = { ...data, _id: `${data.username}-id`, save: async () => trainer };
    mockTrainers.push(trainer);
    return trainer;
});

// Mock implementation for pkmnModel
pkmnModel.findById = jest.fn(async (pkmnId) => mockPkmns.find(p => p._id === pkmnId) || null);

const trainerService = new TrainerService();

describe("Trainer Service", () => {
    // Reset mock data before each test
    beforeEach(() => {
        mockUsers.length = 0;
        mockTrainers.length = 0;
        mockPkmns.length = 0;
    });

    test("should create a new trainer", async () => {
        mockUsers.push({ _id: "user1", username: "ash" });
        const data = { trainerName: "Ash Ketchum", imgUrl: "http://example.com/ash.png" };
        const trainer = await trainerService.createTrainer("user1", data);
        expect(trainer).toHaveProperty("_id");
        expect(trainer.username).toBe("ash");
        expect(trainer.trainerName).toBe(data.trainerName);
        expect(trainer.imgUrl).toBe(data.imgUrl);
        expect(trainer.pkmnSeen).toEqual([]);
        expect(trainer.pkmnCatched).toEqual([]);
    });

    test("should not create a trainer if trainer already exists", async () => {
        mockUsers.push({ _id: "user1", username: "ash" });
        mockTrainers.push({ username: "ash" });
        const data = { trainerName: "Ash Ketchum", imgUrl: "http://example.com/ash.png" };
        await expect(trainerService.createTrainer("user1", data)).rejects.toThrow("A trainer profile already exists for this user");
    });

    test("should get trainer by user id", async () => {
        mockUsers.push({ _id: "user1", username: "ash" });
        mockTrainers.push({ username: "ash", trainerName: "Ash Ketchum" });
        const trainer = await trainerService.getTrainerById("user1");
        expect(trainer.username).toBe("ash");
        expect(trainer.trainerName).toBe("Ash Ketchum");
    });


    test("should mark a pokemon as seen and catched", async () => {
        mockUsers.push({ _id: "user1", username: "ash" });
        mockTrainers.push({ username: "ash", pkmnSeen: [], pkmnCatched: [], save: async function() { return this; } });
        // Use a valid MongoDB ObjectId string
        const validPkmnId = "507f1f77bcf86cd799439011";
        mockPkmns.push({ _id: validPkmnId });
        const trainer = await trainerService.markPkmn("user1", validPkmnId, true);
        expect(trainer.pkmnSeen).toContain(validPkmnId);
        expect(trainer.pkmnCatched).toContain(validPkmnId);
    });

    test("should mark a pokemon as seen only (not catched)", async () => {
        mockUsers.push({ _id: "user1", username: "ash" });
        mockTrainers.push({ username: "ash", pkmnSeen: [], pkmnCatched: [], save: async function() { return this; } });
        // Use a valid MongoDB ObjectId string
        const validPkmnId = "507f1f77bcf86cd799439011";
        mockPkmns.push({ _id: validPkmnId });
        const trainer = await trainerService.markPkmn("user1", validPkmnId, false);
        expect(trainer.pkmnSeen).toContain(validPkmnId);
        expect(trainer.pkmnCatched).not.toContain(validPkmnId);
    });
});
