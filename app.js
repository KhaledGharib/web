const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// CORS configuration
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

app.get("/proxy/:query", async (req, res) => {
  try {
    const query = req.params.query;
    const url = `https://3sktv.org/?s=${query}`;

    const response = await axios.get(url);
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
  } catch (error) {
    res.status(500).json({ error: "Error occurred while fetching data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
