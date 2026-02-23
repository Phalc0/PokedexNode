const userModel = require('../models/User.model');
const bcrypt = require('bcrypt');

class UserService {

    async createUser(userData) {
        let user;
        // Clone the incoming userData to avoid mutating the original object
        const clonedData = structuredClone(userData);
        try {
            // Lock admin creation via register
            clonedData.role = "user";
            
            // Hash the password
            const hash = await bcrypt.hash(clonedData.password, 10);
            clonedData.password = hash;

            // Create the user in the database
            user = await userModel.create(clonedData);
        } catch (err) {
            throw err;
        }

        return user;
    }

    async updateUser(userId, updateData) {
        try {
            const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
            return user;
        } catch (err) {
            throw err;
        }
    }

    async deleteUser(userId) {
        try {
            await userModel.findByIdAndDelete(userId);
            return { message: 'User deleted successfully' };
        } catch (err) {
            throw err;
        }
    }


    async getUserById(userId) {
        try {
            const user = await userModel.findById(userId);
            return user;
        } catch (err) {
            throw err;
        }
    }


    async getUserByEmail(email) {

        try {
            const user = await userModel.findOne({ email: email });
            return user;
        } catch (err) {
            throw err;
        }

    }

    async verifyPassword(password, hash) {
        try {
            const match = await bcrypt.compare(password, hash);
            return match;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = UserService;