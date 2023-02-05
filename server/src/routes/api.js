const express=require("express");

const planetRouter=require('./planets/planets.router');
const launchRouter=require('./launches/launches.router');

const api=express.Router();

api.use('/planets',planetRouter);/// cmn mau ke end point di bawah route tersebut ex:/plantes/1 atau /planets/
api.use('/launches',launchRouter);

module.exports=api;