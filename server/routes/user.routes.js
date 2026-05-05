const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
