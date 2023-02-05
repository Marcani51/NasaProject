////cara lain membuat server express lebih  dinamik dengan menggunakan built in http di node.js

/// jadi di sini pure untuk  setting keperluan server saja sehingga lebih mudah untuk diorganisir sendiri
////dan setting express  berada terpisan dari server setting

const http=require('http');
const mongoose=require('mongoose');
const app =require('./app.js');
const {loadPlanetData}=require('./models/planets.model'); // digunakan untuk sambungaan promise pada model saat selesai  
const {loadLaunchData}=require('./models/launches.model');

const PORT = process.env.PORT || 8000;

////// sebelum tanda '?' untuk auto create db setelah kita simpan data pertama
const MONGOO_URL="mongodb+srv://Marcani51:marcellus.denta96@cluster0.umbob.mongodb.net/nasa?retryWrites=true&w=majority";  

const server = http.createServer(app); ///jadi semua middleware(di app.js) jga bisa ikut secara otomatis didalm server

//// untuk cek jika sudah connect
mongoose.connection.once('open',()=>{
  console.log("MongoDB is Ready!!!");
});

mongoose.connection.on('error',(err)=>{
  console.error(err);
})

async function startServer(){
  loadLaunchData();
  //connetc mongo dulu agar saat start data sudah availabe
  await mongoose.connect(MONGOO_URL);
  await loadPlanetData(); //digunakan untuk menunggu selesai load data dan 
                          ///terjadi saat startup sebelum berhasil listen to port
  server.listen(PORT,()=>{
    console.log(`listen to port: ${PORT}....`);
  });
}

startServer();

