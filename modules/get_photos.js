// do frontendu wychodz� st�d tylko linki, kt�re wy�wietlane s� w html jako img src

class Picture {

    constructor(name, url) {
        this.name = name;
        this.url = url;
    }

}

var task = function (request, callback) {

    var Const = require("./const")
    var AWS = require('aws-sdk');
    AWS.config.loadFromPath('./config.json');

    var imageIterator = 0;
    var downloadedPictures = [];

    // tworzymy koszyk, logujemy si� do niego 

    var s3 = new AWS.S3();
    var params = {Bucket: Const.bucketName};
    s3.listObjects(params, function (err, data) {

        if (err)
            Const.putIntoLogDB(err);

        var bucketContents = data.Contents;

        for (var i = 0; i < bucketContents.length; i++) {
            var urlParams = { Bucket: Const.bucketName, Key: bucketContents[i].Key };
            // nadanie specjalnego url do ka�dego zdj�cia w celu zapewnienia bezpiecze�stwa
            s3.getSignedUrl('getObject', urlParams, function (err, url) {

                if (err)
                    Const.putIntoLogDB(err);
                else {
                    downloadedPictures.push(new Picture(bucketContents[imageIterator].Key, url));
                    imageIterator++;
                    if (imageIterator == bucketContents.length)
                        callback(null, JSON.stringify(downloadedPictures));
                }


            });
        }
    });

};

exports.lab = task;
