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
    Staging:{
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
    get: function transactionstaging(req, res, next) {

        var echo = {
            transactionId: req.params.transactionId,
            campaignId: req.params.campaignId,
            network:req.params.network,
            token: req.params.token
        };

        Environments.Staging.network=req.params.network;
        Environments.Staging.token=req.params.token;

        checkTransaction(
            Environments.Staging.accountName,
            Environments.Staging.accountKey,
            Environments.Staging.queueName,
            echo,
            res,
            Environments.Staging.attempts,
            Environments.Staging.network,
            Environments.Staging.token
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
    AzureModule.enqueueMessage(queueName,message);
    res.json(echo);
};
