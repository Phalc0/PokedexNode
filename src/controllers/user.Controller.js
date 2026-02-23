const userService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ message: 'Utilisateur créé', userId: user._id });
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await userService.loginUser(req.body);
    res.status(200).json(data);
  } catch(err) {
    res.status(401).json({ message: err.message });
  }
};

exports.checkUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.auth.userId);
    res.status(200).json({ user });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};