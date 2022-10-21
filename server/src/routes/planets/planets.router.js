const express=require('express');
//// ada 2 cara mengambil fungsi
///cara pertama
//const planetController=require('./planets.controller');
////cara kedua
const{
  getAllPlanets
}=require('./planets.controller');

const planetRouter=express.Router();

planetRouter.get('/planets',getAllPlanets);

module.exports=planetRouter;