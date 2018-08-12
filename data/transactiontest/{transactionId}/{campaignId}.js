'use strict';
var Mockgen = require('../../mockgen.js');
/**
 * Operations on /transactiontest/{transactionId}/{campaignId}
 */
module.exports = {
    /**
     * summary: 
     * description: 
     * parameters: transactionId, campaignId
     * produces: application/json, text/json
     * responses: 200
     * operationId: transactiontest
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/transactiontest/{transactionId}/{campaignId}',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};
