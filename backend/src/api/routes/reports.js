const router = require("express").Router();
const prisma = require("../config/prisma");
const { authenticateJWT } = require("../middleware/auth");
const { uploadBase64Image } = require("../services/s3Service");

// CREATE REPORT
router.post("/", authenticateJWT, async (req, res, next) => {
  try {
    const { title, description, city, lat, lon, aqiSnapshot, safeHours, imageBase64 } = req.body;

    let imageUrl = null;
    if (imageBase64) imageUrl = await uploadBase64Image(imageBase64);

    const report = await prisma.report.create({
      data: {
        userId: req.userId,
        title,
        description,
        city,
        lat,
        lon,
        aqiSnapshot,
        safeHours,
        imageUrl,
      }
    });

    res.json(report);
  } catch (err) { next(err); }
});
// GET FEED
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: { select: { displayName: true } },
        comments: true,
        likes: true
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    res.json(reports);
  } catch (err) { next(err); }
});

// SINGLE REPORT
router.get("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id },
      include: { user: true, comments: true, likes: true }
    });

    if (!report) return res.status(404).json({ message: "Not found" });
    res.json(report);
  } catch (err) { next(err); }
});

// UPDATE REPORT
router.put("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ message: "Not found" });
    if (report.userId !== req.userId) return res.status(403).json({ message: "Forbidden" });

    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE REPORT
router.delete("/:id", authenticateJWT, async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ message: "Not found" });
    if (report.userId !== req.userId) return res.status(403).json({ message: "Forbidden" });

    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
