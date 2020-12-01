const fs = require('fs')

const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

//TaskU BackEnd: Logger time definition;
function getTime() {
    let now = new Date();
    return now.toUTCString();
}

function doLog(line, level='Debug') {
    if (typeof line !== 'string') line = JSON.stringify(line)
    line = `${getTime()} - ${level} - ${line}\n` 
    // console.log(line);
    fs.appendFileSync('./logs/backend.log',line);
}

module.exports = {
    debug(line){
        doLog(line, "Debug")
    },
    info(line){
        doLog(line, "Info")
    },
    warn(line){
        doLog(line, "Warn")
    },
    error(line){
        doLog(line, "Error")
    }
}