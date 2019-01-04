const fs = require('fs')
const archiver = require('archiver')
const env = require('../config/index')
const path  = require('path')

module.exports = function (option,cb){
    option = option ? option :{}
    console.log(option)
    var output =  fs.createWriteStream(path.join(process.cwd(),`${env.DEFAULT_HOST.name}.zip`))
    var archive = archiver('zip')
    output.on('close',()=>{
        cb();
    })
    archive.on('error',function(err){
        throw err;
    })
    archive.pipe(output)
    archive.directory(option.local,'')
    archive.finalize();
}