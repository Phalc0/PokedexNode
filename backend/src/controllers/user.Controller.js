const UserService = require('../services/auth.service');
const userService = new UserService();
const jwt = require('jsonwebtoken');


// Register a new user
exports.register = async (req, res) => {
    console.log(req.body);
    try {
        let user = await userService.createUser(req.body);
        res.status(201).json({ message: "User created successfully", userId: user._id });
    } catch (err) {
        console.error("Erreur création utilisateur :", err); // <-- log complet
        res.status(400).json({ message: "Error creating user", error: err.message || err });
    }
}

// Login a user
exports.login = async (req, res) => {
    try {
        // 1 - Get user by email
        let user = await userService.getUserByEmail(req.body.email)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2 - Validate the password
        const isValid = await userService.verifyPassword(req.body.password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // 3 - Generate JWT token (payload: userId, private key: TOKEN_SECRET, option)
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: token });
    }
    catch (err) {
        console.error("Erreur connexion utilisateur :", err);
        res.status(400).json({ message: "Error logging in", error: err });
    }
};

exports.checkToken = async (req, res) => {
    res.sendStatus(204);
};