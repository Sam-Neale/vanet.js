//@ts-check
const chalk = require('chalk');
const vanet = require('./index.js');
const log = console.log;
require("dotenv").config();


vanet.init(process.env.TEST_KEY).then(() => {
    test();
});

const failed = [];
const tests = {
    acars: true,
    servers: false,
    atc: false
};
function test() {
    log(chalk.blue('STARTING TESTS'))
    //const acarsTest = testACARS();
    const serversTest = testServers();
    const atcTest = testATC();
    let testsComplete = true;
    setInterval(() => {
        testsComplete = true;
        for (const [key, value] of Object.entries(tests)) {
            if (value != true){
                testsComplete = false;
            }
        }
    }, 500)
    let checker = setInterval(() => {
        
        if(testsComplete){
            clearInterval(checker);
            if(failed.length != 0){
                log(chalk.redBright("Some Tests failed."));
                log(failed)
                process.exit(0);
            }else{
                log(chalk.greenBright("All Tests succeeded"))
                process.exit(0);
            }
        }
    }, 1000)
}

function testACARS() {
    return new Promise((resolve, reject) => {
        log(chalk.blueBright('Starting ACARS Test'));
        vanet.acars.run('American 5121', '2892ddb0-3490-4413-8cb5-2d8b5eac669a', "expert").then((res) => {
            tests.acars = true;
        }).catch(err =>{
            failed.push({
                test: 'ACARS',
                err: err
            })
            tests.acars = true;
        })
    })
}
function testServers() {
    return new Promise((resolve, reject) => {
        log(chalk.blueBright('Starting Servers Test'));
        vanet.core.getServers().then((res) => {
            tests.servers = true;
        }).catch(err => {
            failed.push({
                test: 'Servers',
                err: err
            })
            tests.servers = true;
        })
    })
}
function testATC() {
    return new Promise((resolve, reject) => {
        log(chalk.blueBright('Starting ATC Test'));
        vanet.atc.getActiveATC('training').then((res) => {
            tests.atc = true;
        }).catch(err => {
            failed.push({
                test: 'ATC',
                err: err
            })
            tests.atc = true;
        })
    })
}
