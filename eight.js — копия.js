var RECORDMODULE;
 
/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *@NModuleScope Public
 */
define(['N/record'], runRestlet);
 
//********************** MAIN FUNCTION **********************
function runRestlet(record){
	RECORDMODULE = record;
    
	var returnObj = {};
    	returnObj.get = doGet;
    	returnObj.post = doPost;
    	returnObj.put = doPut;
	returnObj.delete = doDelete;
	return returnObj;
}
 
function doGet(restletBody){
    log.debug('Called from GET', restletBody);
    return "Hello from GET.<br /> Data received:<br />" + JSON.stringify(restletBody);
}
 
function doPost(restletBody){
    log.debug('Called from POST', restletBody);
    return "Hello from POST.\nData received:\n" + JSON.stringify(restletBody);
}
 
function doPut(restletBody){
    log.debug('Called from PUT', restletBody);
    return "Hello from PUT.\nData received:\n" + JSON.stringify(restletBody);
}
 
function doDelete(restletBody){
    log.debug('Called from DELETE', restletBody);
    return "Hello from DELETE.\nData received:\n" + JSON.stringify(restletBody);
}