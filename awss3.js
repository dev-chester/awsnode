// Imports
var AWS = require('aws-sdk');
var fs  = require('fs'); 

//Global version
AWS.config.apiVersions = {
  s3: '2006-03-01'
};

// Hardcoded values
// TODO change values
var staticFilePath = "C:\\Users\\APPTech\\Desktop\\"; //file path to be uploaded
var keyName = "byd.txt"; //filename
var deleteFileKey = "byd.txt"; //filename
var createNewBucket = "apptech-koa-bucket";


// Functions
const createBucket = function() {
  var s3 = new AWS.S3();

  s3.createBucket({Bucket: createNewBucket}, (e, data) => {
    if (e) {
      console.log(e, e.stack); 
      return;
    }

    console.log(data); 
  });
}

const uploadFile = function() {
    fs.readFile(`${staticFilePath}${keyName}`, (err, data) => {
      if (err) {
        console.log("error in reading file");
        return;
      }

      var objectParams = {Bucket: createNewBucket, Key: keyName, Body: data};
      var uploadPromise = new AWS.S3().putObject(objectParams).promise();
      uploadPromise.then( () => {
        console.log("Successfully uploaded data to " + createNewBucket + "/" + keyName);
      }).catch((error) => {
        console.log("Error in uploading data to " + createNewBucket + "/" + keyName);
        console.error(`Error stack: ${error}`);
      });
    });
    
}

const deleteFile = function() {
  var s3 = new AWS.S3();

  s3.deleteObject({Bucket: createNewBucket, Key: deleteFileKey}, (e, data) => {
    if (e) {
      console.log(e, e.stack); 
      return;
    }

    console.log(data); 
  })
}

//getObject() Other Directory
const downloadFile = function() {
    var s3 = new AWS.S3();
    var params = {Bucket: createNewBucket, Key: keyName};
    var file = require('fs').createWriteStream(`${staticFilePath}${Date.now().toString()}-${keyName}`);
    var s3Stream  = s3.getObject(params).createReadStream();

    s3Stream.pipe(file)
    .on('error', (err)=> {
      console.log("Error in Download");
      return;
    })
    .on('close', () => {
      console.log("Success!");
      return;
    });

}

// Utils
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Entry point
readline.question('Enter \n [1] to Create Bucket \n [2] to Upload File \n [3] to Delete File \n [4] to Download File \n : ', choice => {
  if (choice === "1") createBucket();
  if (choice === "2") uploadFile();
  if (choice === "3") deleteFile();
  if (choice === "4") downloadFile();
  readline.close();
});


