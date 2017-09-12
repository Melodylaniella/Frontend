// zachodzi tutaj bezposrednie wysy³anie i dobieranie danych z koszyka bez odpytywania workerów
// obrazek przesy³any jako dane binarne jako fizyczny plik do uploads, a nastepnie do koszyka 
var task = function (request, callback) {

    var path = require('path');
    var formidable = require('formidable');
    var fs = require('fs');
    var AWS = require('aws-sdk');
    var Jimp = require("jimp");
    var Const = require("./const");

    var form = new formidable.IncomingForm();
    var fileName;

    if (!fs.existsSync(Const.UPLOAD_DIR)){
        fs.mkdirSync(Const.UPLOAD_DIR);
    }
    
    form.multiples = true;
    form.uploadDir = path.join(__dirname, Const.UPLOAD_DIR);

    // nadanie unikalnej nazwy
    form.on('file', function (field, file) {
        fileName = Const.getUniqueSQSName();
        fs.rename(file.path, path.join(form.uploadDir, fileName));
    });

    form.on('end', function () {

        var Const = require("./const");

        // odczytanie danych z uploads
        Jimp.read(path.join(__dirname, Const.UPLOAD_DIR, fileName), function (err, image) {
            if (err) {
                Cont.putIntoLogDB(err);
                throw err;
            }
            // przekazanie odczytanych danych do koszyka, ze zmienion¹ nazw¹
            image.getBuffer(image.getMIME(), (err, buffer) => {
                var s3Bucket = new AWS.S3({ params: { Bucket: Const.bucketName } });
                var data = { Key: fileName, Body: buffer };
                s3Bucket.putObject(data, function (err, data) {
                    // jeœli zostanie wys³any poprawnie usuwamy go z uploads, jeœli nie logujemy error do bazy
                    if (err)
                        Cont.putIntoLogDB(err);
                    fs.unlink(__dirname + Const.UPLOAD_DIR + "/" + fileName);
                });

            });
        });
    });
    
    form.parse(request);

};

exports.lab = task;
