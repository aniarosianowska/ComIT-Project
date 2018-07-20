const express = require('express');
const app = express();
const port = 3000;
const siteRouter = require('./site');

app.set('view engine', 'pug');

app.use(express.static('public'));

app.use('/', siteRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});