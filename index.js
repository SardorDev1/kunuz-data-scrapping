const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors")
const app = express();
const port = 3000;

app.use(cors())
const url = 'https://kun.uz/news/category/tehnologia';

app.get('/', (req, res) => {
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const result = [];

            $('div.row > div.col-md-4 > div.news').each((index, element) => {
                const imgSrc = $(element).find('a.news__img > img').attr('src');
                const date = $(element).find('div.news-meta > span').text()
                const title = $(element).find('a.news__title').text();
                const link = $(element).find('a.news__title').attr('href');
              

                result.push({
                    imgSrc: imgSrc,
                    date: date,
                    title: title,
                    link: link
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

