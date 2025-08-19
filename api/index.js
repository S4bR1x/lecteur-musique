const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route /songs
app.get("/api/songs", (req, res) => {
  const musicDir = path.join(__dirname, '..', 'public', 'music');
  const coversDir = path.join(__dirname, '..', 'public', 'covers');

  fs.readdir(musicDir, (err, files) => {
    if (err) {
      console.error("Erreur lecture dossier musique:", err);
      return res.status(500).json({ error: "Erreur lecture dossier musique" });
    }

    const songData = {
      "billie eillish.mp3": { 
        artist: "Billie Eillish", 
        cover: "/covers/Couverture Billie Eilish.jpg" 
      },
      "it's not over until I win.mp3": { 
        artist: "Motivation", 
        cover: "/covers/Hommage à Muhammad Ali couverture.webp" 
      },
      "Lady Gaga, Bruno Mars .mp3": { 
        artist: "Bruno Mars", 
        cover: "/covers/Lady Gaga Bruno Mars cover.webp" 
      },
      "SOIS PAS TIMIDE.mp3": { 
        artist: "Gims", 
        cover: "/covers/Sois Pas Timide Cover.jpg" 
      },
    };

    const songs = files
      .filter(file => file.toLowerCase().endsWith(".mp3"))
      .map(file => ({
        name: file.replace(/\.mp3$/i, ""),
        filename: `/music/${encodeURIComponent(file)}`,
        artist: songData[file]?.artist || "Unknown",
        cover: songData[file]?.cover || "/covers/default.jpg"
      }));

    res.json(songs);
  });
});

// Route pour la page d'accueil
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Démarrer le serveur uniquement en local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
