const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planets.mongoo');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

//// review tentang promise ada di udemy bagian thread and blocking
/*
const promise = new Promise((resolve,reject)=>{
  resolve(42);
});
promise.then((result)=>{

});
const result = await promise;
console.log(result);
*/
function loadPlanetData(){
  return new Promise((resolve,reject)=>{
    const savedPlanet=[];
    fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
  .pipe(parse({
    comment: '#',
    columns: true,
  }))
  .on('data', async(data) => {
    if (isHabitablePlanet(data)) {
      savePlanet(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
    reject(err);
  })
  .on('end', async() => {
    await Promise.all(savedPlanet);
    const countPlanetFound= (await getAllPlanets()).length;

    console.log(`${countPlanetFound} habitable planets found!`);
    resolve();
  });
  });
}

async function getAllPlanets(){
  return await planets.find({},{
    "_id":0,"__v":0
  });
}

async function savePlanet(planet){
    try{
      //insert + update= upsert
    await planets.updateOne({
      keplerName:planet.kepler_name,
    },{
      keplerName:planet.kepler_name,
    },{
      upsert:true
    });

    // await planets.create({
    //   keplerName:data.keplerName,
    // });
    }
    catch(err){
      console.error(`Could not save planets ${err}`);
    }
    
}
module.exports={
  loadPlanetData, //// akan digunakan saat promise selesai terjadi
  getAllPlanets
};