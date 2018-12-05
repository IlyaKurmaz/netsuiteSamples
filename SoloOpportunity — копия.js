function onRequest(request) {

    if (request.opportunities) {

        var opportunities = request.opportunities;

        var groups = groupBy(opportunities, 'contract_id');

        var keys = Object.keys(groups);

        for (var z = 0; z < groups.length; z++) {
            if (keys[z] == 'length') {
                continue;
            }

            var title = "Default";

            var group = groups[keys[z]];

            var term = getTerm(group);

            var statuses = getStatuses(group);

            var acv = getOpportunityACV(group);

            var lastAnnualFee = getLastAnnualFee(group);

            var opportunity = group[0];

            title = opportunity.title;

            createNetsuiteOpportunity(opportunity, title, term, statuses, acv, lastAnnualFee);

        }
    }
}

function createNetsuiteOpportunity(opportunity, title, term, statuses, acv, lastAnnualFee) {

    var netsuiteOpportunity = nlapiCreateRecord("opportunity");

    var entities = nlapiSearchGlobal(opportunity.opportunity_owner);

    if (!entities) {
        return;
    }

    var owner;

    for (var i = 0; i < entities.length; i++) {
        if (entities[i].recordType == 'employee') {
            owner = entities[i];
        }
    }

    if (!owner) {
        return;
    }

    netsuiteOpportunity.setFieldValue("title", title);
    netsuiteOpportunity.setFieldValue("trandate", opportunity.tran_date);
    netsuiteOpportunity.setFieldValue("expextedclosedate", opportunity.expected_close_date);
    netsuiteOpportunity.setFieldValue("probability", opportunity.probability);
    netsuiteOpportunity.setFieldValue("entity", opportunity.entity);
    netsuiteOpportunity.setFieldValue("entitystatus", opportunity.entity_status);

    var crossSellStatus = statuses['crossSellStatus'];

    var renewalStatus = statuses['renewalStatus'];

    netsuiteOpportunity.setFieldValue("custbody3", crossSellStatus);
    netsuiteOpportunity.setFieldValue("custbody_renewal", renewalStatus);

    netsuiteOpportunity.setFieldValue("custbody_product_opportunity", "");
    netsuiteOpportunity.setFieldValue("salesrep", owner.id);
    netsuiteOpportunity.setFieldValue("total", 100);
    netsuiteOpportunity.setFieldValue("custbodyoppty_avg_monthly_fees", lastAnnualFee);
    netsuiteOpportunity.setFieldValue("custbodyoppty_term", term);

    netsuiteOpportunity.setFieldValue("department ", 8);
    netsuiteOpportunity.setFieldValue("custbody_product_opportunity ", 9);


    netsuiteOpportunity.setFieldValue("externalid", opportunity.external_id);


    //try {
        nlapiSubmitRecord(netsuiteOpportunity, true);
    //} catch (e) {}

    return netsuiteOpportunity;
}

function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        rv.length = Object.keys(rv).length;
        return rv;
    }, {});
};

function getTerm(group) {
    var term = 0;

    var startYear = 2018
    var startMonth = 0;

    var endYear = 2018;
    var endMonth = 0;

    for (var i = 0; i < group.length; i++) {

        var startDate = new Date(group[i].start_date);

        var localStartMonth = startDate.getMonth();

        var localStartYear = startDate.getFullYear();

        if (i == 0) {
            startMonth = localStartMonth,
                startYear = localStartYear

        }

        if (localStartYear < startYear) {
            startYear = localStartYear
        }

        if (localStartMonth < startMonth && localStartYear == startYear) {
            startMonth = localStartMonth
        }

        var endDate = new Date(group[i].end_date);

        var localEndMonth = endDate.getMonth();

        var localEndYear = endDate.getFullYear();


        if (i == 0) {
            endMonth = localEndMonth,
                endYear = localEndYear
        }

        if (localEndYear > endYear) {
            endYear = localEndYear;
        }

        if (localEndMonth > endMonth && localEndYear == endYear) {
            endMonth = localEndMonth;
        }

        if (startYear == endYear) {
            term = endMonth - startMonth;
        } else {
            term = (endYear - startYear) * 12 + (endMonth - startMonth);
        }

    }

    return term;

}

function getStatuses(group) {
    var renewalStatus = 'F';
    var crossSellStatus = 'F';

    for (var i = 0; i < group.length; i++) {
        if (group[i].status.indexOf('Renewal') != -1) {
            renewalStatus = 'T';
        }
        if (group[i].status.indexOf('Upsell') != -1) {
            crossSellStatus = 'T';
        }
    }

    var result = {
        renewalStatus: renewalStatus,
        crossSellStatus: crossSellStatus
    }

    return result;
}

function getOpportunityACV(group) {
    var acv = 0;

    for (var i = 0; i < group.length; i++) {

        if (group[i].status.indexOf('Closed') != -1 && group[i].rating == '') {
            acv += group[i].target_acv;
        }
    }

    return acv;
}

function getLastAnnualFee(group) {

    var lastAnnualFee = 0;

    for (var i = 0; i < group.length; i++) {

        if (group[i].status.indexOf('Renewal') != -1) {
            lastAnnualFee += group[i].last_annual_fee;
        }
    }

    return lastAnnualFee;
}