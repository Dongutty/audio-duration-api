import express from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";

const upload = multer({ dest: "/tmp" });
const app = express();

app.post("/duration", upload.single("file"), (req, res) => {
  const file = req.file.path;

  exec(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${file}`,
    (err, stdout) => {
      fs.unlinkSync(file);

      if (err) {
        return res.status(500).json({ error: "ffprobe failed" });
      }

      res.json({ durationSeconds: Number(stdout) });
    }
  );
});

app.listen(3000);
