/// disini dimana semua middleware di settings sebelum dipakai
const path =require('path');
const express =require('express');
const cors =require('cors');
const morgan = require('morgan');

const planetRouter=require('./routes/planets/planets.router');
const launchRouter=require('./routes/launches/launches.router');
const app=express();

////untuk beda origin
app.use(cors({
  origin:'http://localhost:3000'
}));

///// morgan harus di letakkan di paling atas dari semua middle ware tetapi di bawah middleware yg
//// berhubungan dengan security

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public'))); // untuk ambil hasil prod oleh front end

app.use('/planets',planetRouter);/// cmn mau ke end point di bawah route tersebut ex:/plantes/1 atau /planets/
app.use('/launches',launchRouter);

app.get('/*',(req,res)=>{ //// bintang untuk meloloskan semua route sehabis "/"
  res.sendFile(path.join(__dirname,'..','public','index.html')); ///untuk ambil hasil produuction frontend saat pertama run
})

module.exports=app;