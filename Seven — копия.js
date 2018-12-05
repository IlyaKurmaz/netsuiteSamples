var RECORDMODULE
 
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
   	returnObj.post = post;
}
 

function post(context){
    var salesOrder = RECORDMODULE.create({
            type: RECORDMODULE.Type.SALES_ORDER, 
            isDynamic: true,
            defaultValues: {
                entity: context.customer_id
            } 
        });

salesOrder.setValue('trandate', context.trandate);
salesOrder.setValue('orderstatus', context.orderstatus);

salesOrder.selectNewLine({
    sublistId: 'item'
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: context.internal_id
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: context.quantity
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'amount',
    value: encontext.amount
});


salesOrder.commitLine({
    sublistId: 'item'
});

salesOrder.save({                  
    ignoreMandatoryFields: true
});

}
