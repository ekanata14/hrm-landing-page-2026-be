const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
  return { accessToken, refreshToken };
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    constuser = await User.findOne({ where: { username } });

    if (!constuser) {
      // Create default admin if not exists (for setup purposes)
      if (username === "admin" && password === "admin123") {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const newUser = await User.create({
          username: "admin",
          password: hashedPassword,
          role: "admin",
        });
        const tokens = generateTokens(newUser);
        return res.json({
          success: true,
          ...tokens,
          user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
          },
        });
      }
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, constuser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const tokens = generateTokens(constuser);
    res.json({
      success: true,
      ...tokens,
      user: {
        id: constuser.id,
        username: constuser.username,
        role: constuser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const verified = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(verified.id);
    if (!user)
      return res
        .status(403)
        .json({ success: false, message: "User not found" });

    const tokens = generateTokens(user);
    res.json({ success: true, ...tokens });
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid Refresh Token" });
  }
};
