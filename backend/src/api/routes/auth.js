const router = require("express").Router();
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { signAccessToken, signRefreshToken } = require("../middleware/auth");

// SIGNUP
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, passwordHash: hash, displayName }
    });

    const accessToken = signAccessToken(newUser);
    const { token, expiresAt } = signRefreshToken(newUser);

    await prisma.refreshToken.create({
      data: { token, userId: newUser.id, expiresAt }
    });

    res.json({ user: newUser, accessToken, refreshToken: token });
  } catch (err) {
    next(err);
  }
});
// LOGIN
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const { token, expiresAt } = signRefreshToken(user);

    await prisma.refreshToken.create({
      data: { token, userId: user.id, expiresAt }
    });

    res.json({ user, accessToken, refreshToken: token });
  } catch (err) {
    next(err);
  }
});

// REFRESH TOKEN
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!dbToken) return res.status(401).json({ message: "Invalid refresh token" });
    if (dbToken.expiresAt < new Date())
      return res.status(401).json({ message: "Refresh token expired" });

    const user = await prisma.user.findUnique({
      where: { token: refreshToken }
    });
 if (!dbToken) return res.status(401).json({ message: "Invalid refresh token" });
    if (dbToken.expiresAt < new Date())
      return res.status(401).json({ message: "Refresh token expired" });

    user = await prisma.user.findUnique({ where: { id: dbToken.userId } });

    const accessToken = signAccessToken(user);
    const { token: newRefresh, expiresAt } = signRefreshToken(user);

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { token: newRefresh, expiresAt }
    });

    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
