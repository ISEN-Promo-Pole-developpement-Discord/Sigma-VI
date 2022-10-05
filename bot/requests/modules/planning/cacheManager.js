const https = require('https');
const fs = require('fs');
const path = require('path');
const nodeIcal = require('node-ical');

const indexUrl = "https://ent-toulon.isen.fr/webaurion/ICS/" + global.config.planningToken;

async function getServerIndex(){
    return new Promise((resolve, reject) => {
        try{
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
                        resolve(null);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
                resolve(null);
            });
        }catch(error){
            console.error(error);
            resolve(null);
        }
    });
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
    if(await isCacheUpToDate()) return;
    var index = await getServerIndex();
    console.log("Updating planning cache...");
    if(index){
        if(!fs.existsSync(path.join(__dirname, '/cache'))) fs.mkdirSync(path.join(__dirname, '/cache'));
        fs.writeFileSync(path.join(__dirname, '/cache/index.json'), JSON.stringify(index));
        var promises = [];
        for(var user of index.indexUsers){
            promises.push(updateUserCache(user));
        }
        return Promise.all(promises);
    }
    console.log("Failed to get index from server");
    return null;
}

async function updateUserCache(user){
    var userICALurl = "https://ent-toulon.isen.fr/webaurion/ICS/"+user+".ics";
    return new Promise((resolve, reject) => {
        try{
            https.get(userICALurl, (res) => {
                let body = "";
            
                res.on("data", (chunk) => {
                    body += chunk;
                });
            
                res.on("end", () => {
                    try {
                        fs.writeFileSync(path.join(__dirname, '/cache/'+user+'.ics'), body);
                        resolve(true);
                    } catch (error) {
                        console.error(error);
                        resolve(null);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
                resolve(null);
            });
        }
        catch(error){
            console.error(error);
            resolve(null);
        }
    });
}

async function getServerICSofUser(user){
    var userICALurl = "https://ent-toulon.isen.fr/webaurion/ICS/"+user+".ics";
    return new Promise((resolve, reject) => {
        try{
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
                        resolve(null);
                    };
                });
            
            }).on("error", (error) => {
                console.error(error.message);
            });
        }
        catch(error){
            console.error(error);
            resolve(null);
        }
    });
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
        let index = await getServerIndex();
        result.updated = index.updated;
        result.ics = await getServerICSofUser(user);
        if(result.ics) return result;
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

async () => {
    if(await updateCache()) console.log("Cache updated.");
    else console.log("Cache update failed.");
}
    

module.exports = {
    getUserICS, getUserList
}