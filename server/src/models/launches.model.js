const launches=new Map();

const launch={
  flightNumber:100,
  misson:"kepler exploration x",
  rocket:"EXPLORE IS1",
  launchDate:new Date('December 27, 2030'),
  destination:"Kepler-442 b",
  customer:['ZTM','NASA'],
  upcoming:true,
  succes:true,
};

launches.set(launch.flightNumber, launch); // untuk mapping dengan flight number atau sama dengan id
module.exports={
  launches
}