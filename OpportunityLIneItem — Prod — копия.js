function onRequest(request) {

    if (request.items) {

        var items = request.items;

        var opportunityGroupedItems = groupBy(items, 'opportunity');

        var opportunities = Object.keys(opportunityGroupedItems);

        for (var g = 0; g < opportunityGroupedItems.length; g++) {

            if (opportunities[g] == 'length') {
                continue;
            }

            var groups = groupBy(opportunityGroupedItems[opportunities[g]], 'kitName');

            var keys = Object.keys(groups);

            for (var i = 0; i < groups.length; i++) {

                if (keys[i] == 'length') {
                    continue;
                }

                var key = keys[i];

                var itemKit;

                var search = nlapiSearchGlobal(key);

                for (var z = 0; z < search.length; z++) {
                    if (search[z].recordType == 'itemgroup') {
                        itemKit = nlapiLoadRecord('itemgroup', search[z].id);
                    }
                }

                var kitGroup = groups[key];

                var kitGroupItemIds = new Array();

                for (var s = 0; s < kitGroup.length; s++) {
                    kitGroupItemIds.push(kitGroup[s].internal_id);
                }

                var opportunity = nlapiLoadRecord('opportunity', opportunities[g])

                opportunity.selectNewLineItem('item')
                opportunity.setCurrentLineItemValue("item", "item", itemKit.id);
                opportunity.commitLineItem("item");
                nlapiSubmitRecord(opportunity, true);

                var members = opportunity.getLineItemCount('item');

                for (var member = 1; member <= members; member++) {

                    var netsuiteItem = itemKit.getLineItemValue('member', 'item', member);
    
                    var id = parseInt(netsuiteItem);
    
                    if (kitGroupItemIds.indexOf(id) == -1) {
                        continue;
                    } else {
    
                        var exportedItem = findById(items, id);
    
                        if(!exportedItem)
                        {
                            continue;
                        }
    
                        opportunity.selectNewLineItem("item");
                        opportunity.setCurrentLineItemValue("item", "item", netsuiteItem);
                        opportunity.setCurrentLineItemValue("item", "quantity", exportedItem.quantity);
                        opportunity.setCurrentLineItemValue("item", "rate", exportedItem.unit_price);
                        opportunity.setCurrentLineItemValue("item", "amount", exportedItem.quantity * exportedItem.unit_price);
                        opportunity.setCurrentLineItemValue("item", "custcol_period_start", exportedItem.opportunity_start_date);
                        opportunity.setCurrentLineItemValue("item", "custcol_period_end", exportedItem.opportunity_end_date);
                        opportunity.setCurrentLineItemValue("item", "externalid", exportedItem.external_id);
    
    
                        opportunity.commitLineItem("item");
                    }
    
                }
                nlapiSubmitRecord(opportunity, true);


            }
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

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        rv.length = Object.keys(rv).length ;
        return rv;
    }, {});
};


function findById(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].internal_id == id) {
            return array[i];
        }
    }

    return null;
}