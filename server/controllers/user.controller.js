const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'syncschedule_secret_key';

// POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user', error: err.message });
  }
};

// GET /api/users/search?username=
const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username query parameter is required' });
    }

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
    }).select('_id username email');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error searching users', error: err.message });
  }
};


// PUT /api/users/:id
// Supports updating username, email, and optionally password
const updateUser = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for username/email conflicts with other users
    if (username !== user.username || email !== user.email) {
      const conflict = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [{ username }, { email }],
      });
      if (conflict) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;

    // Handle password change if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Return a fresh token so the navbar username updates immediately
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating user', error: err.message });
  }
};



// DELETE /api/users/:id
// Also cleans up all schedules belonging to the user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user from all friends lists
    await User.updateMany(
      { friends: req.params.id },
      { $pull: { friends: req.params.id } }
    );

    // Delete all schedules belonging to this user
    await Schedule.deleteMany({ userId: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting user', error: err.message });
  }
};

// // PUT /api/users/:id
// const updateUser = async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { username, email },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({user});
//   } catch (err) {
//     res.status(500).json({ message: 'Server error updating user', error: err.message });
//   }
// };

// // DELETE /api/users/:id
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error deleting user', error: err.message });
//   }
// };

module.exports = { registerUser, loginUser, getUserById, searchUsers, updateUser, deleteUser };




// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { User } = require('../models');

// const JWT_SECRET = process.env.JWT_SECRET || 'syncschedule_secret_key';

// // POST /api/users/register
// const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username or email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, email, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.status(201).json({
//       token,
//       user: { _id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error during registration', error: err.message });
//   }
// };

// // POST /api/users/login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
//       expiresIn: '7d',
//     });

//     res.json({
//       token,
//       user: { _id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error during login', error: err.message });
//   }
// };

// // GET /api/users/:id
// const getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id)
//       .select('-password')
//       .populate('friends', 'username email');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error fetching user', error: err.message });
//   }
// };

// // GET /api/users/search?username=
// const searchUsers = async (req, res) => {
//   try {
//     const { username } = req.query;
//     if (!username) {
//       return res.status(400).json({ message: 'Username query parameter is required' });
//     }

//     const users = await User.find({
//       username: { $regex: username, $options: 'i' },
//     }).select('_id username email');

//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error searching users', error: err.message });
//   }
// };

// // PUT /api/users/:id
// const updateUser = async (req, res) => {
//   try {
//     const { username, email } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { username, email },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error updating user', error: err.message });
//   }
// };

// // DELETE /api/users/:id
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error deleting user', error: err.message });
//   }
// };

// module.exports = { registerUser, loginUser, getUserById, searchUsers, updateUser, deleteUser };
