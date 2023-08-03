const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors")
const app = express();
const port = 3000;

app.use(cors())
const url = 'https://kun.uz';

app.get('/kunuz-small-news', (req, res) => {
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const result = [];

            $('div.top-news__small-items > div.row > div.col-md-6 > div.small-news').each((index, element) => {
                const imgSrc = $(element).find('a.small-news__img > img').attr('src');
                const date = $(element).find('div.news-meta > span').text()
                const title = $(element).find('div.small-news__content > a.small-news__title').text();
                const description = $(element).find('div.small-news__content > div.small-news__description').text();

                result.push({
                    imgSrc: imgSrc,
                    date: date,
                    title: title,
                    description: description
                });
            });

            // Bu joyda API-ga yuborishni bajaramiz
            // result ma'lumotlarini JSON formatda qaytarish
            res.json(result);
        })
        .catch(error => {
            console.log('Xato yuz berdi:', error);
            res.status(500).json({ error: 'Server xatosi yuz berdi.' });
        });
});

app.listen(port, () => {
    console.log(`Server http://localhost:${port} portida ishga tushdi.`);
});

