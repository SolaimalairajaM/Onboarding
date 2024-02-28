import 'mocha';
import { RestAPIHelper } from './rest-api-helper';
import { CommonHelper } from './common-helper';
// import { SQLDatabaseProvider } from './db360-helper';
var envFile = process.env.env + '-env.json';
let config = require('../config/' + envFile);
var chai = require("chai");
var expect = chai.expect;
// var moment = require('moment');
// let today = moment().format("YYYY-MM-DD");

export class E2EONBHelper {
    // transId: string;
    commonObj: CommonHelper;
    accesstokenonbUserAdmin: string;
    

    constructor(tokenONBAdmin: string) {
        this.accesstokenonbUserAdmin = tokenONBAdmin;
        this.commonObj = new CommonHelper();
    }

    async validateUserPErmissionLogin(userRole: string) {
        let token: string;

        switch (userRole) {
            case 'Admin':
                token = this.accesstokenonbUserAdmin

                break;
            // case 'Supplier':
            //     token = this.accesstokenSCFSpplier

            //     break;
            // case 'AdminInvestor':
            //     token = this.accesstokenSCFAdminInvestor

            //     break;
            // case 'Investor':
            //     token = this.accesstokenSCFInvestor

            //     break;
            default:
                userRole = 'Invalid user';
        }
        console.log(userRole);


        return 1
    }

    
    async getAvailableProductsForONB() {
        let restObj = new RestAPIHelper();
        var url = '/api/v1.0/onboarding-products'
        let  responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getAllCurrenciesForONB() {
        let restObj = new RestAPIHelper();
        var url = '/api/v1/currencies '
        let  responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getAllCompaniesForONB() {
        let restObj = new RestAPIHelper();
        var url = '/api/v1/companies'
        let  responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getGoverningLawsForONB() {

        let restObj = new RestAPIHelper();
        var url = '/api/v1/governing-laws'
        let  responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }


// ===========================================================================================

    async getAllCountriesForONB() {
        let restObj = new RestAPIHelper();
        var url = '/api/v1/countries'
        let  responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }


    async getStateByCountryCode(countryCode : string) {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/countries/'+countryCode+'/state-regions'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;

    }
   
    async getStateByUS() {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/countries/US/state-regions'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getStateByAU() {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/countries/AU/state-regions'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getStateByCA() {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/countries/CA/state-regions'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

   
// ===========================================================================================


    async getAllRolesForONB() {
        let restObj = new RestAPIHelper();
        var url = '/api/v1/roles'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }  

    async getRolesByRoleId(roleId : number) {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/roles/'+roleId+'/companies'
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

    async getRolesByProductCode(productCode : string) {
        let restObj = new RestAPIHelper();
        var url1 = '/api/v1/roles/'+productCode
        let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
        console.log(responsebody);
        return responsebody;
    }

// =====================================================================================


async getAllChecklists() {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists'
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}

async getChecklistsworkflows() {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists/workflows'
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}



async createNewChecklist(templateName : string, productCode : string, roleId : number, approverId : number, taskId1 : string, taskName1 : string, task1 : boolean, taskId2 : string, taskName2 : string, task2 : boolean ) {
    let restObj = new RestAPIHelper();
    var x = {"templateName":templateName,"productCode":productCode,"invitedClientRoleId":roleId,"approverId":approverId,"checklistGroups":[{"priority":1,"name":"Step_01","checklistGroupWorkflows":[{"id":taskId1,"name":taskName1,"isChecked":task1}]},{"priority":2,"name":"Step_02","checklistGroupWorkflows":[{"id":taskId2,"name":taskName2,"isChecked":task2}]}]}
    var url = '/api/v1/checklists/templates/'
    await restObj.sendRequest("POST", config.onbBaseURI + url , this.accesstokenonbUserAdmin,x);
}

async createChecklistWithoutPriority(templateName : string, productCode : string, roleId : number, approverId : number ) {
    let restObj = new RestAPIHelper();
    var x = {"templateName":templateName,"productCode":productCode,"invitedClientRoleId":roleId,"approverId":approverId,"checklistGroups":[{"priority":1,"name":"Step_01"},{"priority":2,"name":"Step_02"}]}
    var url = '/api/v1/checklists/templates/'
    await restObj.sendRequest("POST", config.onbBaseURI + url , this.accesstokenonbUserAdmin,x);
}

async getChecklistsByTemplateId(templateId : string) {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists/templates/'+templateId;
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}



async updateChecklist(templateId : string, UpdatedTemplateName : string, productCode : string, roleId : number, approverId : number, taskId1 : string, taskName1 : string, task1 : boolean, taskId2 : string, taskName2 : string, task2 : boolean, taskId3 : string, taskName3 : string, task3 : boolean ) {
    let restObj = new RestAPIHelper();
    var x = {"templateName":UpdatedTemplateName,"productCode":productCode,"invitedClientRoleId":roleId,"approverId":approverId,"checklistGroups":[{"priority":1,"name":"Step_01_Updated","checklistGroupWorkflows":[{"id":taskId1,"name":taskName1, "isChecked":task1}]},{"priority":2,"name":"Step_02_Updated","checklistGroupWorkflows":[{"id":taskId2,"isChecked":task2,"name":taskName2}]},{"priority":3,"name":"Step_03","checklistGroupWorkflows":[{"id":taskId3,"name":taskName3,"isChecked":task3}]}]}
    var url = '/api/v1/checklists/templates/'+templateId;
    let responsebody = await restObj.sendRequest("put", config.onbBaseURI + url , this.accesstokenonbUserAdmin,x);
    console.log(url); 
    console.log(responsebody);
    return responsebody;
}

async deleteChecklist(templateId : string) {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists/templates/'+templateId;
    await restObj.deleteRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin); 
    console.log(url1); 
}

async getChecklistsTemplates() {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists/templates';
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}

async getChecklistsGroups(templateId : string) {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/checklists/groups/'+templateId;
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}

async getOnboardingProducts() {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/onboarding-products';
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}

async getOnboardingApprovers() {
    let restObj = new RestAPIHelper();
    var url1 = '/api/v1/approvers';
    let responsebody= await restObj.getRequest(config.onbBaseURI + url1 , this.accesstokenonbUserAdmin);
    console.log(responsebody);
    return responsebody;
}


        
       
}


// ======================================================================

