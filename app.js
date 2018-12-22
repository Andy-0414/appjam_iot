const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const fs = require('fs')
var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser()); // 쿠키파서
app.use(express.static('public')); // 정적 파일

app.use(function (err, req, res, next) {
    res.status(500).send("ERROR");
});

app.listen(3000,()=>{
    console.log("Serve OPEN");
})
app.get('/',(req,res)=>{
    res.render("index")
})
app.post('/sendData',(req,res)=>{ // horu : 시간
    console.log(req.body)
    fs.readFile('public/data.json',(err,data)=>{
        var msg = "OK"
        var status = 200
        if (data) {
            var jsonData = JSON.parse(data);
            var hour = parseInt(req.body.hour)
            if (!hour || hour == NaN || hour > 24 || hour < 1){
                msg = "FAIL"
                status = 400
            }
            else{
                var idx = req.body.hour - 1
                jsonData[idx].data++;
            }
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
            res.status(status).send(msg).end()
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