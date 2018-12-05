function onRequest(request) {

    if (request.items) 
    {
        var items = request.items;
          
        for(var i = 0; i < items.length; i++)
        {
            var item = items[i];

            var opportunity = nlapiLoadRecord("opportunity", item.opportunity_id);

            var updatedOpportunity = assignLineItem(opportunity, item);

            nlapiSubmitRecord(updatedOpportunity, true);
     
        }
    }
};


function assignLineItem(netsuiteOpportunity, item) {
    
    netsuiteOpportunity.selectNewLineItem("item");
    netsuiteOpportunity.setCurrentLineItemValue("item", "item", item.internal_id);
    netsuiteOpportunity.setCurrentLineItemValue("item", "amount", item.amount);
    netsuiteOpportunity.setCurrentLineItemValue("item", "quantity", item.quantity);
    netsuiteOpportunity.setCurrentLineItemValue("item", "rate", item.unit_price);
    netsuiteOpportunity.setCurrentLineItemValue("item", "custcol_period_start", item.opportunity_start_date);
    netsuiteOpportunity.setCurrentLineItemValue("item", "custcol_period_end", item.opportunity_end_date);


    netsuiteOpportunity.commitLineItem("item");

    return netsuiteOpportunity;

}