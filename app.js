const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // 쿠키파서
app.use(express.static('public')); // 정적 파일

app.listen(3000,()=>{
    console.log("Serve OPEN");
})

