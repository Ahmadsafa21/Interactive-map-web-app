const express = require("express");
const fs = require("fs");
const app = express();
const port = 80;

app.use(express.static(`${dirname}`));

app.get("/", async (req, res) => {
    res.sendFile(`${dirname}/index.html`);
});

app.listen(port, () => {
    console.log(`Example app listening on ${port}`)
})