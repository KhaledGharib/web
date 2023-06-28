const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "https://statuesque-cuchufli-c71e7e.netlify.app",
    "http://localhost:3000",
  ]; // Add any other origins you want to allow
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/proxy/:query", (req, res) => {
  const query = req.params.query;
  const url = `https://3sktv.org/?s=${query}`;

  axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = [];

      $(".type_item_box").each(function () {
        const link = $(this).find("a").attr("href");
        const title = $(this).find("a").attr("title");
        const img = $(this).find(".item_img.imaged").attr("src");
        links.push({
          title,
          link,
          img,
        });
      });

      res.json(links);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error occurred while fetching data" });
    });
});

app.get("/proxy/:episodes", (req, res) => {
  const link = req.params.episodes; // Retrieve the selected link from the URL parameter
  const url = `https://web-4ra5.onrender.com/proxy/${link}`;

  axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = [];

      $(".season-episodes").each(function () {
        const link = $(this).find("a").attr("href");
        const title = $(this).find("span");
        const b = $(this).find("b");
        links.push({
          title,
          link,
          b,
        });
      });

      res.json(links);
    })
    .catch((error) => {
      res.status(500).json({ error: "Error occurred while fetching data" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
