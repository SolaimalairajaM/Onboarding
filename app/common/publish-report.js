const path = require('path');
const AzureStorageOperations = require('./storage-operation');
var resDir = './mochawesome-report/';

let EnvironmentName = process.env.env;
let execDate = process.env.execDate;
let timeStamp = process.env.timestamp;
let productName = process.env.ProductName;
let TestCaseName = process.env.TestCaseName;
let ModuleName = process.env.ModuleName;

async function publish(){
    let obj = new AzureStorageOperations();
    const containerName = "api-automation";  //Hard coded for now
    let blobPath = `${productName}/${EnvironmentName}/${execDate}/${ModuleName}_${timeStamp}`;
    await obj.uploadBlobs(resDir, containerName, blobPath);
}
publish();