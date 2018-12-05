
function post(record){

var salesOrder = record.create({
            type: record.Type.SALES_ORDER, 
            isDynamic: true,
            defaultValues: {
                entity: record.customer_id
            } 
        });

salesOrder.setValue('trandate', record.trandate);
salesOrder.setValue('orderstatus', record.orderstatus);

salesOrder.selectNewLine({ //add a line to a sublist
    sublistId: 'item'      //specify which sublist
});

salesOrder.setCurrentSublistValue({   //set item field
    sublistId: 'item',
    fieldId: 'item',
    value: internal_id  //replace with item internal id 
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'quantity',
    value: quantity //replace with quantity
});

salesOrder.setCurrentSublistValue({
    sublistId: 'item',
    fieldId: 'amount',
    value: record.amount//replace with quantity
});

//repeat above pattern to set the rest of the line fields

salesOrder.commitLine({  //writes the line entry into the loaded record
    sublistId: 'item'
});

salesOrder.save({                  //writes record back to database
    ignoreMandatoryFields: true    //set for testing in case you want to create a record without validating which can give errors
});
}