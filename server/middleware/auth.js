const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decodedToken', decodedToken);
    req.user = decodedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed!' });
  }
};

const authUser = (req, res, next) => {
  auth(req, res, () => {
    console.log('req.user', req.user);
    if (req.user.role === 'user' || req.user.role === 'asha' || req.user.role === 'local_admin' || req.user.role === 'state_official') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not a user.' });
    }
  });
};

const authDoctor = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === 'doctor') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not a doctor.' });
    }
  });
};

const authAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not an admin.' });
    }
  });
};

module.exports = { authUser, authDoctor, authAdmin };