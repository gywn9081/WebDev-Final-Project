const User = require('../models/User');

// GET /api/friends/:userId
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('friends')
      .populate('friends', '_id username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching friends', error: err.message });
  }
};

// POST /api/friends/:userId/add/:friendId
const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    if (userId === friendId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.json({ message: `${friend.username} added as a friend` });
  } catch (err) {
    res.status(500).json({ message: 'Server error adding friend', error: err.message });
  }
};

// This is both update and delete for a CRUD operation
// DELETE /api/friends/:userId/remove/:friendId
const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error removing friend', error: err.message });
  }
};

module.exports = { getFriends, addFriend, removeFriend };
