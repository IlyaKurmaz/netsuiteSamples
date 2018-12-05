function onRequest(request) {
  
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
  
              var group = groups[keys[z]];
  
              var dates = getDates(group);
  
              var earliestDate = dates['earliestDate'];
  
              var latestDate = dates['latestDate'];
  
              for (var k = 0; k < group.length; k++) {
  
                  var opportunity = group[k];
  
                  if (!opportunity.items) {
                      continue;
                  }
  
                  var order = createOrder(opportunity);
  
                  var items = opportunity.items;
  
                  for (var i = 0; i < items.length; i++) {
  
                      var item = items[i];
  
                      try {
  
                          assignLineItem(order, item, earliestDate, latestDate, earliestDate, latestDate);
                      } catch(ex) {
  
                      }
                  }
  
                  nlapiSubmitRecord(order, true);
  
              }
          }
      }
  }
  
  function assignLineItem(order, item, startDate, endDate, arm_rev_start, arm_rev_end) {
          order.selectNewLineItem("item");
  
          order.setCurrentLineItemValue("item", "item", item.internal_id);
          order.setCurrentLineItemValue("item", "quantity", item.quantity);
          order.setCurrentLineItemValue("item", "rate", item.unit_price);
          order.setCurrentLineItemValue("item", "amount", item.quantity * item.unit_price);
          order.setCurrentLineItemValue("item", "custcol_period_start", startDate);
          order.setCurrentLineItemValue("item", "custcol_period_end", endDate);
          order.setCurrentLineItemValue("item", "custcol5", arm_rev_start);
          order.setCurrentLineItemValue("item", "custcol6", arm_rev_end);
  
          order.commitLineItem("item");
  
  }
  
  function createOrder(opportunity) 
  {
      var entities = nlapiSearchGlobal(opportunity.opportunity_owner);
  
      if(!entities)
      {
          return;
      }
  
      var owner;
  
      for(var i = 0; i < entities.length; i++)
      {
          if(entities[i].recordType == 'employee')
          {
              owner = entities[i]; 
          }
      }
  
      var order = nlapiCreateRecord("salesorder");
  
      order.setFieldValue("entity", opportunity.customer_id);
      order.setFieldValue("startdate", opportunity.start_date);
      order.setFieldValue("trandate", opportunity.tran_date);
      order.setFieldValue("enddate", opportunity.end_date);
      order.setFieldValue("salesrep", owner.id);
      order.setFieldValue("memo", opportunity.name);
      order.setFieldValue("otherrefnum", opportunity.po);
      order.setFieldValue("orderstatus", opportunity.order_status);
      order.setFieldValue("terms", 2);
      order.setFieldValue("customform", 146);
  
      return order;
  }
  
  function createItem(params) {
  
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
  
  
  function getDates(group)
  {
      var startDay = 0;
      var startMonth = 0;
      var startYear = 0;
  
      var endDay = 0;
      var endMonth = 0;
      var endYear = 0;
  
      for(var i = 0; i < group.length; i++)
      {
          var startDate = new Date(group[i].start_date);
  
          var localStartDay = startDate.getDay();
          var localStartMounth = startDate.getMonth() + 1;
          var localStartYear = startDate.getFullYear();
  
          if(i == 0)
          {
              startDay = localStartDay;
              startMonth = localStartMounth;
              startYear = localStartYear;
          }
  
          if(localStartYear > startYear)
          {
              startYear = localStartYear;
          }
  
          if(localStartMounth < startMonth && localStartYear == startYear)
          {
              startMonth = localStartMounth;
          }
  
          if(localStartDay < startDay && localStartMounth == startMonth && localStartYear == startYear)
          {
              startDay = localStartDay;
          }
  
          var endDate = new Date(group[i].end_date);
  
          var localEndDay = endDate.getDay();
          var localEndMonth = endDate.getMonth() + 1;
          var localEndYear = endDate.getFullYear();
  
          if(i == 0)
          {
              endDay = localEndDay;
              endMonth = localEndMonth;
              endYear = localEndYear;
          }
  
          if(localEndYear > endYear)
          {
              endYear = localEndYear;
          }
  
          if(localEndMonth > endMonth && localEndYear == endYear)
          {
              endMonth = endMonth;
          }
  
          if(localEndDay > endDay && localEndMonth == endMonth && localEndYear == endYear)
          {
              endDay = localEndDay;
          }
  
      }
  
      var earliestDate = startMonth + '/' + startDay + '/' + startYear;
  
      var latestDate = endMonth + '/' + endDay + '/' + endYear;
  
      var result = {
          earliestDate: earliestDate,
          latestDate: latestDate
      }
  
      return result;
  
  }