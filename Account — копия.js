function onRequest(request) {

    if (request.accounts) {

        var AMS_Invoke = "AMS";
        var AMS_Invoke_prefix = " - AMS";
        var AMS_Invoke_value = 10;
        var OrgSync = "OrgSync";
        var OrgSync_prefix = " - OS";
        var OrgSync_value = 3;
        var CampusLabs = "Campus Labs";
        var CampusLabs_prefix = " - CL";
        var CampusLabs_value = 5;

        var accounts = request.accounts;

        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];

            var subsidiares = formatSubsidiares(account.subsidiares);

            for (var i = 0; i < subsidiares.length; i++) {
                var name = subsidiares[i].name;

                var id = subsidiares[i].id;

                if (name.indexOf(AMS_Invoke) != -1) {
                    createCustomer(account, AMS_Invoke_value, AMS_Invoke_prefix, id);
                }
                if (name.indexOf(OrgSync) != -1) {
                    createCustomer(account, OrgSync_value, OrgSync_prefix, id);
                }
                if (name.indexOf(CampusLabs) != -1) {
                    createCustomer(account, CampusLabs_value, CampusLabs_prefix, id);
                }
            }
        }
    }
};


function createCustomer(account, subsidiary, postfix, external_id) {

    try {

        var customer = nlapiCreateRecord("customer");

        customer.setFieldValue("companyname", account.name + postfix);
        customer.setFieldValue("custentity212", account.IPEDS_number);
        customer.setFieldValue("url", account.web_site);
        customer.setFieldValue("defaultaddress", account.billing_address);
        customer.setFieldValue("subsidiary", subsidiary);
        customer.setFieldValue("entitystatus", 13);
        customer.setFieldValue("custentity_type", 20);
        customer.setFieldValue("custentity_organization_type", 7);
        customer.setFieldValue("externalid", external_id);

        nlapiSubmitRecord(customer, true);
    } catch (ex) {

    }

}

function formatSubsidiares(subsidiares) {

    var res = [];

    var groups = subsidiares.split(',');

    for (var i = 0; i < groups.length; i++) {
        var details = groups[i].split('&amp;');

        var obj = {
            name: details[0],
            id: details[1]
        }

        res.push(obj);
    }

    return res;
}