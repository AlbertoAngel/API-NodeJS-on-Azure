'use strict';

var data = {
    blobService: {},
    queueService: {},
    accountName: "",
    accountKey: "",
    isDebudEnabled:false
}

var MicrosoftAzure = require('azure-storage');

exports.init = function (name, key) {
    data.isDebudEnabled=true;
    data.accountName = name;
    data.accountKey = key;

    data.blobService = MicrosoftAzure.createBlobService(data.accountName, data.accountKey);
    data.queueService = MicrosoftAzure.createQueueService(data.accountName, data.accountKey);
    module.exports.log("Azure storage objects are initialiced");
};

exports.log = function (message) {

    if (data.isDebudEnabled === true) {
        console.log(message);
    }
};

exports.createQueueIfNotExist = function (queueName) {

    data.queueService.createQueueIfNotExists(queueName, function (error) {
        if (!error) {
            // Queue exists
            module.exports.log("Queue already existed");
        }
        else {
            module.exports.log("Queue was created");
        }
    });
};

exports.enqueueMessage = function (queueName, queueMessage) {

    module.exports.log("Enqueue message");
    module.exports.createQueueIfNotExist(queueName);

    // esperamos 5 segundos en caso de que se haya creado
    setTimeout(function () {
        data.queueService.createMessage(queueName, queueMessage , function (error) {
            if (!error) {
                // Message inserted
                module.exports.log("Message inserted");
            }
        });
    }, 5000);
   
};