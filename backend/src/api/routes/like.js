router.post("/:id/like", authenticateJWT, async (req, res, next) => {
  try {
    const existing = await prisma.like.findUnique({
      where: { userId_reportId: { userId: req.userId, reportId: req.params.id } }
    });

    if (existing) {
      await prisma.like.delete({
        where: { userId_reportId: { userId: req.userId, reportId: req.params.id } }
      });
    } else {
      await prisma.like.create({
        data: { userId: req.userId, reportId: req.params.id }
      });
    }

    const count = await prisma.like.count({ where: { reportId: req.params.id } });
    res.json({ likes: count });
  } catch (err) { next(err); }
});

