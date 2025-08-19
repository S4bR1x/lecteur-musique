const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const serverless = require("serverless-http");

const app = express();

app.use(cors());

// Dossiers music et covers
const musicDir = path.join(__dirname, "../music");
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir);

const coverDir = path.join(__dirname, "../covers");
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir);

// Fichiers statiques
app.use("/music", express.static(musicDir));
app.use("/covers", express.static(coverDir));

// Multer pour upload
const storage = multer.diskStorage({
  destination: musicDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Données chansons
const songData = {
  "billie eillish.mp3": { artist: "Billie Eillish", cover: "/covers/Couverture Billie Eilish.jpg" },
  "it's not over until I win.mp3": { artist: "motivation", cover: "/covers/Hommage à Muhammad Ali couverture.webp" },
  "Lady Gaga, Bruno Mars .mp3": { artist: "Bruno Mars", cover: "/covers/Lady Gaga Bruno Mars cover.webp" },
  "SOIS PAS TIMIDE.mp3": { artist: "Gims", cover: "/covers/Sois Pas Timide Cover.jpg" },
};

// Route /songs
app.get("/songs", (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Erreur lecture dossier" });

    const songs = files
      .filter((file) => file.toLowerCase().endsWith(".mp3"))
      .map((file) => ({
        name: file.replace(/\.mp3$/i, ""),
        url: `/music/${file}`,
        artist: songData[file]?.artist || "Unknown",
        cover: songData[file]?.cover || "/covers/default.jpg",
      }));

    res.json(songs);
  });
});

// Route upload
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Fichier audio uploadé !", filename: req.file.filename });
  });
});

module.exports = app;
module.exports.handler = serverless(app);