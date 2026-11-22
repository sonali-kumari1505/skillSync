const Skill = require('../models/Skill');

// @desc    Get all skills / search skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const { category, search, limit = 50 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const skills = await Skill.find(query).sort({ popularity: -1, name: 1 }).limit(Number(limit));

    res.status(200).json({ success: true, count: skills.length, skills });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res, next) => {
  try {
    const { name, category, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    let skill = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (skill) {
      return res.status(400).json({ success: false, message: 'Skill already exists in the directory' });
    }

    skill = await Skill.create({
      name: name.trim(),
      category: category || 'Programming & Tech',
      description: description || ''
    });

    res.status(201).json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};
