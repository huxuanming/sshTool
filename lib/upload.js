const Client = require('ssh2').Client
const env = require('../config')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
let spinners = ora('上传文件中...')

/**
 *上传文件
 *@param conn
 *@param option
 */
function UploadFile (conn,option) {
    const local = path.join(process.cwd(),`${env.DEFAULT_HOST.name}.zip`)
    const remote = `${option.remote}/${env.DEFAULT_HOST.name}.zip`
    if(!conn){
        return 
    }
        conn.sftp(function(err,sftp){
        sftp.fastPut(local,remote,{},function(err,res){
            if(err){
                conn.end();
            }else{
                Shell(conn,option)
            }
        }) 
    })
}
function Shell (conn,option) {
    conn.shell(function(err,stream){
        if(err) throw err
        const uploadShellList = [
            `cd ${option.remote}\n`,
            `rm -rf ${env.DEFAULT_HOST.name}.bak\n`,
            `unzip -o ${env.DEFAULT_HOST.name}.zip\n`,
            `rm -rf ${env.DEFAULT_HOST.name}.zip\n`,
            `exit\n`
        ]
        stream.on('close',function(){
            console.log('\n stream::close \n')
            spinners.stop()
            conn.end()
            fs.unlinkSync(path.join(process.cwd(),`${env.DEFAULT_HOST.name}.zip`))
            console.log(chalk.cyan('Move complete.\n'))     
            const notifier = require('node-notifier');
            notifier.notify({
                title: '通知消息',
                icon: path.join(__dirname, 'logo.png'),
                wait:true,
                message: 'Move complete.'
            });
        })

        stream.on('data',function(data){
            // console.log('STDOUT:'+data)
        }).stderr.on('data',function(data){
            console.log('STDERR: '+data)
        })
        stream.end(uploadShellList.join(''))
    })
}
function Publish(conn,user,option){
    conn.on('ready',function(){
            console.log('ready');
          spinners.start()
          UploadFile(conn,option)
    }).connect(user)
}
module.exports = function(option) {
    option = option ? option: {}
    const user = {
        host:env.DEFAULT_HOST.host,
        port:env.DEFAULT_HOST.port,
        username:env.DEFAULT_HOST.username,
        password:env.DEFAULT_HOST.password
    }
    const conn = new Client();
    if(!user.password && !user.username){
        console.log(chalk.yellow(`发布到服务器${env.DEFAULT_HOST.host}`))
        inquirer.prompt([{
            type:'input',
            name:'username',
            message:`请输入用户名：`
        },{
            type:'input',
            name:'password',
            message:`请输入服务器密码：`,
            transformer:(p)=>{
                return p.replace(/.+?/img,'*')
            }
        }]).then(answer=>{
                    user.password = answer.password.replace(/\r\n$/,'')
                    user.username = answer.username.replace(/\r\n$/,'')
                    Publish(conn,user,option)    
        })
    }else if(user.password){
        Publish(conn,user,option)
    }else{
        console.log(chalk.yellow(`发布到服务器${env.DEFAULT_HOST.host}`))
        inquirer.prompt([{
            type:'input',
            name:'password',
            message:`请输入服务器密码：`,
            transformer:(p)=>{
                return p.replace(/.+?/img,'*')
            }
        }]).then(answer=>{
            if(answer.password !== null){
                user.password = answer.password.replace(/\r\n$/,'')
                Publish(conn,user,option)
            }
        })
    }
}