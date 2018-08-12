'use strict';
var Web3 = require("web3")

/** Json when hold data process */
var data = {
    ethereumNetwork: {},
    seconds: 1000,
    multiplier: 1,
    transactionCompleted: false,
    transaction: {},
    isDebudEnabled: false,
    waitedSeconds: 1000,
    maxAttempts: 5,
    currentAttempt:5,
    endLoop: false,
    network:"main",
    networkUrl:""
};

var inicialiceData=function(max){
    console.log("inicialice data");
    var iniData = {
        ethereumNetwork: {},
        seconds: 1000,
        multiplier: 1,
        transactionCompleted: false,
        transaction: {},
        isDebudEnabled: false,
        waitedSeconds: 1000,
        maxAttempts: 5,
        currentAttempt:5,
        endLoop: false
    };
    data=iniData;
    console.log("end inicialice data");
};

exports.init = function (max,network,token) {

    // set data
    data.isDebudEnabled = true;
    data.maxAttempts=max;
    data.network=network;
    
    module.exports.log("Init network:"+network);

    // data object
    //inicialiceData(max);

    switch(network.toLowerCase()){
        case 'rinkeby':{
            connectToRinkebyNetwork(token);
        }break;
        case 'main':{
            connectToMainNetwork(token);
        }break;
        case 'ganache':{
            connectToGanacheLocalNetwork();
        }break;
        case 'local':{
            connectToLocalNetwork();
        }break;
    }       
};

var connectToMainNetwork=function(token){
    data.networkUrl="https://mainnet.infura.io/"+token;
    module.exports.log(">> Connect to main network");
    data.ethereumNetwork = new Web3(new Web3.providers.HttpProvider(data.networkUrl));
};

var connectToRinkebyNetwork=function(token){
    data.networkUrl="https://rinkeby.infura.io/"+token;
    module.exports.log(">> Connect to Rinkeby network");
    //token: https://rinkeby.infura.io/0xfa697C638de3F62af0f7776F7e6f5a1347AB511E
    //var rinkebyUrl="https://rinkeby.infura.io/0xfa697C638de3F62af0f7776F7e6f5a1347AB511E";
    data.ethereumNetwork = new Web3(new Web3.providers.HttpProvider(data.networkUrl));
};

var connectToGanacheLocalNetwork=function(){
    module.exports.log(">> Connect to Ganache local network");
    data.ethereumNetwork = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
};

var connectToLocalNetwork=function(){
    module.exports.log(">> Connect to Local network");
    data.ethereumNetwork = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
};


exports.log = function (message) {
    if (data.isDebudEnabled === true) {
        console.log(message);
    }
};


exports.checkIfTransactionWasMinedLoop = function (transactionId,callback, callbackError) {
    /** sinchronous method */
    module.exports.log("the transaction {"+transactionId+"} was mined: wait {" + data.waitedSeconds + "} miliseconds");
    
    try {
         if(data.ethereumNetwork.isConnected()){
             // get the transaction details
            data.transaction = data.ethereumNetwork.eth.getTransaction(transactionId);
        
            module.exports.log("The transaction is:");
            module.exports.log( JSON.stringify(data.transaction) );

            if ( data.transaction !=null && data.transaction.blockNumber !== undefined) {
                module.exports.init(data.maxAttempts,data.network);
                data.transactionCompleted = true;

                //Show the transaction
                module.exports.log("The transaction is:");
                module.exports.log( JSON.stringify(data.transaction) );
            
                callback(data.transactionCompleted);
            }
            else {
                if (data.currentAttempt < 0) {
                    module.exports.log("End loop");
                    callbackError("max attempts");
                }
                else {
                    data.waitedSeconds = data.seconds * data.multiplier;
                    data.multiplier = data.multiplier + .5;
                    data.currentAttempt = data.currentAttempt - 1;

                    setTimeout(function () {
                        module.exports.checkIfTransactionWasMinedLoop(transactionId, callback, callbackError);
                    }, data.waitedSeconds);
                }
            }  
         }
         else{
            var message="Could not connected";
            callbackError(message);
         }
    } catch (e) {
        module.exports.log(e);
        var message=JSON.stringify(e);
        callbackError(message);
        return 0;
    }
};



exports.checkIfTransactionWasMinedLoopTest = function (transactionId, campaignId, callback) {
    /** sinchronous method */

    module.exports.log("the transaction id was mined: wait {" + data.waitedSeconds + "} miliseconds");

    if (data.transactionCompleted === false) {
        if (data.multiplier >= 3) {
            data.transactionCompleted = true;
        }
        data.waitedSeconds = data.seconds * data.multiplier;
        data.multiplier = data.multiplier + .5;

        setTimeout(function () {
            module.exports.checkIfTransactionWasMinedLoopTest(transactionId, campaignId, callback);
        }, data.waitedSeconds);
    }
    else {
        /** complete the cicle **/
        module.exports.init();
        callback();
    }
};
