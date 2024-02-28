const storage = require('azure-storage');
const path = require('path');
var fs = require('fs');
const azureStorageConfig = {
    accountName: "",
    accountKey: "",
    blobURL: "",
    containerName: ""
};

export class AzureStorageOperations {

    private storageAccountConnectionString = "DefaultEndpointsProtocol=https;AccountName=lqxqaartifacts;AccountKey=MX9LHBBakVYdpfBrC4VKzYeFvUE1tyb/4hHSfCL+gU1UOG9UukeRv5UCObpnsqB+Qrje589XUW3H+AStIqD04A==;EndpointSuffix=core.windows.net";
    BlobUtilities = storage.BlobUtilities;

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

    showContainerNames() {
        console.log("conn " + this.storageAccountConnectionString);
        let blobService = storage.createBlobService(this.storageAccountConnectionString);
        blobService.listContainersSegmented(null, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${data.entries.length} containers.  `);
                for (let container of data.entries) {
                    console.log(` - ${container.name}`);
                }
            }
        });
    }

    uploadBlob(sourceDirectoryPath, file, containerName, blobPath) {
        console.log('Entering uploadBlobs.');
        let blobService = storage.createBlobService(this.storageAccountConnectionString);
        // validate directory is valid.
        if (!fs.existsSync(sourceDirectoryPath)) {
            console.log(sourceDirectoryPath + ' is an invalid directory path.');
        } else {
            file = sourceDirectoryPath + '/' + file;
            var blobName = file.replace(/^.*[\\\/]/, '');

            blobService.createBlockBlobFromLocalFile(containerName, blobPath + blobName, file, function (error) {
                if (error) {
                    console.log("error:=====", error);
                } else {
                    console.log(' Blob ' + blobName + ' upload finished.');
                }
            });
        }
    }

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

    downloadBlobs(blobName, downloadFilePath,containerName){
        return new Promise((resolve, reject) => {
            const name = path.basename(blobName);
            let blobService = storage.createBlobService(this.storageAccountConnectionString);
            blobService.getBlobToLocalFile(containerName, blobName, `${downloadFilePath}${name}`, function(error, serverBlob) {
                if (error) {
                    reject(error);
                } else {
                    resolve(downloadFilePath);
                }
            });
        });
    };

    deleteBlob(container, blob, callback) {
        // Delete the snapshot.
        let blobService = storage.createBlobService(this.storageAccountConnectionString);
        blobService.deleteBlob(container, blob, { deleteSnapshots: this.BlobUtilities.SnapshotDeleteOptions.BLOB_AND_SNAPSHOTS }, function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Deleted the snapshots.');
                callback();
            }
        });
    };

    deleteBlobs(container) {
        // Delete the snapshot.
        let so = this;
        let blobService = storage.createBlobService(this.storageAccountConnectionString);
        blobService.listBlobsSegmented(container, null, { include: so.BlobUtilities.BlobListingDetails.SNAPSHOTS }, function (error, results) {
            if (error) {
                console.log(error);
            } else {
                console.log('Listing the blobs under the container ' + container);

                results.entries.forEach(function (blob) {
                    console.log('Deleting the snapshots.' + blob.name)
                    blobService.deleteBlob(container, blob.name, { deleteSnapshots: so.BlobUtilities.SnapshotDeleteOptions.BLOB_AND_SNAPSHOTS }, function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Deleted the snapshots.' + blob.name);
                        }
                    });
                });
            }
        });
    };

    listSnapshots(container) {
        // List the blobs, including snapshots
        let blobService = storage.createBlobService(this.storageAccountConnectionString);
        blobService.listBlobsSegmented(container, null, { include: this.BlobUtilities.BlobListingDetails.SNAPSHOTS }, function (error, results) {
            if (error) {
                console.log(error);
            } else {
                console.log('Listing the blobs under the container ' + container);

                results.entries.forEach(function (blob) {
                    var snapshot = '';
                    if (blob.snapshot) {
                        snapshot = '; BlobSnapshot: ' + blob.snapshot;
                    }
                    console.log(' BlobName: ' + blob.name + snapshot);
                });
            }
        });
    };

    downloadBlob(serviceURL, containerName, blobName) {//pending
        const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'));

        serviceURL.getBlobToText(containerName, blobName, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log({ message: `Blob downloaded "${data}"`, text: data });
            }
        });

    }

}