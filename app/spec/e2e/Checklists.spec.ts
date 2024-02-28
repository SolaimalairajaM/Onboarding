import 'mocha';
import { Context } from 'mocha';
import { chai, path,E2EONBHelper,RestAPIHelper,CommonHelper, context, uuid} from '../index'
import { stringify } from 'uuid';

var env = process.env.env;
var envFile = process.env.env + '-env.json';
let workingDir = process.cwd();
let config = require(path.join(workingDir, 'app/config/' + envFile));

var expect = chai.expect;

let accesstokenonbUserAdmin: string,onbe2eObj: E2EONBHelper


describe(`====================Sample Tests==============================`, function () {
    let restObj = new RestAPIHelper();
    before("setup", async function () {
        console.log("env, ", env);


        await restObj.getAccessToken(config.onbUserAdmin, config.Password,config.b2cConfig).then((token) => {
            return accesstokenonbUserAdmin = token;
        });
        onbe2eObj = new E2EONBHelper(accesstokenonbUserAdmin);
        let commonObj = new CommonHelper()
    });

// ==================================================================================

it("Get All Checklists for Onboarding ", async function () {
    var responsebody = await onbe2eObj.getAllChecklists();
    console.log(JSON.stringify(responsebody));
    for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i]).to.have.all.keys(['id','name','invitedClientRole','productCode']);
                expect(responsebody[i].id).not.eql(null); 
                expect(responsebody[i].name).not.eql(null); 
                expect(responsebody[i].invitedClientRole).not.eql(null); 
                expect(responsebody[i].productCode).not.eql(null); 
            } 
    
});

it("Get Checklists Workflows ", async function () {
    var responsebody = await onbe2eObj.getChecklistsworkflows();
    console.log(JSON.stringify(responsebody));
    for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i]).to.have.all.keys(['id','name','isChecked','workflowTypeId']);
                expect(responsebody[i].id).not.eql(null); 
                expect(responsebody[i].name).not.eql(null); 
                expect(responsebody[i].isChecked).not.eql(null); 
                expect(responsebody[i].workflowTypeId).not.eql(null); 
            } 
    
});


it("Get Approvers for Onboarding ", async function () {
    var responsebody = await onbe2eObj.getOnboardingApprovers();
    console.log(JSON.stringify(responsebody));
    for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i]).to.have.all.keys(['companyId','name','participantId']);
                expect(responsebody[i].companyId).not.eql(null); 
                expect(responsebody[i].name).not.eql(null); 
                expect(responsebody[i].participantId).not.eql(null); 
            } 
    
});


it("Create New Checklist and Verifying the Created Checklist", async function () {
var moment = require('moment');
var timeToday = moment.utc().format('DDMMYY');
let rnd = new CommonHelper();
let random = rnd.getRndString(3);
this.name= 'ONB_APIReg_'+random+'_'+timeToday;

var responsebody = await onbe2eObj.getAvailableProductsForONB();
let random1 = rnd.getRndInteger(0,responsebody.length);
var productCode = responsebody[random1].code;


var responsebody1 = await onbe2eObj.getAllRolesForONB();
for(var i=0;i<responsebody1.length;i++)
{
    if(responsebody1[i].productCode == productCode && !(responsebody1[i].name).includes("Test") ){
        var roleId = responsebody1[i].id; 
        break;
    }
   
} 


var responsebody2 = await onbe2eObj.getOnboardingApprovers();
for(var i=0;i<responsebody2.length;i++)
{
    if(responsebody2[i].name == "ONB_APIReg_Approver"){
        var approverId = responsebody2[i].participantId;
        break;
    }
}

var responsebody3 = await onbe2eObj.getChecklistsworkflows();
    let random3 = rnd.getRndInteger(0,responsebody3.length-1);
    var taskId1 = responsebody3[random3].id;
    var taskName1 = responsebody3[random3].name;
    var task1 = true;
    var taskId2 = responsebody3[random3+1].id;
    var taskName2 = responsebody3[random3+1].name;
    var task2 = false;
await onbe2eObj.createNewChecklist(this.name,productCode,roleId,approverId,taskId1,taskName1,task1,taskId2,taskName2,task2);

var responseData = await onbe2eObj.getAllChecklists();
for(var i=0;i<responseData.length;i++){
    if(responseData[i].name == this.name){
        this.createdId = responseData[i].id;
        expect(responseData[i].productCode).to.eql(productCode);
        
var responseData1 = await onbe2eObj.getChecklistsByTemplateId(this.createdId);
        console.log(JSON.stringify(responseData1.checklistGroups))
        expect(responseData1.approverId).to.eql(approverId);
        expect(responseData1.invitedClientRoleId).to.eql(roleId);
        expect(responseData1.productCode).to.eql(productCode);
        
        expect(responseData1.checklistGroups[0].checklistWorkflows[0].id).to.eql(taskId1);
        expect(responseData1.checklistGroups[0].checklistWorkflows[0].name).to.eql(taskName1);
        expect(responseData1.checklistGroups[0].checklistWorkflows[0].isChecked).to.eql(task1);
        expect(responseData1.checklistGroups[1].checklistWorkflows[0].id).to.eql(taskId2);
        expect(responseData1.checklistGroups[1].checklistWorkflows[0].name).to.eql(taskName2);
        expect(responseData1.checklistGroups[1].checklistWorkflows[0].isChecked).to.eql(task2);
        
    }

}

});

/*
it("Create New Checklist Without Selecting the Tasks and Verify it should throw error", async function () {
    let rnd = new CommonHelper();
    let random = rnd.getRndString(4);
    var name= 'ONB_APIReg_ErrorScenario_'+random;
    
    var responsebody = await onbe2eObj.getAvailableProductsForONB();
    let random1 = rnd.getRndInteger(0,responsebody.length);
    var productCode = responsebody[random1].code;
    
    
    var responsebody1 = await onbe2eObj.getAllRolesForONB();
    for(var i=0;i<responsebody1.length;i++)
    {
        if(responsebody1[i].productCode == productCode && !(responsebody1[i].name).includes("Test") ){
            var roleId = responsebody1[i].id; 
            break;
        }
       
    } 
    
    
    var responsebody2 = await onbe2eObj.getOnboardingApprovers();
    for(var i=0;i<responsebody2.length;i++)
    {
        if(responsebody2[i].name == "ONB_APIReg_Approver"){
            var approverId = responsebody2[i].participantId;
            break;
        }
    }
    
    
    await onbe2eObj.createChecklistWithoutPriority(name,productCode,roleId,approverId);
  
    });
    

it("Get ChecklistsTemplate By TemplateId ", async function () {
    var responseData = await onbe2eObj.getAllChecklists();
    for(var i=0;i<responseData.length;i++)
    {
        var x =responseData[i].name
        if(x.includes('New_') ){
            this.id = responseData[i].id;
            console.log(this.id);
            break;
        }
    } 
    var responsebody = await onbe2eObj.getChecklistsByTemplateId(this.id);
    console.log(JSON.stringify(responsebody));
    for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i].id).not.eql(null); 
                expect(responsebody[i].name).not.eql(null); 
            } 
    
});

*/
it("Edit the existing Checklist ", async function () {

   
    var updatedName = this.name+"_Updated";
    
var responseBody = await onbe2eObj.getAvailableProductsForONB();
let rnd = new CommonHelper();
let random1 = rnd.getRndInteger(0,responseBody.length);
var productCode = responseBody[random1].code;


var responseBody1 = await onbe2eObj.getAllRolesForONB();
for(var i=0;i<responseBody1.length;i++)
{
    if(responseBody1[i].productCode == productCode && !(responseBody1[i].name).includes("Test") ){
        var roleId = responseBody1[i].id; 
        console.log(roleId);
        break;
    }
   
} 


var responseBody3 = await onbe2eObj.getOnboardingApprovers();
for(var i=0;i<responseBody3.length;i++)
{
    if(responseBody3[i].name == "ONB_APIReg_Approver_forEditChecklist"){
        var approverId = responseBody3[i].participantId;
        break;
    }
}

var responseBody4 = await onbe2eObj.getChecklistsByTemplateId(this.createdId);
console.log(JSON.stringify(responseBody4));
var taskId1 = responseBody4.checklistGroups[0].checklistWorkflows[0].id;
var taskName1 = responseBody4.checklistGroups[0].checklistWorkflows[0].name;
console.log(taskName1);
if(responseBody4.checklistGroups[0].checklistWorkflows[0].isChecked == true){
    var updatedtask1 = false;
}else {
    var updatedtask1 = true; 
}
console.log(updatedtask1);

var responseBody5 = await onbe2eObj.getChecklistsworkflows();
    let random3 = rnd.getRndInteger(0,responseBody5.length-1);
    var taskId2 = responseBody5[random3].id;
    var taskName2 = responseBody5[random3].name;
    var task2 = false;
    var taskId3 = responseBody5[random3+1].id;
    var taskName3 = responseBody5[random3+1].name;
    var task3 = true;
    
    
    await onbe2eObj.updateChecklist(this.createdId,updatedName,productCode,roleId,approverId,taskId1,taskName1,updatedtask1,taskId2,taskName2,task2,taskId3,taskName3,task3);
    
    var responseBody6 = await onbe2eObj.getChecklistsByTemplateId(this.createdId);
    console.log(JSON.stringify(responseBody6.checklistGroups))
    expect(responseBody6.id).to.eql(this.createdId);
    expect(responseBody6.approverId).to.eql(approverId);
    expect(responseBody6.invitedClientRoleId).to.eql(roleId);
    expect(responseBody6.productCode).to.eql(productCode);

    expect(responseBody6.checklistGroups[0].checklistWorkflows[0].id).to.eql(taskId1);
    expect(responseBody6.checklistGroups[0].checklistWorkflows[0].name).to.eql(taskName1);
    expect(responseBody6.checklistGroups[0].checklistWorkflows[0].isChecked).to.eql(updatedtask1);
    expect(responseBody6.checklistGroups[1].checklistWorkflows[0].id).to.eql(taskId2);
    expect(responseBody6.checklistGroups[1].checklistWorkflows[0].name).to.eql(taskName2);
    expect(responseBody6.checklistGroups[1].checklistWorkflows[0].isChecked).to.eql(task2);
    expect(responseBody6.checklistGroups[2].checklistWorkflows[0].id).to.eql(taskId3);
    expect(responseBody6.checklistGroups[2].checklistWorkflows[0].name).to.eql(taskName3);
    expect(responseBody6.checklistGroups[2].checklistWorkflows[0].isChecked).to.eql(task3);
   

    });



    it("Delete Checklists ", async function () {
  
    await onbe2eObj.deleteChecklist(this.createdId);
    var responseBody = await onbe2eObj.getAllChecklists();
    for(var i=0;i<responseBody.length;i++)
    {
        expect(responseBody[i].id).not.eql(this.createdId);  
    }  
  
    });

/*
    it("Get All Checklists Templates for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getChecklistsTemplates();
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
                {  
                    expect(responsebody[i]).to.have.all.keys(["name","productCode","id","invitedClientRoleId","approverId","checklistGroups"]);
                    expect(responsebody[i].id).not.eql(null); 
                    expect(responsebody[i].name).not.eql(null);
                    var x =responsebody[i].name
                        if(x.includes('SM_') ){
                            this.templateId = responsebody[i].id;
                            console.log(this.templateId);
                        }
                } 
        
    });


    it("Get Checklists Groups for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getChecklistsGroups(this.templateId);
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
                {
                    expect(responsebody[i]).to.have.all.keys(['id','name','priority','checklistWorkflows']);
                    expect(responsebody[i].id).not.eql(null); 
                    expect(responsebody[i].name).not.eql(null);
                } 
        
    });

    it("Get Products for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getOnboardingProducts();
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
                {
                    expect(responsebody[i]).to.have.all.keys(['code','description','isActive','name']);
                    expect(responsebody[i].code).to.have.oneOf(['AR','PUT','INS','SCF']);
                   
                } 
        var x = require('lodash');
        var responseData = JSON.stringify(responsebody);
        var expectedSortedOrder = x.orderBy(responseData, ['code'],['asc']);
        console.log(expectedSortedOrder);
        console.log(responseData);
        expect(responseData).to.eql(expectedSortedOrder);  
        
    });

*/


});





       

        




        




