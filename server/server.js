const path = require('path');
const hbs = require('hbs');
const express = require('express')
let app = express();

const pulbicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(pulbicPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
});