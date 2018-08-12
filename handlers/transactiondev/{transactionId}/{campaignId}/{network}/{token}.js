'use strict';
var AzureModule=require('../../../../../modules/AzureModule.js');
var Web3Module=require('../../../../../modules/Web3Module.js');

/**
 * Operations on /transactiontest/{transactionId}/{campaignId}
 */
var Environments={
    Test:{
        accountName:"{your account name}",
        accountKey:"{your account key}",
        queueName:"{your queue name}",
        attempts:5,
        network:"",
        token:""
    },
    Dev:{
        accountName:"{your account name}",
        accountKey:"{your account key}",
        queueName:"{your queue name}",
        attempts:5,
        network:"",
        token:""
    },
    Qa:{
        accountName:"{your account name}",
        accountKey:"{your account key}",
        queueName:"{your queue name}",
        attempts:5,
        network:"",
        token:""
    },
    Stagin:{
        accountName:"{your account name}",
        accountKey:"{your account key}",
        queueName:"{your queue name}",
        attempts:50,
        network:"",
        token:""
    },
    Production:{
        accountName:"{your account name}",
        accountKey:"{your account key}",
        queueName:"{your queue name}",
        attempts:100,
        network:"main",
        token:""
    }
};

module.exports = {
    get: function transactiondev(req, res, next) {

        var echo = {
            transactionId: req.params.transactionId,
            campaignId: req.params.campaignId,
            network:req.params.network,
            token: req.params.token
        };      

        Environments.Dev.network=req.params.network;
        Environments.Dev.token=req.params.token;

        checkTransaction(
            Environments.Dev.accountName,
            Environments.Dev.accountKey,
            Environments.Dev.queueName,
            echo,
            res,
            Environments.Dev.attempts,
            Environments.Dev.network,
            Environments.Dev.token
        );
    }    
};

var checkTransaction=function(accountName,accountKey,queueName,echo,res, attempts,network,token){

    Web3Module.init(attempts,network,token);      
    Web3Module.checkIfTransactionWasMinedLoop(echo.transactionId,
        function(result){
           if(result){           
              sendToQueue(accountName,accountKey,queueName,echo,res);
           }
           else{
               echo.transactionId="<NOT VALID>";
               res.json(echo);
           }
        },function(error){
            Web3Module.log(error);
            var errorObj={
                Message:error
            }
            res.json(errorObj);
        });   
};


var sendToQueue=function(accountName, accountKey, queueName, echo,res){
    
    AzureModule.init(accountName,accountKey);
    AzureModule.createQueueIfNotExist(queueName);

    var message = JSON.stringify(echo);   
    var objJsonB64 = Buffer.from(message).toString("base64");
   
    AzureModule.enqueueMessage(queueName,objJsonB64);
    res.json(echo);
};
