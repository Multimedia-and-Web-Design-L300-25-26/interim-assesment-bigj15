// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private (requires JWT)
const getProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = req.user;

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { getProfile };
