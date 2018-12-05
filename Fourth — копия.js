define(['N/record'], function(record){

function post(entity){

var salesOrder = record.create({
            type: record.Type.SALES_ORDER, 
            isDynamic: true,
            defaultValues: {
                entity: entity.customer_id
            } 
        });

salesOrder.setValue('trandate', entity.trandate);
salesOrder.setValue('orderstatus', entity.orderstatus);

salesOrder.selectNewLine({
    sublistId: 'item'
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'item',
    value: internal_id
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: quantity
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'amount',
    value: entity.amount
});


salesOrder.commitLine({
    sublistId: 'item'
});

salesOrder.save({                  
    ignoreMandatoryFields: true
});
}
});