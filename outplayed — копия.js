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
    	returnObj.post = doPost;
	return returnObj;
}

function doPost(restletBody){
   var salesOrder = RECORDMODULE.create({
            type: RECORDMODULE.Type.SALES_ORDER, 
            isDynamic: true,
            defaultValues: {
                entity: restletBody.customer_id
            } 
        });

salesOrder.setValue('trandate', restletBody.trandate);
salesOrder.setValue('orderstatus', restletBody.orderstatus);

salesOrder.selectNewLine({
    sublistId: 'item'
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: restletBody.internal_id
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: restletBody.quantity
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'amount',
    value: restletBody.amount
});


salesOrder.commitLine({
    sublistId: 'item'
});

salesOrder.save({                  
    ignoreMandatoryFields: true
});
}