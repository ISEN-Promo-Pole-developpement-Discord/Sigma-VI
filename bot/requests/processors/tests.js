const {assert} = require('chai');
const {getListOfModules, getModuleKeys, getModuleTests, getModulePath} = require('../modules/modulesManager.js');
const {getPerModuleScores, getBestStringModule} = require('./getScore.js');
const {Request} = require('../requestClass');
const fs = require('fs');

function testRequestScore() {
    var modules = getListOfModules();
    for(var module of modules){
        path = getModulePath(module);
        assert.isTrue(fs.existsSync(path), "[MODULE TEST] the module \""+module+"\" doesn't exist");
        assert.isTrue(fs.existsSync(path+'/mod.js'), "[MODULE TEST] the module \""+module+"\" doesn't have a mod.js file");
        assert.isTrue(fs.existsSync(path+'/#keys.json'), "[MODULE TEST] the module \""+module+"\" doesn't have a #keys.json file");
        assert.isTrue(fs.existsSync(path+'/#tests.json'), "[MODULE TEST] the module \""+module+"\" doesn't have a #tests.json file");
        var keys = getModuleKeys(module);
        assert.isObject(keys, "[MODULE TEST] the module \""+module+"\" has invalid keys in #keys.json");
        // assert.isNotEmpty(keys, "[MODULE TEST] the module \""+module+"\" has no keys");
        if(keys !== null){
            for(var key in keys){
                assert.isAtLeast(getPerModuleScores(key)[module], keys[key], "[MODULE TEST] the module \""+module+"\" has invalid score for the key "+key+" : "+getPerModuleScores(key)[module]);
            }
        }
        var tests = getModuleTests(module);
        // assert.isArray(tests, "[MODULE TEST] the module \""+module+"\" has no tests");
        // assert.isNotEmpty(tests, "[MODULE TEST] the module \""+module+"\" has no tests");
        if(tests !== null){
            for(var test of tests){
                testString = new Request(null, test).SRWF();
                assert.isFinite(getPerModuleScores(testString)[module], "[MODULE TEST] the module \""+module+"\" has no score for the test \""+test+"\"");
                var scores = getPerModuleScores(testString);
                var scoresString = "";
                for(var score in scores) scoresString += " ["+score+" : "+scores[score]+"]";
                assert.equal(getBestStringModule(testString), module, "[MODULE TEST] the module \""+module+"\" didn't get the best score for his test \""+test+"\" ("+scoresString+")");
            }
        }
        assert.isFunction(require(path+'/mod.js'), "[MODULE TEST] the module \""+module+"\" doesn't have a valid mod.js file");
    }
}

module.exports = {testRequestScore};