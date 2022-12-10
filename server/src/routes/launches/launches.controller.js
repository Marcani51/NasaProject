const { json } = require('express');
const {
  getAllLaunches,
  existLaunchWithId,
  abortLaunchById,
  scheduleNewLaunch
}=require('../../models/launches.model');

async function httpGetAllLaunches(req,res){
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req,res){
  const launch=req.body;
  console.log(launch);

  if(!launch.mission || !launch.rocket || !launch.launchDate 
    || !launch.target){
      return res.status(400).json({
        error:'missing required property'
      });
    }
      launch.launchDate= new Date(launch.launchDate);
      if(isNaN(launch.launchDate)){
        return res.status(400).json({
          error:"invalid date format"
        })
      }
      //// kalau sudah di return fungsi bawahnya tidak akan di eksekusi
      await scheduleNewLaunch(launch);
      console.log(launch  );
      return res.status(201).json(launch);
    
  
}

async function httpAbortLaunch(req,res){
  const launchId=Number(req.params.id);

  const existLaunch=await existLaunchWithId(launchId);
  //jika tidak ada launchid
  if(!existLaunch){
    return res.status(400).json({
      error:"Launch Not Found"
    });
  }

  //jika ada
  const aborted= await abortLaunchById(launchId);

  if(aborted == false){
    return res.status(400),json({
      error:'launch not aborted'
    });;
  }
  return res.status(200).json({
    ok:true,
  });
}

module.exports={
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}