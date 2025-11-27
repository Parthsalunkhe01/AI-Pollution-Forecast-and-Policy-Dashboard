router.post("/:id/comments", authenticateJWT, async (req, res, next) => {
  try {
    const c = await prisma.comment.create({
      data: {
        reportId: req.params.id,
        userId: req.userId,
        text: req.body.text
      }
    });
    res.json(c);
  } catch (err) { next(err); }
});
