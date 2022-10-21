////cara lain membuat server express lebih  dinamik dengan menggunakan built in http di node.js
/// jadi di sini pure untuk  setting keperluan server saja sehingga lebih mudah untuk diorganisir sendiri
////dan setting express  berada terpisan dari server setting

const http=require('http');
const app =require('./app.js');
const {loadPlanetData}=require('./models/planets.model'); // digunakan untuk sambungaan promise pada model saat selesai  

const PORT = process.env.PORT || 8000;

const server = http.createServer(app); ///jadi semua middleware(di app.js) jga bisa ikut secara otomatis didalm server

async function startServer(){
  await loadPlanetData(); //digunakan untuk menunggu selesai load data dan terjadi saat startup sebelum berhasil listen to port
  server.listen(PORT,()=>{
    console.log(`listen to port: ${PORT}....`);
  });
}

startServer();

