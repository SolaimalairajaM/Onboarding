'use strict';
const storage = require('azure-storage');
const path = require('path');
var fs = require('fs');
const azureStorageConfig = {
    accountName: "",
    accountKey: "",
    blobURL: "",
    containerName: ""
};

module.exports = class AzureStorageOperations {
    constructor(){
        this.storageAccountConnectionString = "DefaultEndpointsProtocol=https;AccountName=lqxqaartifacts;AccountKey=MX9LHBBakVYdpfBrC4VKzYeFvUE1tyb/4hHSfCL+gU1UOG9UukeRv5UCObpnsqB+Qrje589XUW3H+AStIqD04A==;EndpointSuffix=core.windows.net";
        this.BlobUtilities = storage.BlobUtilities;
    }
    
    walk(dir, done) {
        var results = [];
        console.log("dir :", dir);
        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, results);
                file = dir + '/' + file;
                console.log("file :", file);
                fs.stat(file, function (err2, stat) {
                    if (stat && stat.isDirectory()) {
                        let obj = new AzureStorageOperations();
                        obj.walk(file, function (err3, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };

   
    uploadBlobs(sourceDirectoryPath, containerName, blobPath) {
        console.log('Entering uploadBlobs.');
        return new Promise((resolve, reject) => {
            let blobService = storage.createBlobService(this.storageAccountConnectionString);
            // validate directory is valid.
            if (!fs.existsSync(sourceDirectoryPath)) {
                console.log(sourceDirectoryPath + ' is an invalid directory path.');
            } else {
                // Search the directory and generate a list of files to upload.
                // generate and schedule an upload for each file
                // Search the directory and generate a list of files to upload.
                console.log("uploadblob :fileblobPath  " + blobPath );
                this.walk(sourceDirectoryPath, function (error, files) {
                    if (error) {
                        console.log(error);
                    } else {
                        var finished = 0;
                        console.log("uploadblob :containerName " + containerName);
                        // generate and schedule an upload for each file
                        files.forEach(function (file) {
                         
                            var blobName = file.replace(sourceDirectoryPath, '');
                            console.log("uploadblob :blobname " +  blobName);
                            //console.log("uploadblob :file "+ file);
                            blobService.createBlockBlobFromLocalFile(containerName, blobPath + blobName, file, function (error) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    //   console.log(' Blob ' + blobName + ' upload finished.');
                                    if (finished === files.length) {
                                        // Wait until all workers complete and the blobs are uploaded to the server.
                                        console.log('All files uploaded');
                                        resolve(files.length);
                                    }
                                    
                                }
                            });
                        });
                    }
                });
            }
        })
    }  
}