const express=require('express');
//// ada 2 cara mengambil fungsi
///cara pertama
//const planetController=require('./planets.controller');
////cara kedua
const{
httpGetAllPlanets
}=require('./planets.controller');

const planetRouter=express.Router();

planetRouter.get('/',httpGetAllPlanets);

module.exports=planetRouter;