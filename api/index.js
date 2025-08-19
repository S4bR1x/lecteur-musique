const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const serverless = require("serverless-http");

const app = express();
app.use(cors());

// Racine du projet
const projectRoot = path.join(__dirname, "..", "public"); 

// Dossiers statiques
const musicDir = path.join(projectRoot, "music");
const coverDir = path.join(projectRoot, "covers");

// Créer les dossiers si absent
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir);
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir);

// Servir les fichiers statiques
app.use("/music", express.static(musicDir));
app.use("/covers", express.static(coverDir));

// Multer pour l'upload (local uniquement)
const storage = multer.diskStorage({
  destination: musicDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Données chansons (à adapter selon tes fichiers)
const songData = {
  "billie eillish.mp3": { artist: "Billie Eillish", cover: "Couverture Billie Eilish.jpg" },
  "it's not over until I win.mp3": { artist: "Motivation", cover: "Hommage à Muhammad Ali couverture.webp" },
  "Lady Gaga, Bruno Mars .mp3": { artist: "Bruno Mars", cover: "Lady Gaga Bruno Mars cover.webp" },
  "SOIS PAS TIMIDE.mp3": { artist: "Gims", cover: "Sois Pas Timide Cover.jpg" },
};

// Route /songs
app.get("/songs", (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Erreur lecture dossier" });

    const songs = files
      .filter(file => file.toLowerCase().endsWith(".mp3"))
      .map(file => ({
        name: file.replace(/\.mp3$/i, ""),
        filename: file,
        artist: songData[file]?.artist || "Unknown",
        cover: songData[file]?.cover || "default.jpg"
      }));

    res.json(songs);
  });
});

// Route upload (local uniquement)
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Fichier audio uploadé !", filename: req.file.filename });
  });
});

module.exports = app;
module.exports.handler = serverless(app);