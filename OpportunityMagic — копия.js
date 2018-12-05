//var k = nlapiLoadRecord("opportunity", 874000)

function onRequest(request){

    if (request.opportunities) {

        var opportunities = request.opportunities;

        var groups = groupBy(opportunities, 'contract_id');

        var keys = Object.keys(groups);

        for (var z = 0; z < groups.length; z++) 
        {
            if(keys[z] == 'length')
            {
                continue;
            }

            var title = "Default";

            var itemPayload = [];

            var group = groups[keys[z]];

            for(var i = 0; i < group.length; i++)
            {
                var opportunity = group[i];

                if (!opportunity.items) {
                    continue;
                }

                var items = opportunity.items;

                if(i == 0)
                {
                    title = opportunity.name;
                }

                for (var index = 0; index < items.length; index++) {

                    var item = items[index];

                    itemPayload.push(item);
                    
                }
            }

            var netsuiteOpportunity = createNetsuiteOpportunity(opportunity, title);

            for(var i = 0; i < itemPayload.length; i++)
            {
                assignLineItem(netsuiteOpportunity, opportunity, itemPayload[i]);
            }

            nlapiSubmitRecord(netsuiteOpportunity, true);

        }
    }
}

function createNetsuiteOpportunity(opportunity, title) {
    
    var netsuiteOpportunity = nlapiCreateRecord("opportunity");

    netsuiteOpportunity.setFieldValue("title", title);
    netsuiteOpportunity.setFieldValue("trandate", opportunity.tran_date);
    netsuiteOpportunity.setFieldValue("expextedclosedate", opportunity.expected_close_date);
    netsuiteOpportunity.setFieldValue("probability", opportunity.probability);
    netsuiteOpportunity.setFieldValue("leadsource", "");
    netsuiteOpportunity.setFieldValue("entity", opportunity.entity);
    netsuiteOpportunity.setFieldValue("entitystatus", opportunity.entity_status);
    netsuiteOpportunity.setFieldValue("custbody3", opportunity.client_cross_sell);
    //netsuiteOpportunity.setFieldValue("custbody_renewal", "renewal");
    netsuiteOpportunity.setFieldValue("custbody_product_opportunity", "");
    //netsuiteOpportunity.setFieldValue("subsidiary", opportunity.subsidiary);
    //netsuiteOpportunity.setFieldValue("department", opportunity.department);
    netsuiteOpportunity.setFieldValue("salesrep", opportunity.opportunity_owner);
    //netsuiteOpportunity.setFieldValue("custbodyoppty_acv", "");
    netsuiteOpportunity.setFieldValue("custbodyoppty_term", opportunity.opportunity_term);

    nlapiSubmitRecord(netsuiteOpportunity, true);


    return netsuiteOpportunity;

    10225
    1430
}

function assignLineItem(netsuiteOpportunity, salesforceOpportunity, item) {
    
    netsuiteOpportunity.selectNewLineItem("item");
    netsuiteOpportunity.setCurrentLineItemValue("item", "item", item.internal_id);
    netsuiteOpportunity.setCurrentLineItemValue("item", "amount", item.amount);
    netsuiteOpportunity.setCurrentLineItemValue("item", "custcol_period_start", salesforceOpportunity.start_date);
    netsuiteOpportunity.setCurrentLineItemValue("item", "quantity", item.quantity);
    netsuiteOpportunity.setCurrentLineItemValue("item", "rate", item.unit_price);

    netsuiteOpportunity.commitLineItem("item");

}


function groupBy(xs, key) {
    var length = 0;
    
    return xs.reduce(function (rv, x) 
    {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        length++;
        rv.length = length;
        return rv;
    }, {});
};




