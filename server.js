const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 80;

dirname = path.resolve(path.dirname(''));

app.use(express.json());

app.use(express.static(`${dirname}`));

app.get("/", async (req, res) => {
    res.sendFile(`${dirname}/index.html`);
});

app.post("/updateMarkers", async (req, res) => {
    console.log("Received request to update markers."); 

    const newMarkersList = req.body;

    const markersFilePath = path.join(dirname, 'map', 'markers.json');

    fs.writeFile(markersFilePath, JSON.stringify(newMarkersList, null, 2), (err) => {
        if (err) {
            console.error('Error writing to markers.json:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("Markers successfully updated.");
            res.status(200).send('Markers updated successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on ${port}`);
});
