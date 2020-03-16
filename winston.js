const appRoot = require('app-root-path');    // app root 경로를 가져오는 lib
const winston = require('winston');            // winston lib
const process = require('process');
var moment = require('moment');

 
const { combine, timestamp, label, printf } = winston.format;
 
const myFormat = printf(({ level, message, label, timestamp }) => {
  return moment().format('YYYY-MM-DD HH:mm:ss') + ` ${level}: ${message}`;    // log 출력 포맷 정의
});
 
const options = {
  // log파일
  file: {
    level: 'info',
    filename: `${appRoot}/logs/image-log.log`, // 로그파일을 남길 경로
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    colorize: false,
    format: combine(
      myFormat    // log 출력 포맷
    )
  },

  console: {
    level: 'debug',
    handleExceptions: true,
    json: false, 
    colorize: true,
    timestamp: function() { return moment().format('YYYY-MM-DD HH:mm:ss'); },
    format: combine(
      label({ label: 'nba_express' }),
      timestamp(),
      myFormat
    )
  }
}
 
let logger = new winston.createLogger({
  transports: [
    new winston.transports.File(options.file) // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
  ],
  exitOnError: false, 
});
 
 
module.exports = logger;