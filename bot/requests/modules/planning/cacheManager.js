const https = require('https');
const ping = require('ping');
const fs = require('fs');
const path = require('path');
const nodeIcal = require('node-ical');

const indexUrl = "https://ent-toulon.isen.fr/webaurion/ICS/listeICS.json";

async function getServerIndex(){
    var pingResult = await ping.promise.probe('ent-toulon.isen.fr');
    if(pingResult.alive){
        return new Promise((resolve, reject) => {
            https.get(indexUrl, (res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        let json = JSON.parse(body);
                        json.updated = new Date(parseInt(json.updated)*1000);
                        resolve(json);
                    } catch (error) {
                        console.error(error.message);
                        reject(error);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        });
    }
    else return undefined;
}

async function getIndex(){
    if(!fs.existsSync(path.join(__dirname, '/cache/index.json'))) return await getServerIndex();
    let json = JSON.parse(fs.readFileSync(path.join(__dirname, '/cache/index.json'), 'utf8'));
    json.updated = new Date(json.updated);
    return json;
}

async function isCacheUpToDate(){
    var index = await getServerIndex();
    if(index){
        if(fs.existsSync(path.join(__dirname, '/cache/index.json'))){
            var cache = JSON.parse(fs.readFileSync(path.join(__dirname, '/cache/index.json'), 'utf8'));
            cache.updated = new Date(cache.updated);
            if(cache.updated.getTime() == index.updated.getTime()) return true;
            else return false;
        }else return false;
    } else return true;
}

async function updateCache(){
    if(isCacheUpToDate()) return;
    var index = await getServerIndex();
    if(index){
        if(!fs.existsSync(path.join(__dirname, '/cache'))) fs.mkdirSync(path.join(__dirname, '/cache'));
        fs.writeFileSync(path.join(__dirname, '/cache/index.json'), JSON.stringify(index));
        var promises = [];
        for(var user of index.indexUsers){
            promises.push(updateUserCache(user));
        }
        return Promise.all(promises);
    }
    return null;
}

async function updateUserCache(user){
    var userICALurl = "https://ent-toulon.isen.fr/webaurion/ICS/"+user+".ics";
    var pingResult = await ping.promise.probe('ent-toulon.isen.fr');
    if(pingResult.alive){
        return new Promise((resolve, reject) => {
            https.get(userICALurl, (res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        fs.writeFileSync(path.join(__dirname, '/cache/'+user+'.ics'), body);
                        resolve(nodebody);
                    } catch (error) {
                        console.error(error);
                        reject(error);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        });
    }
}

async function getServerICSofUser(user){
    var userICALurl = "https://ent-toulon.isen.fr/webaurion/ICS/"+user+".ics";
    var pingResult = await ping.promise.probe('ent-toulon.isen.fr');
    if(pingResult.alive){
        return new Promise((resolve, reject) => {
            https.get(userICALurl, (res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        resolve(nodeIcal.parseICS(body));
                    } catch (error) {
                        console.error(error);
                        reject(error);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        });
    } 
}

async function getUserICS(user){
    let result = {};
    let index = await getIndex();
    if(await isCacheUpToDate()){
        if(index) if(!index.indexUsers.includes(user)) return undefined;
        result.updated = index.updated;
        let ICSFile = fs.readFileSync(path.join(__dirname, '/cache/'+user+'.ics'), 'utf8');
        result.ics = nodeIcal.parseICS(ICSFile);
        return result;
    } else {
        updateCache();
        var pingResult = await ping.promise.probe('ent-toulon.isen.fr');
        if(pingResult.alive){
            let index = await getServerIndex();
            result.updated = index.updated;
            result.ics = await getServerICSofUser(user);
            return result;
        }
    }
    if(fs.existsSync(path.join(__dirname, '/cache/'+user+'.ics'))){
        result.updated = index.updated;
        result.ics = nodeIcal.parseICS(fs.readFileSync(path.join(__dirname, '/cache/'+user+'.ics'), 'utf8'));
        return result;
    }
}

const blackList = [
    "pierre.cour"
]

async function getUserList(){
    let index = await getIndex();
    if(index) return index.indexUsers.filter((value) => {return !blackList.includes(value)});
    return [];
}

updateCache();

module.exports = {
    getUserICS, getUserList
}