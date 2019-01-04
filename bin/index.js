#!/usr/bin/env node
// var sshTool = require('../lib/sshTool')

var program = require('commander')
var inquirer = require('inquirer')
var connet = require('../lib/index')
var path = require('path')
program.version(require('../package.json').version)
        .option('-u,--upload','upload file')
        .option('-d,--dowload','dowload file')
        .parse(process.argv)

if(program.upload){
    inquirer.prompt([{
        type:'input',
        name:'local',
        message:'本地文件夹',
        transformer:function(p){
            return path.join(process.cwd(),p)
        }
    },{
        type:'input',
        name:'remote',
        message:'远程路径'
    }]).then(data=>{
        connet({
            type:'upload',
            local:path.join(process.cwd(),data.local),
            remote:data.remote
        });
    })
}
if(program.dowload){
  
}
