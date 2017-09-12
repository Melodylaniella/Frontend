var task = function (request, callback) {
    var Const = require("./const");
    Const.prepareMessage(Const.BLUR_TYPE, request.body['photos']);

};

exports.lab = task;
    