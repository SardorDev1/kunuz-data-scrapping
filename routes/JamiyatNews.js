const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors")
const app = express();
app.use(cors())
const router = express.Router();
const url = 'https://kun.uz/news/category/jamiyat';

router.get('/', (req, res) => {
    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const news = [];
            const resultBigNews = [];
            const resultSmallNews = [];
            $('div.row > div.col-md-4 > div.news').each((index, element) => {
                const imgSrc = $(element).find('a.news__img > img').attr('src');
                const date = $(element).find('div.news-meta > span').text()
                const title = $(element).find('a.news__title').text();
                const link = $(element).find('a.news__title').attr('href');


                news.push({
                    id: index + 1,
                    imgSrc: imgSrc,
                    date: date,
                    title: title,
                    link: link
                });
            });
            $('div.top-news > div.top-news__big').each((index, element) => {
                const imgSrc = $(element).find('span.big-news__img > img').attr('src');
                const date = $(element).find('span.big-news__content > div.news-meta > span').text()
                const title = $(element).find('span.big-news__title').text();
                const link = $(element).find('a.big-news').attr('href');
                const descraption = $(element).find('span.big-news__description').text();

                resultBigNews.push({
                    id: index + 1,
                    imgSrc: imgSrc,
                    date: date,
                    title: title,
                    link: link,
                    descraption: descraption
                });
            });
            $('div.row > div.col-md-6 > div.small-news').each((index, element) => {
                const imgSrc = $(element).find('a.small-news__img > img').attr('src');
                const date = $(element).find('div.small-news__content > div.news-meta > span').text()
                const title = $(element).find('a.small-news__title').text();
                const link = $(element).find('a.small-news__title').attr('href');


                resultSmallNews.push({
                    id: index + 1,
                    imgSrc: imgSrc,
                    date: date,
                    title: title,
                    link: link

                });
            });

            const results = {

                Result: {
                    news: news,
                    resultBigNew: resultBigNews,
                    resultSmallNews: resultSmallNews
                }

            }

            res.json(results);

        })
        .catch(error => {
            console.log('Xato yuz berdi:', error);
            res.status(500).json({ error: 'Server xatosi yuz berdi.' });
        });
});
module.exports = router