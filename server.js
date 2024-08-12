const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 80;

dirname = path.resolve(path.dirname(''));

app.use(express.static(`${dirname}`));

app.get("/", async (req, res) => {
    res.sendFile(`${dirname}/index.html`);
});

//Our map loads in the markers everytime the website is loaded.
//If we make changes to markers.json and redirect back to map,
//similar to below, then our new markers will also load.
app.post("/addmarker", async (req, res) => {
    res.sendFile(`{dirname}/index.html`);
});

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})