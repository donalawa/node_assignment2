const http = require("http");
const fs = require("fs");
const formidable = require("formidable");
const events = require('events');

const eventEmitter = new events.EventEmitter();


eventEmitter.on('register_complete',function(){
  console.log('New student registered')
})
var allStudents = [];
const server = http.createServer((req, res) => {
  if (req.url === "/api/upload" && req.method.toLowerCase() === "post") {
    // parse a file upload
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, image) => {
      fs.writeFile(
        `./db/${fields.name}.txt`,
        JSON.stringify({ fields,image }, null, 2),
        err => {
          if (err) {
            console.log(err);
          } else {
            eventEmitter.emit('register_complete')
            // fs.readFile(`./db/${fields.name}.txt`,'utf8',(err,data)=>{
            //     if(err){
            //         console.log(err)
            //     }else {
            //         console.log(data)
            //     }
            // })
          }
        }
      );
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
  
  
  // show a file upload form
  res.writeHead(200, { "Content-Type": "text/html" });
  var myReadStream = fs.createReadStream(__dirname + "/index.html", "utf8");
  myReadStream.pipe(res);
  fs.readdir("./db", (err, allFiles) => {
    if (err) {
      console.log(err);
    } else {
      allFiles.forEach(file => {
        let data = fs.readFileSync(`db/${file}`,'utf8');
        // console.log(data)
      })
      // for(let i = 0; i < allFiles.length; i++){
      //   fs.readFile(
      //     `./db/${allFiles[i]}`,
      //     "utf8",
      //     (err, data) => {
      //       if (err) {
      //         console.log(err);
      //       } else {
      //         var data1 = JSON.parse(data)
      //         // console.log('Now Console')
      //         // console.log(data1.fields)
      //         console.log(allStudents.indexOf(data1.fields))
      //         if(allStudents.indexOf(data1.fields) == -1){
      //             allStudents.push(data1.fields);
      //             console.log('Inside If Condition')
      //             console.log(allStudents.length)
      //         }
      //       }
      //     }
      //   );
      // }
      // allFiles.forEach((file,index) => {
      //   fs.readFileSync(
      //     `./db/${file}`,
      //     "utf8",
      //     (err, data) => {
      //       if (err) {
      //         console.log(err);
      //       } else {
      //         var data1 = JSON.parse(data)
      //         console.log(data1.fields)
      //         if(allStudents.indexOf(data1.fields) < 0){
      //             allStudents.push(data1.fields);
      //             console.log(allStudents.length)
      //         }
      //       }
      //     }
      //   );
      // });
    }
  });
});

server.listen(8080, () => {
  console.log("Server listening on http://localhost:8080/ ...");
});

