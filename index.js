//@ts-check


//Types
/**
 * @namespace
 */
const types = {};
/**
 * An ACARS Response object.
 * @typedef {Object} ACARS
 * @memberof types
 * @property {string} departure - Departure ICAO, or null if it could not be determined.
 * @property {string} arrival - Arrival ICAO, or null if it could not be determined.
 * @property {number} flightTime - Flight time in seconds.
 * @property {string} aircraftLiveryId - Aircraft Livery ID.
 */
/**
 * An ATC Object
 * @typedef {Object} ATC
 * @memberof types
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
 * @memberof types
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
 * @memberof types
 * @property {string} id Codeshare ID
 * @property {?string} senderName Sender Airline Name
 * @property {?string} recipientName Recipient Airline Name
 * @property {?string} message Optional Message
 * @property {Array<Route>} routes Array of codeshare routes
 */
/**
 * Airport Frequency Object
 * @memberof types
 * @typedef {Object} airportFrequency
 * @property {number} id
 * @property {string} type
 * @property {string} description
 * @property {string} frequency
 */
/** Airport Runway Object 
 * @memberof types
 * @typedef {Object} airportRunway
 * @property {number} id
 * @property {?number} length
 * @property {?number} width
 * @property {?boolean} closed
 * @property {?string} identL
 * @property {?number} latitudeL
 * @property {?number} longitudeL
 * @property {?number} elevationL
 * @property {?number} headingL
 * @property {?number} displacedThresholdL
 * @property {?string} identH
 * @property {?number} latitudeH
 * @property {?number} longitudeH
 * @property {?number} elevationH
 * @property {?number} headingH
 * @property {?number} displacedThresholdH
*/
/**
 * An Airport Object
 * @memberof types
 * @typedef {Object} Airport
 * @property {number} id
 * @property {?string} icaoCode ICAO of Airport
 * @property {?string} type
 * @property {?string} name Name of Airport
 * @property {?number} latitude Latitude of Airport
 * @property {?number} longitude Longitude of Airport
 * @property {?string} country Country airport is in.
 * @property {?string} city City Airport is in.
 * @property {?string} iataCode
 * @property {?Array<airportFrequency>} frequencies
 * @property {?Array<airportRunway>} runways
 */
/**
 * An Aircraft object
 * @memberof types
 * @typedef {Object} Aircraft
 * @property {string} liveryID
 * @property {string} aircraftID
 * @property {string} aircraftName
 * @property {string} liveryName
 * @property {number} maxTakeoffWeight
 * @property {number} maxLandingWeight
 * @property {string} neverExceed
 * @property {number} serviceCeiling
 * @property {number} range
 * @property {number} apprSpeedRef
 * @property {number} maxPassengers
 */
/**
 * An Airline
 * @memberof types
 * @typedef {Object} airline
 * @prop {number} id
 * @prop {string} name
 * @prop {string} code
 * @prop {boolean} isGold 
 * @prop {boolean} isManager
 * @prop {string} callsignFormat
 */
/**
 * An Airlines Page
 * @memberof types
 * @typedef {Object} airlinePage
 * @property {number} pageIndex
 * @property {number} totalPages
 * @property {number} totalCount
 * @property {boolean} hasPreviousPage
 * @property {boolean} hasNextPage
 * @property {Array<airline>} data
 */

/** 
 * A Slot
 * @memberof types
 * @typedef {Object} Slot
 * @prop {string} id
 * @prop {string} gate
 * @prop {string} pilotId
 * @prop {string} pilotName
 */

/**
 * An event
 * @memberof types
 * @typedef {Object} event
 * @prop {string} id
 * @prop {string} name
 * @prop {string} description
 * @prop {string} dateTime
 * @prop {string} departureIcao
 * @prop {string} arrivalIcao
 * @prop {string} aircraftLiveryId
 * @prop {string} aircraftName
 * @prop {string} server
 * @prop {number} airlineId
 * @prop {string} airlineName
 * @prop {Array<Slot>} slots
 */
/**
 * An Events Page
 * @memberof types
 * @typedef {Object} eventPage
 * @property {number} pageIndex
 * @property {number} totalPages
 * @property {number} totalCount
 * @property {boolean} hasPreviousPage
 * @property {boolean} hasNextPage
 * @property {Array<event>} data
 */

//Dependancies
const req = require('req-fast');

//Dev
/**
 * @namespace
 */
const main = {};
/**
 * Initialises VANet;
 * @param {string} id Vanet API Key
 * @function
 * @returns {Promise<Boolean>} Successful Operation or not.
 */
main.init = function (id) {
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
                reject(`Response: ${res.statusCode}, ${err ? err : "An error occurred"}`);
            }
        })
    })
}

/**
 * Get Available Servers
 * @function
 * @returns {Promise<Array>} Array of servers
 */
main.getServers = function () {
    return new Promise((resolve, reject) => {
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
/**
 * @namespace
 */
const acars = {}
/**
 * Runs VANet ACARS **GOLD REQUIRED**
 * @throws Will throw 404 error, due to an issue.
 * @todo Finish the function due to 404 errors.
 * @function
 * @param {string} callsign The Pilot's Current Callsign
 * @param {string} userID The Pilot's User ID
 * @param {"training"|"expert"} server The Server the Flight is on. Acceptable values are training and expert.
 * @returns {Promise<ACARS>} Promise resolved with ACARS object.
 */
acars.run = function (callsign, userID, server) {
    return new Promise((resolve, reject) => {
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
            if (res.statusCode == 200) {
                resolve(res.body.result);
            } else {
                reject(`Response: ${res.statusCode}, ${err ? err : "Unknown Error"}`)
            }
        })
    })
}

//ATC
/**
 * @namespace
 */
const atc = {};
/**
 * Gets all ATC Active in select server.
 * @param {"casual"|"training"|"expert"} server 
 * @function
 * @returns {Promise<Array<ATC>>} Array of ATC Frequency
 */
atc.getActiveATC = function (server) {
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
/**
 * @namespace
 */
const codeshare = {};

/**
 * Gets all codeshare requests.
 * @function
 * @returns {Promise<Array<Codeshare>>} Array of codeshare requests.
 */
codeshare.getAll = function () {
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
codeshare.create = function (recipID, message, routes) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/airline/v1/codeshares`,
            method: "POST",
            headers: {
                'X-Api-Key': main.id
            },
            data: {
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
 * @function
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
 * @function
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
//Airport
/**
 * @namespace
 */
const airport = {};
/**
 * Get Airport Information
 * @param {string} icao Airport ICAO
 * @function
 * @returns {Promise<Airport>} Airport info
 */
airport.getInfo = function(icao){
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/airport/${icao}`,
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
 * Get Airport ATIS
 * @param {string} icao 
 * @returns {Promise<string>} ATIS String
 */
airport.getAtis = function (icao) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/airport/${icao}/atis`,
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

//Aircaft
/**
 * @namespace
 */
const aircraft = {};
/**
 * Get All Aircraft
 * @returns {Promise<Aircraft>}
 */
aircraft.getAllAircraft = function () {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/aircraft`,
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
 * Get Aircraft Liveries
 * @param {string} id 
 * @returns {Promise<Array<Aircraft>>}
 */
aircraft.getAircraftLivs = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/aircraft/${id}`,
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
 * Get Aircraft Livery
 * @param {string} id 
 * @returns {Promise<Aircraft>}
 */
aircraft.getLivery = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/aircraft/livery/${id}`,
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

//Airlines
/**
 * @namespace
 */
const airlines = {};
/**
 * Get Airlines
 * @param {number} page Page Number
 * @returns {Promise<airlinePage>}
 */
airlines.getAirlines = function (page) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/airlines?page=${page.toString()}`,
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
 * Get Airline
 * @param {number} id Airline ID
 * @returns {Promise<airline>}
 */
airlines.getAirline = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/airlines/${id.toString()}`,
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
 * Update Airline
 * @param {number} id Airline ID
 * @param {string} name Name of the Airline
 * @param {string} code 3-4 Letter Code of Airline
 * @param {string} callsignFormat
 * @returns {Promise<airline>}
 */
airlines.updateAirline = function (id, name, code, callsignFormat) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/airlines/${id.toString()}`,
            method: "PUT",
            headers: {
                'X-Api-Key': main.id
            },
            data: {
                name: name,
                code: code,
                callsignFormat: callsignFormat
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

//Events
/**
 * @namespace
 */
const events = {};
/**
 * Get Events
 * @param {number} page 
 * @returns {Promise<Array<eventPage>>}
 */
events.getEvents = function (page) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/events?page=${page.toString()}`,
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
 * Get Event
 * @param {number} id Event ID
 * @returns {Promise<event>}
 */
events.getEvent = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/events/${id.toString()}`,
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
 * Get Event Slots
 * @param {number} id Event ID
 * @returns {Promise<Array<Slot>>}
 */
events.getEventSlots = function (id) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/events/${id.toString()}/slots`,
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
 * Get Event Slot
 * @param {number} eid Event ID
 * @param {number} sid Slot ID
 * @returns {Promise<Slot>}
 */
events.getEventSlot = function (eid, sid) {
    return new Promise((resolve, reject) => {
        req({
            url: `https://api.vanet.app/public/v1/events/${eid.toString()}/slots/${sid.toString()}`,
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

//Exports
exports.init = main.init;
exports.core = main;
exports.acars = acars;
exports.atc = atc;
exports.codeshare = codeshare;
exports.airport = airport;
exports.aircraft = aircraft;
exports.airlines = airlines;
exports.events = events;