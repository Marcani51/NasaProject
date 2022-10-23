const launches=new Map();

let lastestFlightNumber=100;

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

launches.set(launch.flightNumber, launch); // untuk mapping dengan flight number atau sama dengan id

function existLaunchWithId(launchId){
  return launches.has(launchId);
}

function getAllLaunches(){
  return Array.from(launches.values()); //// di taruh sini biar controller tinggal terima jadi data tanpa mikir convert
}

function addNewLaunch(launch){
  lastestFlightNumber++; // unutuk key atau id yg di tambahkan
  launches.set(
    lastestFlightNumber,
    Object.assign(launch,{
      customer:["Zero To mastery","Nasa"],
      upcoming:true,
      succes:true,
      flightNumber:lastestFlightNumber,
  }));
}

function abortLaunchById(launchId){
  const aborted=launches.get(launchId);
  aborted.upcoming=false;
  aborted.succes=false;
  return aborted;
}
module.exports={
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById
}