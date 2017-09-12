var task = function (request, callback) {
    var Const = require("./const");
    Const.prepareMessage(Const.INVERT_TYPE, request.body['photos']);

};

exports.lab = task;
    