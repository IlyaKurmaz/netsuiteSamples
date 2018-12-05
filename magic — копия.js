/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(["N/record"], function (record) {
    function onRequest(context) {

        /*if(!context){
            log.debug('Empty');
        }*/

        //log.debug(context);

        var order = record.create({
            type: record.Type.SALES_ORDER,
            isDynamic: true,
            trandate: context.trandate,
            orderstatus: context.orderstatus,
            entity: context.customer_id/*,
            defaultValues: {
                entity: "123039",
                trandate: "10/22/2018",
                orderstatus: "1"
            }*/
        });

        //log.debug('order created');
        
        addLine(order, context);

    }
    
    function addLine(order, context) {

    //log.debug('line started');

    order.selectNewLine({
        sublistId:"item"
    });

    order.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "item",
        value: context.internal_id
    });
    
    order.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "quantity",
        value: context.quantity
    });

    order.setCurrentSublistValue({
        sublistId: "item",
        fieldId: "amount",
        value: context.amount
    });

    order.commitLine({sublistId:"item"});
}
 
    return {
        onRequest: onRequest
    };
});



