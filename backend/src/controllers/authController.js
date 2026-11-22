const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillsync_jwt_super_secret_key_123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new student user & initialize default profile
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, college, department, academicYear } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === 'admin' ? 'admin' : 'student',
      isVerified: true
    });

    // Create student profile record
    const profile = await StudentProfile.create({
      user: user._id,
      college: college || 'University Campus',
      department: department || 'General Studies',
      academicYear: academicYear || '1st Year',
      headline: 'Passionate learner & skill sharer',
      bio: 'Excited to exchange knowledge and collaborate on real-world projects.',
      teachSkills: [],
      learnSkills: [],
      interests: [],
      availability: ['Weekdays Evenings', 'Weekends']
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & verify 5 control-flow decision branches (Experiment 10)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Branch 1: Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Branch 2: Check account lockout threshold
    if (user.isLocked || user.failedLoginAttempts >= 5) {
      return res.status(423).json({
        success: false,
        message: 'Account locked due to consecutive failed attempts. Contact admin.'
      });
    }

    // Branch 3: Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is not verified yet. Please check your verification email.'
      });
    }

    // Branch 4: Check suspension
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an administrator.'
      });
    }

    // Branch 5: Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
      }
      await user.save();
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        remainingAttempts: Math.max(0, 5 - user.failedLoginAttempts)
      });
    }

    // Successful login branch
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lastLogin = new Date();
    await user.save();

    const profile = await StudentProfile.findOne({ user: user._id });
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user & profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await StudentProfile.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Password updated successfully', token });
  } catch (error) {
    next(error);
  }
};
