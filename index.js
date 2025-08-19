const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(cors());

// Vérifier si le dossier music existe, sinon le créer
const musicDir = path.join(__dirname, "music");
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir);

// Vérifier si le dossier covers existe, sinon le créer
const coverDir = path.join(__dirname, "covers");
if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir);

// Définir le dossier des fichiers statiques
app.use("/music", express.static(musicDir));
app.use("/covers", express.static(coverDir));
app.use(express.static(__dirname));

// Stockage Multer pour l’upload
const storage = multer.diskStorage({
  destination: musicDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Exemple de données des chansons (à adapter selon tes fichiers)
const songData = {
  "billie eillish.mp3": { artist: "Billie Eillish", cover: "/covers/Couverture Billie Eilish.jpg" },
  "it's not over until I win.mp3": { artist: "motivation", cover: "/covers/Hommage à Muhammad Ali couverture.webp" },
  "Lady Gaga, Bruno Mars .mp3": { artist: "Bruno Mars", cover: "/covers/Lady Gaga Bruno Mars cover.webp" },
  "musique-relax.mp3": { artist: "relax", cover: "/covers/istockphoto-1550071750-612x612.jpg" },
  "SOIS PAS TIMIDE.mp3": { artist: "Gims", cover: "/covers/Sois Pas Timide Cover.jpg" },
  "pomodoro-song.mp3": { artist: "Pomodoro", cover: "/covers/Album cover with rain.jpeg" },
};

// Récupérer la liste des chansons
app.get("/songs", (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Erreur lecture dossier" });

    const songs = files
      .filter((file) => file.toLowerCase().endsWith(".mp3"))
      .map((file) => ({
        name: file.replace(/\.mp3$/i, ""),
        url: `${req.protocol}://${req.headers.host}/music/${file}`,
        artist: songData[file]?.artist || "Unknown",
        cover: songData[file]?.cover || "/covers/default.jpg",
      }));

    res.json(songs);
  });
});

// Upload musique
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Fichier audio uploadé !", filename: req.file.filename });
  });
});

// Servir le frontend
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => console.log(`🎵 Serveur lancé sur http://localhost:${PORT}`));