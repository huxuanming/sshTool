const Client = require('ssh2').Client
const env = require('../config')
const chalk = require('chalk')
const fs = require('fs')
const readline = require('readline')
const compress = require('./compress')
const upload = require('./upload')
module.exports = function (option){
    option = option ? option :{}
    var conn = new Client();
    const connectInfo = {
        host:env.DEFAULT_HOST.host,
        port:env.DEFAULT_HOST.port,
        username:env.DEFAULT_HOST.username,
        password:env.DEFAULT_HOST.password
    }
    compress(option,function(){
        upload(option)
    })
    // conn.on('ready',function(){
    //     console.log(chalk.yellow('Client:: ready'))
    //     console.log(option)
       
    //     conn.end();
    //     // const rl = readline.createInterface({
    //     //     input: process.stdin,
    //     //     output: process.stdout
    //     //   });
    //     //   rl.on('line',(input)=>{
    //     //         conn.shell(function(err,stream){
    //     //             if(err) throw err;
    //     //             stream.on('close',()=>{
    //     //                 conn.end();
    //     //                 rl.close();
    //     //             })
    //     //             stream.on('data',(data)=>{
    //     //                 console.log(data.toString())
    //     //             }).stderr.on('data',data=>{
    //     //                 console.log(data)
    //     //             })
               
    //     //             stream.write(input+'\n');
    //     //             stream.end() 
    //     //         })    
    //     //   })
    // }).connect(connectInfo)
}
