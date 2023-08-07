const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors")
const app = express();
app.use(cors())
const router = express.Router();
const url = 'https://kun.uz/region/sirdaryo';

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const fetchContent = async (link) => {
            try {
                const contentResponse = await axios.get(`https://kun.uz${link}`);
                const contentHtml = contentResponse.data;
                const $content = cheerio.load(contentHtml);

                const contentDate = $content('div.single-header__meta > div.date').text();
                // Boshqa malumotlarni olish
                // ...

                const contentNews = {
                    date: contentDate,
                    // ... (boshqa malumotlar)
                };

                return contentNews;
            } catch (contentError) {
                console.error('Error fetching content:', contentError);
                return null;
            }
        };

        const news = [];
        const resultBigNews = [];
        const resultSmallNews = [];
        $('div.row > div.col-md-4 > div.news').each((index, element) => {
            const imgSrc = $(element).find('a.news__img > img').attr('src');
            const date = $(element).find('div.news-meta > span').text()
            const title = $(element).find('a.news__title').text();
            const link = $(element).find('a.news__title').attr('href');



            const contentPromise = fetchContent(link);

            news.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: link,

                content: contentPromise // add content here
            });
        });
        $('div.top-news > div.top-news__big').each((index, element) => {
            const imgSrc = $(element).find('span.big-news__img > img').attr('src');
            const date = $(element).find('span.big-news__content > div.news-meta > span').text();
            const title = $(element).find('span.big-news__title').text();
            const link = $(element).find('a.big-news').attr('href');
            const descraption = $(element).find('span.big-news__description').text();

            const contentPromise = fetchContent(link);

            resultBigNews.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: link,
                descraption: descraption,
                content: contentPromise // add content here
            });
        });

        $('div.row > div.col-md-6 > div.small-news').each((index, element) => {
            const imgSrc = $(element).find('a.small-news__img > img').attr('src');
            const date = $(element).find('div.small-news__content > div.news-meta > span').text();
            const title = $(element).find('a.small-news__title').text();
            const link = $(element).find('a.small-news__title').attr('href');

            const contentPromise = fetchContent(link);

            resultSmallNews.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: link,
                content: contentPromise // add content here
            });
        });

        await Promise.all([...news.map(async (item) => {
            item.content = await item.content;
        }), ...resultSmallNews.map(async (item) => {
            item.content = await item.content;
        }), ...resultSmallNews.map(async (item) => {
            item.content = await item.content;
        })]);

        const results = {
            Result: {
                news: news,
                resultBigNew: resultBigNews,
                resultSmallNews: resultSmallNews
            }
        };

        res.json(results);
    } catch (error) {
        console.log('Xato yuz berdi:', error);
        res.status(500).json({ error: 'Server xatosi yuz berdi.' });
    }
});

module.exports = router;
