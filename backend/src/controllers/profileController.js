const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Skill = require('../models/Skill');

// @desc    Get currently logged in student profile
// @route   GET /api/profiles/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email role');
    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user.id,
        college: 'University Campus',
        department: 'General Studies',
        academicYear: '3rd Year'
      });
      profile = await profile.populate('user', 'name email role');
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's student profile
// @route   PUT /api/profiles/me
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const {
      college,
      department,
      academicYear,
      headline,
      bio,
      avatar,
      teachSkills,
      learnSkills,
      interests,
      availability,
      preferredMode,
      location,
      socialLinks
    } = req.body;

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    if (college !== undefined) profile.college = college;
    if (department !== undefined) profile.department = department;
    if (academicYear !== undefined) profile.academicYear = academicYear;
    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (avatar !== undefined) profile.avatar = avatar;
    if (teachSkills !== undefined) profile.teachSkills = teachSkills;
    if (learnSkills !== undefined) profile.learnSkills = learnSkills;
    if (interests !== undefined) profile.interests = interests;
    if (availability !== undefined) profile.availability = availability;
    if (preferredMode !== undefined) profile.preferredMode = preferredMode;
    if (location !== undefined) profile.location = location;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;

    await profile.save();
    profile = await profile.populate('user', 'name email role');

    // Also index newly added skills into Skill collection
    if (teachSkills && Array.isArray(teachSkills)) {
      for (const s of teachSkills) {
        if (s.skillName) {
          await Skill.findOneAndUpdate(
            { name: s.skillName.trim() },
            { $inc: { popularity: 1 }, category: s.category || 'Programming & Tech' },
            { upsert: true }
          );
        }
      }
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student profile by user ID
// @route   GET /api/profiles/:userId
// @access  Public
exports.getProfileById = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.params.userId }).populate('user', 'name email role');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a teach skill
// @route   POST /api/profiles/skills/teach
// @access  Private
exports.addTeachSkill = async (req, res, next) => {
  try {
    const { skillName, category, proficiencyLevel, yearsOfExperience, description } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const prof = Number(proficiencyLevel);
    if (prof < 1 || prof > 5) {
      return res.status(422).json({ success: false, message: 'Invalid rating range (1-5)' });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user.id, college: 'Campus', department: 'General' });
    }

    // Check if skill already exists in teachSkills
    const exists = profile.teachSkills.some((s) => s.skillName.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'Skill is already in your teaching list' });
    }

    profile.teachSkills.push({
      skillName: skillName.trim(),
      category: category || 'Programming & Tech',
      proficiencyLevel: prof,
      yearsOfExperience: yearsOfExperience || 1,
      description: description || ''
    });

    await profile.save();
    await Skill.findOneAndUpdate(
      { name: skillName.trim() },
      { $inc: { popularity: 1 }, category: category || 'Programming & Tech' },
      { upsert: true }
    );

    res.status(201).json({ success: true, teachSkills: profile.teachSkills });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a teach skill
// @route   DELETE /api/profiles/skills/teach/:skillName
// @access  Private
exports.removeTeachSkill = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.teachSkills = profile.teachSkills.filter(
      (s) => s.skillName.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );
    await profile.save();

    res.status(200).json({ success: true, teachSkills: profile.teachSkills });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a learn skill
// @route   POST /api/profiles/skills/learn
// @access  Private
exports.addLearnSkill = async (req, res, next) => {
  try {
    const { skillName, category, targetProficiency, priority, notes } = req.body;
    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await StudentProfile.create({ user: req.user.id, college: 'Campus', department: 'General' });
    }

    const exists = profile.learnSkills.some((s) => s.skillName.toLowerCase() === skillName.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: 'Skill is already in your learning list' });
    }

    profile.learnSkills.push({
      skillName: skillName.trim(),
      category: category || 'Programming & Tech',
      targetProficiency: targetProficiency || 3,
      priority: priority || 'medium',
      notes: notes || ''
    });

    await profile.save();

    res.status(201).json({ success: true, learnSkills: profile.learnSkills });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a learn skill
// @route   DELETE /api/profiles/skills/learn/:skillName
// @access  Private
exports.removeLearnSkill = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.learnSkills = profile.learnSkills.filter(
      (s) => s.skillName.toLowerCase() !== decodeURIComponent(skillName).toLowerCase()
    );
    await profile.save();

    res.status(200).json({ success: true, learnSkills: profile.learnSkills });
  } catch (error) {
    next(error);
  }
};

// @desc    Explore / search student profiles
// @route   GET /api/profiles
// @access  Public
exports.exploreProfiles = async (req, res, next) => {
  try {
    const { q, college, department, skill, minRating, mode, page = 1, limit = 12 } = req.query;

    const filter = {};

    // Don't show suspended users
    const suspendedUsers = await User.find({ isSuspended: true }).select('_id');
    const suspendedIds = suspendedUsers.map((u) => u._id);
    filter.user = { $nin: suspendedIds };

    // Exclude current logged in user if auth token present
    if (req.user && req.user.id) {
      filter.user = { $nin: [...suspendedIds, req.user.id] };
    }

    if (college) {
      filter.college = new RegExp(college, 'i');
    }
    if (department) {
      filter.department = new RegExp(department, 'i');
    }
    if (mode) {
      filter.preferredMode = mode;
    }
    if (minRating) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    if (skill) {
      filter.$or = [
        { 'teachSkills.skillName': new RegExp(skill, 'i') },
        { 'learnSkills.skillName': new RegExp(skill, 'i') }
      ];
    }

    if (q) {
      const qRegex = new RegExp(q, 'i');
      filter.$or = [
        { headline: qRegex },
        { bio: qRegex },
        { college: qRegex },
        { department: qRegex },
        { 'teachSkills.skillName': qRegex },
        { 'learnSkills.skillName': qRegex },
        { interests: qRegex }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await StudentProfile.countDocuments(filter);
    const profiles = await StudentProfile.find(filter)
      .populate('user', 'name email role')
      .sort({ averageRating: -1, completedExchanges: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      profiles
    });
  } catch (error) {
    next(error);
  }
};
