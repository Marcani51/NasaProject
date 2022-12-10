const launchesDatabase = require('./launches.mongoo');
const planets=require('./planets.mongoo');

const DEFAULT_FLIGHT_NUMBER=100;

const   launches=new Map();

const launch={
  flightNumber:100,
  misson:"kepler exploration x",
  rocket:"EXPLORE IS1",
  launchDate:new Date('December 27, 2030'),
  target:"Kepler-442 b",
  customer:['ZTM','NASA'],
  upcoming:true,
  succes:true,
};

saveLunch(launch);


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
  abortLaunchById
}