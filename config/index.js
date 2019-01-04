const REMOTE_SERVER = "192.168.0.10"
const DEFAULT_HOST = {
    host:REMOTE_SERVER,
    port:22,
    username:"root",
    name:"dist",
    password:"deos8888",
    localPath:'',
    path:"/deos/webroot/test"
}
module.exports = {
  NODE_ENV: '"production"',
  REMOTE_HOST:REMOTE_SERVER,
  DEFAULT_HOST:DEFAULT_HOST
}