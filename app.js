const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const fs = require('fs')

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // body parser
app.use(cookieParser()); // 쿠키파서
app.use(express.static('public')); // 정적 파일

app.listen(3000,()=>{
    console.log("Serve OPEN");
})
app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/sendData/:hour',(req,res)=>{ // horu : 시간
    fs.readFile('public/data.json',(err,data)=>{
        if (data) {
            var jsonData = JSON.parse(data);
            jsonData[req.params.hour-1].data++;
        }
        else {
            var jsonData = []
            for(var i = 1; i <= 24; i++)
            {
                jsonData.push({
                    label : i + "시",
                    data : 0
                })
            }
        }
        fs.writeFile('public/data.json', JSON.stringify(jsonData), (err) => {
            res.send("OK")
        })
    })
})
app.get('/getData',(req,res)=>{
    fs.readFile('public/data.json', (err, data) => {
        var jsonData = JSON.parse(data);
        jsonData.sort((a,b)=>{
            return b.data - a.data
        })
        var sum = {
            label : "기타",
            data : 0
        };
        for (var i = 3; i < jsonData.length;i++)
        {
            sum.data += jsonData[i].data
        }
        res.send([jsonData[0], jsonData[1], jsonData[2],sum])
    })
})