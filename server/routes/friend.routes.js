const express = require('express');
const router = express.Router();
const { getFriends, addFriend, removeFriend } = require('../controllers/friend.controller');

router.get('/:userId', getFriends);
router.post('/:userId/add/:friendId', addFriend);
router.delete('/:userId/remove/:friendId', removeFriend);

module.exports = router;
