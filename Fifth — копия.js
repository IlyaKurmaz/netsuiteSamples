/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *@NModuleScope Public
*/

define(['N/record'], 

function(record){

function post(context){

var salesOrder = record.create({
            type: record.Type.SALES_ORDER, 
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
});