//@ts-check


//Types
/**
 * An ACARS Response object.
 * @typedef {Object} ACARS
 * @property {string} departure - Departure ICAO, or null if it could not be determined.
 * @property {string} arrival - Arrival ICAO, or null if it could not be determined.
 * @property {number} flightTime - Flight time in seconds.
 * @property {string} aircraftLiveryId - Aircraft Livery ID.
 */
/**
 * An ATC Object
 * @typedef {Object} ATC
 * @property {string} frequencyId ID of the frequency
 * @property {string} userId ID of the controller
 * @property {?string} username Username of the controller
 * @property {?string} virtualOrganization VA/VO of the controller
 * @property {?string} airportName Name of the airport for the frequency
 * @property {0|1|2|3|4|5|6|7|8|9|10|11} type Type of the frequency
 * @property {number} latitude Latitude of the airport
 * @property {number} longitude Longitude of the airport
 * @property {string} startTime Date string of frequency opening time.
 */
/**
 * A route object
 * @typedef {Object} Route
 * @property {string} id Route ID
 * @property {?string} flightNumber Route Flight Number
 * @property {?string} departureIcao Route Departure ICAO
 * @property {?string} arrivalIcao Route Arrival ICAO
 * @property {number} flightTime Route Flight time in seconds.
 * @property {?string} aircraftLiveryId Route Aircraft Livery ID
 */
/**
 * A codeshare object
 * @typedef {Object} Codeshare
 * @property {string} id Codeshare ID
 * @property {?string} senderName Sender Airline Name
 * @property {?string} recipientName Recipient Airline Name
 * @property {?string} message Optional Message
 * @property {Array<Route>} routes Array of codeshare routes
 */


//Dependancies
const req = require('req-fast');

//Dev
const main = {};
/**
 * Initialises VANet;
 * @param {string} id Vanet API Key
 * @returns {Promise<Boolean>} Successful Operation or not.
 */
main.init = function(id) {
    return new Promise((resolve, reject) => {
        req({
            url: 'https://api.vanet.app/airline/v1/profile',
            method: "GET",
            headers: {
                'X-Api-Key': id
            }
        }, function (err, res) {
            if (res.statusCode == 200 && !err) {
                main.id = id;
                main.gold = res.body.result.isGoldPlan;
                resolve(true);
            } else {
                reject(`Response: ${res.statusCode}, ${err?err:"An error occurred"}`);
            }
        })
    })
}

/**
 * Get Available Servers
 * @returns {Promise<Array>} Array of servers
 */
main.getServers = function(){
    return new Promise((resolve, reject) =>{
        req({
            url: 'https://api.vanet.app/airline/v1/atc',
            method: "GET",
            headers: {
                'X-Api-Key': main.id
            }
        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(res.body.result);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}

//Acars
const acars = {}
/**
 * Runs VANet ACARS **GOLD REQUIRED**
 * @deprecated Not known to work yet.
 * @param {string} callsign The Pilot's Current Callsign
 * @param {string} userID The Pilot's User ID
 * @param {"training"|"expert"} server The Server the Flight is on. Acceptable values are training and expert.
 * @returns {Promise<ACARS>} Promise resolved with ACARS object.
 */
acars.run = function(callsign, userID, server) {
    return new Promise((resolve,reject) =>{
        req({
            url: "https://api.vanet.app/airline/v1/acars",
            method: "POST",
            data: {
                callsign: callsign,
                userID: userID,
                server: server
            },
            headers: {
                'X-Api-Key': main.id
            },
            dataType: "json"

        }, function (err, res) {
            if(res.statusCode == 200){
                resolve(res.body.result);
            }else{
                reject(`Response: ${res.statusCode}, ${err?err: "Unknown Error"}`)
            }
        })
    })
}

//ATC
const atc = {};
/**
 * Gets all ATC Active in select server.
 * @param {"casual"|"training"|"expert"} server 
 * @returns {Promise<Array<ATC>>} Array of ATC Frequency
 */
atc.getActiveATC = function(server){
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/atc/${server}`,
            method: "GET",
            headers: {
                'X-Api-Key': main.id
            },
            dataType: "json"

        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(res.body.result);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}

//Codeshare
const codeshare = {};

/**
 * Gets all codeshare requests.
 * @returns {Promise<Array<Codeshare>>} Array of codeshare requests.
 */
codeshare.getAll = function(){
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/codeshares`,
            method: "GET",
            headers: {
                'X-Api-Key': main.id
            },
            dataType: "json"
        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(res.body.result);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}
/**
 * Create Codeshare request.
 * @param {string} recipID Recipient Airline ID
 * @param {string} message Optional Message
 * @param {Array<Route>} routes The routes to send
 * @return {Promise<boolean>} True for success
 */
codeshare.create = function(recipID, message, routes){
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/codeshares`,
            method: "POST",
            headers: {
                'X-Api-Key': main.id
            },
            data:{
                recipientID: recipID,
                message: message,
                routes: routes
            },
            dataType: "json"
        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(true);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}
/**
 * Get Codeshare request.
 * @param {string} id ID of codeshare
 * @returns {Promise<Codeshare>} Codeshare Request
 */
codeshare.get = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/codeshares/${id}`,
            method: "GET",
            headers: {
                'X-Api-Key': main.id
            },
            dataType: "json"
        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(res.body.result);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}
/**
 * Delete Codeshare request.
 * @param {string} id ID of codeshare
 * @returns {Promise<boolean>} True if success
 */
codeshare.delete = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/codeshares/${id}`,
            method: "DELETE",
            headers: {
                'X-Api-Key': main.id
            },
            dataType: "json"
        }, function (err, res) {
            if (res.statusCode == 200) {
                resolve(true);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}

//Exports
exports.init = main.init;
exports.core = main;
exports.acars = acars;
exports.atc = atc;
exports.codeshare = codeshare;