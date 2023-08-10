const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors");

const app = express();
app.use(cors());

const router = express.Router();
const url = 'https://kun.uz/news/category/tehnologia';

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
                const contentView = $content('div.single-header__meta > div.view').text();
                const ContentTitle = $content('div.single-header > h1.single-header__title').text();
                const Desc = $content('div.single-content > p > strong').text();
                const ContentVideo = $content('div.single-content > figure.iframe > iframe').attr('src');
                const ContentimageMain = $content('div.single-content > div.main-img > img').attr('src');

                // Collect all the Contentimages links into an array
                const ContentimagesArray = [];
                $content('div.single-content > p > img, div.single-content > figure.image > img').each((index, element) => {
                    const imageSrc = $content(element).attr('src');
                    if (imageSrc) {
                        ContentimagesArray.push({
                            id: index + 1,
                            src: imageSrc
                        });
                    }
                });
                const newsText = [];
                $content('div.single-content > p').each((index, element) => {
                    const paragraphText = $content(element).text(); // Matn

                    if (paragraphText) {
                        const anchorText = $content(element).find('a').text(); // <a> tegidan keyingi matn
                        const anchorHtml = $content(element).find('a').prop('outerHTML'); // <a> tegining HTML
                        const modifiedText = anchorText ? paragraphText.replace(anchorHtml, anchorText) : paragraphText;

                        newsText.push({
                            id: index + 1,
                            text: modifiedText.trim()
                        }); 
                    }
                });
                const newsTextByOne = [];
                let combinedText = ''; // Barcha textlarni biriktiruvchi o'zgaruvchi
                
                $content('div.single-content > p').each((index, element) => {
                    const paragraphText = $content(element).text().trim(); // Matn
                
                    if (paragraphText) {
                        combinedText += paragraphText + ' '; // Barcha matnlarni biriktiramiz
                    }
                });
                
                // O'zgaruvchini trim() bilan oxiridagi bo'shliqni olib tashlaymiz
                newsTextByOne.push({
                    id: 1,
                    text: combinedText.trim()
                });



                const contentNews = {
                    date: contentDate,
                    views: contentView,

                    NewsMediaContent: {
                        ContentVideo: ContentVideo ? ContentVideo : "mavjud emas",
                        ContentImageMain: ContentimageMain ? ContentimageMain : "mavjud emas",
                        Contentimages: ContentimagesArray.length > 0 ? ContentimagesArray : "mavjud emas"

                    },
                    ContentText: {
                    
                        newsTextByGroup: newsText.length > 0 ? newsText : "mavjud emas",
                        newsTextByOne: newsTextByOne.length > 0 ? newsTextByOne : "mavjud emas"


                    },
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
            const linktoNews = `https://kun.uz${link}`


            const contentPromise = fetchContent(link);

            news.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: linktoNews,

                content: contentPromise // add content here
            });
        });
        $('div.top-news > div.top-news__big').each(async (index, element) => {
            const imgSrc = $(element).find('span.big-news__img > img').attr('src');
            const date = $(element).find('span.big-news__content > div.news-meta > span').text();
            const title = $(element).find('span.big-news__title').text();
            const link = $(element).find('a.big-news').attr('href');
            const descraption = $(element).find('span.big-news__description').text();
            const linktoNews = `https://kun.uz${link}`
            const contentPromise = fetchContent(link);

            resultBigNews.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: linktoNews,
                descraption: descraption,
                content: await contentPromise // add content here
            });
        });

        $('div.row > div.col-md-6 > div.small-news').each((index, element) => {
            const imgSrc = $(element).find('a.small-news__img > img').attr('src');
            const date = $(element).find('div.small-news__content > div.news-meta > span').text();
            const title = $(element).find('a.small-news__title').text();
            const link = $(element).find('a.small-news__title').attr('href');
            const linktoNews = `https://kun.uz${link}`

            const contentPromise = fetchContent(link);

            resultSmallNews.push({
                id: index + 1,
                imgSrc: imgSrc,
                date: date,
                title: title,
                link: linktoNews,
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
