var floorLinkMap = {
    0: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-1.12,1.39&ss=20",
    1: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=.3,1.45&ss=267",
    2: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-.77,1.36&ss=360",
    3: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-1.85,1.31&ss=281",
    4: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-.47,1.27&ss=160",
    5: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-1.5,1.31&ss=120",
    6: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-.98,1.38&ss=223",
    7: "https://my.matterport.com/show/?m=kCSXk466psY&cloudEdit=1&sr=-1.6,1.47&ss=312"
}

/**
 * Get a floor 3d link at ISEN from its number
 * @param {string|number} floor The floor number or room number
 * @returns {string} The floor 3d link
 */
function getFloor3DLink(floor){
    if(typeof floor !== "string" && typeof floor !== "number")
        throw new TypeError("floor must be a string or a number");
    floor = floor.toString();
    floorNumber = floor.slice(0, 1);
    if(!floorLinkMap[floorNumber]) return "https://my.matterport.com/show/?m=kCSXk466psY";
    return floorLinkMap[parseInt(floorNumber)];
}

module.exports = getFloor3DLink;