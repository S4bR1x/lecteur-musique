const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// Route /songs
app.get("/", (req, res) => {
  const musicDir = path.join(process.cwd(), "public", "music"); // chemin sûr sur Vercel

  fs.readdir(musicDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Erreur lecture dossier" });

    const songData = {
      "billie eillish.mp3": { artist: "Billie Eillish", cover: "Couverture Billie Eilish.jpg" },
      "it's not over until I win.mp3": { artist: "Motivation", cover: "Hommage à Muhammad Ali couverture.webp" },
      "Lady Gaga, Bruno Mars .mp3": { artist: "Bruno Mars", cover: "Lady Gaga Bruno Mars cover.webp" },
      "SOIS PAS TIMIDE.mp3": { artist: "Gims", cover: "Sois Pas Timide Cover.jpg" },
    };

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

module.exports = app;