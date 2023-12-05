import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// Apply middlware for CORS and JSON endpoing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "static/frontend")));
app.use("/musics", express.static(path.join(__dirname, "static/musics")));
app.use("/images", express.static(path.join(__dirname, "static/images")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
