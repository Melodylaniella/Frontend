var task = function (request, callback) {

    var Const = require("./const");
    Const.prepareMessage(Const.BLACKANDWHITE_TYPE, request.body['photos']);

};

exports.lab = task;
    