const { json } = require('express');
const {
  getAllLaunches,
  addNewLaunch,
  existLaunchWithId,
  abortLaunchById
}=require('../../models/launches.model');

function httpGetAllLaunches(req,res){
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req,res){
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
      addNewLaunch(launch);
      return res.status(201).json(launch);
    
  
}

function httpAbortLaunch(req,res){
  const launchId=Number(req.params.id);

  //jika tidak ada launchid
  if(!existLaunchWithId(launchId)){
    return res.status(400).json({
      error:"Launch Not Found"
    });
  }

  //jika ada
  const aborted= abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports={
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}