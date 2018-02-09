module.exports = {

    getUniqueSQSName: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            var ret;
            if (c == 'x')
            {
                ret = r.toString(16);
            }
            else
            {
                ret = (r & 0x3 | 0x8).toString(16);
            }
            return ret;
        });
        return uuid;
    },

    // wysylanie wiadomosci z parametrami params
    sendMessage: function (params) {
        var Const  = require("./const");
        var AWS = require('aws-sdk');
        AWS.config.loadFromPath('./config.json');
        //utworzenie kolejki
        var sqs = new AWS.SQS({apiVersion: Const.API_VERSION});
        // funkcja na kolejce sqs wyslania wiadomosci
        sqs.sendMessage(params, function (err, data) {
            if (err) {
                Const.putIntoLogDB(err);
            } else {
                console.log("Success", data.MessageId);
            }
        });


    },
    //preparujemy wiadomosci zawierającą parametry: co ma być wykonane i na którym pliku (jego nazwa)
    prepareMessage: function (type, data) {

        var Const = require("./const");

        // dziala na wiele plikow, czyli generuje wiadomosci dla kilku i wysyla je jedna po drugiej
        data.forEach(function (value) {
            var params = {
                DelaySeconds: 5,
                MessageAttributes: {
                    "MessageType": {
                        DataType: "Number",
                        StringValue: type
                    }
                },
                MessageBody: JSON.stringify(value),
                QueueUrl: Const.messageQueue
            };

            // przekazuje wygenerowana wiadomosci do send mesage 
            Const.sendMessage(params);
        });

    },

    putIntoLogDB: function (message) {

        var AWS = require('aws-sdk');
        AWS.config.loadFromPath('./config.json');
        var dynamodb = new AWS.DynamoDB();

        var params = {
            Item: {
                "GUID": {
                    S: this.getUniqueSQSName()
                },
                "timestamp": {
                    S: String(Date.now())
                },

                "Message": {
                    S: "Client; " + message
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: this.logTableName
        };
        dynamodb.putItem(params, function (err, data) {
        });

    },
    bucketName: "anitalesiakbucket",
    messageQueue: "https://sqs.eu-west-2.amazonaws.com/105347894034/anitaqueue",
    logTableName: "anitalogdb",
    UPLOAD_DIR: '/uploads',

    /*SQS values*/
    DELETE_TYPE: "1",
    ROTATE_TYPE: "2",
    BLACKANDWHITE_TYPE: "3",
    BLUR_TYPE: "4",
    INVERT_TYPE: "5",
    API_VERSION: "2017-08-30"

};