router.post("/action", authenticateJWT, async (req, res, next) => {
  try {
    const { type, metadata } = req.body;

    const config = ACTION_CONFIG[type] || { credits: 1, footprintReduced: 0 };

    const action = await prisma.action.create({
      data: {
        userId: req.userId,
        type,
        metadata,
        creditsEarned: config.credits,
        footprintReduced: config.footprintReduced
      }
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        greenCredits: { increment: config.credits },
        totalFootprint: { decrement: config.footprintReduced }
      }
    });

    res.json(action);
  } catch (err) { next(err); }
});
// LEADERBOARD
router.get("/leaderboard", authenticateJWT, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { greenCredits: "desc" },
      take: 20,
      select: { displayName: true, greenCredits: true, totalFootprint: true }
    });
    res.json(users);
  } catch (err) { next(err); }
});
