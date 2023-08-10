const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require("cors")
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
// hududlar
const Toshkent = require('./routes/ToshkentCity')
const Navoiy = require('./routes/Navoi')
const Jizzax = require('./routes/Jizzax')
const Xorazm = require('./routes/Xorazm')
const ToshkentViloyati = require('./routes/Toshkent')
const Karakalpak = require('./routes/Qoraqalpogiston')
const Surxondaryo = require('./routes/Surxondaryo')
const Samarqand = require('./routes/Samarqand')
const Qashqadaryo = require('./routes/Qashqadaryo')
const Sirdaryo = require('./routes/Sirdaryo')
const Namangan = require('./routes/Namangan')
const Bukhara = require('./routes/Buxoro')
const andijon = require('./routes/Andijon')
const fargona = require('./routes/Fargona')
// bolimlar
const FanTexnika = require('./routes/FanTexnika')
const UzbekistanNews = require('./routes/UzbekistanNews')
const Jaxon = require('./routes/Jaxon')
const Ixsodiot = require('./routes/Ixsodiot')
const NuqtaiNazar = require('./routes/NuqtaiNazar')
const Sport = require('./routes/Sport')
const Jamiyat = require('./routes/JamiyatNews')
const IndexNews = require('./routes/IndexNews')


app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


// bolimlar uchun yangiliklar
app.use('/fan-texnika', FanTexnika);
app.use('/uzbekistan-news', UzbekistanNews);
app.use('/jaxon', Jaxon);
app.use('/ixsodiot', Ixsodiot);
app.use('/nuqtai-nazar', NuqtaiNazar);
app.use('/sport', Sport);
app.use('/index', IndexNews);
app.use('/jamiyat', Jamiyat);


// hududlar uchun yangiliklar 
app.use('/fargona-news', fargona);
app.use('/toshkentcity-news', Toshkent);
app.use('/navoiy-news', Navoiy);
app.use('/jizzax-news', Jizzax);
app.use('/xorazm-news', Xorazm);
app.use('/toshkent-news', ToshkentViloyati);
app.use('/qoraqalpogiston-news', Karakalpak);
app.use('/surxondaryo-news', Surxondaryo);
app.use('/samarqand-news', Samarqand);
app.use('/qashqadaryo-news', Qashqadaryo);
app.use('/sirdaryo-news', Sirdaryo);
app.use('/namangan-news', Namangan);
app.use('/buxoro-news', Bukhara);
app.use('/andijon-news', andijon);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});






app.listen(port, () => {
    console.log(`Server http://localhost:${port} portida ishga tushdi.`);
});

