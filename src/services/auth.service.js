const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'monsecret123';

exports.registerUser = async ({ username, email, password, role }) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error('Username déjà utilisé');

  const user = new User({ username, email, password, role });
  await user.save();
  return user;
};

exports.loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Utilisateur non trouvé');

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Mot de passe incorrect');

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    SECRET,
    { expiresIn: '24h' }
  );

  return { token, userId: user._id, role: user.role };
};

exports.getUserById = async (id) => {
  return User.findById(id).select('-password');
};