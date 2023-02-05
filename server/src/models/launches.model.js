const axios=require('axios');
const { response } = require('../app');

const launchesDatabase = require('./launches.mongoo');
const planets=require('./planets.mongoo');

const DEFAULT_FLIGHT_NUMBER=100;

const launches=new Map();

/// cooment di samping untuk mapping dri spacex api (loadlaunchData)
const launch={
  flightNumber:100,//flight_number
  misson:"kepler exploration x",//name
  rocket:"EXPLORE IS1", //exists rocket.name
  launchDate:new Date('December 27, 2030'), //date_local
  target:"Kepler-442 b",// not applicable
  customer:['ZTM','NASA'], //payload.customers for each payload
  upcoming:true, //upcoming
  succes:true, //success
};

saveLunch(launch);

//ambil data di spacex untuk pagination
const SPACEX_API_URL='https://api.spacexdata.com/v4/launches/query';
async function loadLaunchData(){
  console.log("downloading launch data...");
  const responce= await axios.post(SPACEX_API_URL,{
    query:{},
    options:{
      populate:[  
        {
          path:'rocket',
          select:{
            name:1
          }
        },
        {
          path:'payloads',
          select:{
            'customers':1
          }
        }
      ]
    }
  });

  const launcDocs = responce.data.docs;
  for(const launchDoc of launcDocs ){
    const payloads=launchDoc['payloads'];
    const customers=payloads.flatMap((payload)=>{
      return payload['customers'];
    });

    const launch={
      flightNumber:launchDoc['flight_number'],
      mission:launchDoc['name'],
      rocket:launchDoc['rocket']['name'],
      launchDate:launchDoc['date_local'],
      upcoming:launchDoc['upcoming'],
      success:launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
}

async function existLaunchWithId(launchId){
  return await launchesDatabase.find({
    flightNumber:launchId,
  });
}

async function getLatestLaunches(){
  const lastestLaunch = await launchesDatabase
  .findOne()
  .sort('-flightNumber'); ///ascending sort

  if(!lastestLaunch){
    return DEFAULT_FLIGHT_NUMBER; ////  jika tidak ketemu akan mulai dari 100
  }
  return lastestLaunch.flightNumber;
}

async function getAllLaunches(){
  return await launchesDatabase.find({},{
    "_id":0,
    "__v":0 
  });   //{}untuk filter
}

//mongo jalan di async
async function saveLunch(launch){

  const planet= await planets.findOne({
    keplerName: launch.target,
  });

  if(!planet){
      throw new Error("No matching planet was found");
  }

  //// tekhnik upserts
  await launchesDatabase.findOneAndUpdate({
    flightNumber:launch.flightNumber,

  },launch,{
    upsert:true,
  });
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestLaunches() + 1;

  const newLaunch= Object.assign(launch,{
    succes:true,
    upcoming:true,
    customers:["Zero To mastery","Nasa"],
    flightNumber:newFlightNumber, 
  });

  await saveLunch(newLaunch);
}


async function abortLaunchById(launchId){
  const abort = await launchesDatabase.updateOne({
    flightNumber:launchId,
  },{
    $set: { success: false, upcoming: false },
  });
  console.log(abort);
  return abort.modifiedCount===1;
}

module.exports={
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
  loadLaunchData  
}