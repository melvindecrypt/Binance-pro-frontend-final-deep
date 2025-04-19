const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your-strong-secret-here';

// Admin login route
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Replace with your admin credentials check
  if (username !== process.env.ADMIN_USER || !bcrypt.compareSync(password, process.env.ADMIN_HASH)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '2h' });
  res.json({ token });
};

// Protect admin routes
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  jwt.verify(token, ADMIN_SECRET, (err, user) => {
    if (err || user.role !== 'admin') return res.sendStatus(403);
    req.user = user;
    next();
  });
};