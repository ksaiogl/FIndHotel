exports.inputSchema =  function(){
  this.orderEntity = {
    "id": "",
    "globalOrderId" : "",
    "po_wo_referenceId": "",
    "offlineId": "",
    "po_wo_date": "", //Po/WO date
    "po_wo_amendmentNumber": 0, //Po/WO amendment order
    "po_wo_amendmentDate": "",
    "date" : new Date(),
    "po_wo_referenceDate": "",
    "createdBy" : "", //OMS user id
    "deletedByCRM" : false,
    "source": "", //Online / Email / Phone
    "channel": "",//Web, Responsive, Mobile/Android, Mobile/ios
    "isCreditOrder": false,
    "creditDays": 0,
    "type": "", //PO/ Work Order
    "segment": "", //Individual / Company
    "GSTType": "",
    "isGST" : "",
    "shipmentCreated" : false,
    "status": {
      "current": {},
      "history": []
    },
    "customerInformation": {
      "companyId": "",
      "companyName": "",
      "parentCompanyId": "",
      "parentCompanyName": "",
      "projectId": "",
      "projectName": "",
      "subProjectId": "", //Only for NF customers
      "subProjectName": "", //Only for NF customers
      "mileStoneId": "", //Only for NF customers
      "mileStoneName": "", //Only for NF customers
      "customerId": "",
      "customerName": ""
    },
    "billingAddress": [],
    "shippingAddress": [],
    "payable": [],
    "fulfilled": [],
    "paymentReceived": [],
    "paymentReturnedBack": [],
    "audit": {
      "updatedBy": "",
      "updatedDate": "",
      "updatedReason": ""
    },
    "seller": []
  }
};