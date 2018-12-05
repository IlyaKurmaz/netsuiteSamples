
var obj = {
    "contacts": [
        {
            "subsidiares": "Campus Labs"
        }
    ]
}

function onRequest(request) {

    
    var IModules = "iModules Software, Inc."; //1
    var IModules_value = 1;
    var OrgSync = "OrgSync, Inc."; //3
    var OrgSync_value = 3;
    var CampusLabs = "Campus Labs"; //5
    var CampusLabs_value = 5;

    if (request.contacts) {

        var contacts = request.contacts;

        for (var i = 0; i < contacts.length; i++) {
            var contact = contacts[i];

            var subsidiares = contact.subsidiares;

            var subsidiaryValue;
            
            if (subsidiares.indexOf(IModules) != -1) {
                subsidiaryValues = IModules_value;
            }

            if (subsidiares.indexOf(OrgSync) != -1) {
                subsidiaryValue = OrgSync_value;
            }

            if (subsidiares.indexOf(CampusLabs) != -1) {
                subsidiaryValue = CampusLabs_value;
            }


            createContact(contact, subsidiaryValue);
    
        }
    }
};


function createContact(contact, subsidiary) {

        var contact = nlapiCreateRecord("contact");

        contact.setFieldValue("subsidiary", subsidiary);
       
        nlapiSubmitRecord(contact, true);

}
