import 'mocha';
import { Context } from 'mocha';
import { chai, path,E2EONBHelper,RestAPIHelper,CommonHelper, context, uuid} from '../index'
import { stringify } from 'uuid';

var env = process.env.env;
var envFile = process.env.env + '-env.json';
let workingDir = process.cwd();
let config = require(path.join(workingDir, 'app/config/' + envFile));

var expect = chai.expect;
// var allProducts;
//Global Variables
let accesstokenonbUserAdmin: string,onbe2eObj: E2EONBHelper


describe(`====================Sample Tests==============================`, function () {
    let restObj = new RestAPIHelper();
    before("setup", async function () {
        console.log("env, ", env);

    //     accesstokenonbUserAdmin = await restObj.getAccessToken(config.onbUserAdmin, config.Password, config.b2cConfig);
    //    return accesstokenonbUserAdmin
        await restObj.getAccessToken(config.onbUserAdmin, config.Password,config.b2cConfig).then((token) => {
            return accesstokenonbUserAdmin = token;
        });
        onbe2eObj = new E2EONBHelper(accesstokenonbUserAdmin);
        let commonObj = new CommonHelper()
    });

    // afterEach("after", function () {

    //     console.log(this.currentTest.isFailed());

    //     if (this.currentTest.isFailed())
    //         this.currentTest.parent.bail(true)

    // });


  it("Get Available products in Onboarding ", async function () {
            var responsebody = await onbe2eObj.getAvailableProductsForONB();
            console.log(JSON.stringify(responsebody));
            for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i].isActive).to.eql(true);
                expect(responsebody[i].code).to.be.oneOf(['AR','PUT','INS','SCF']); 
                console.log("isActive ----"+responsebody[i].isActive );
                console.log("code ----"+responsebody[i].code );
            }

    });


    it("Get All Currencies for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getAllCurrenciesForONB();
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
        {
            expect(responsebody[i].code).to.be.oneOf(['AUD','CAD','CHF','EUR','GBP','MXN','NOK','SGD','USD']);
            expect(responsebody[i].description).not.eql(null); 
        }
        
    });


    it("Get All Companies for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getAllCompaniesForONB();
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
        {
            expect(responsebody[i].id).not.eql(null); 
            expect(responsebody[i].name).not.eql(null); 
            expect(responsebody[i]).to.have.all.keys(['id','name']);
        }
        
    });

    
    it("Get Governing-Laws for Onboarding ", async function () {
        var responsebody = await onbe2eObj.getGoverningLawsForONB();
        console.log(JSON.stringify(responsebody));
        for(var i=0;i<responsebody.length;i++)
        {
            expect(responsebody[i].id).not.eql(null); 
            expect(responsebody[i].name).not.eql(null); 
            expect(responsebody[i]).to.have.all.keys(['id','name']);
        }
        
    });   

// ====================================================================================
    

    // it("Get All Countries for Onboarding ", async function () {
    //         var responsebody = await onbe2eObj.getAllCountriesForONB();
    //         var x = await onbe2eObj.getAllCountriesForONB();
    //         console.log(JSON.stringify(responsebody));
    //         for(var i=0;i<responsebody.length;i++)
    //         {
    //             expect(responsebody[i]).to.have.all.keys(['code','name']);
    //             expect(responsebody[i].name).not.eql(null);
    //             expect(responsebody[i].code).not.eql(null);
    //         } 

    //     });

        
    // it("Get State-Regions by Countrycode ", async function () {
    //         var responseData = await onbe2eObj.getAllCountriesForONB();
    //         let rnd = new CommonHelper();
    //         let random = rnd.getRndInteger(0, responseData.length);
    //         var countryCode = responseData[random].code;
    //         console.log(countryCode);
    //         var responsebody = await onbe2eObj.getStateByCountryCode(countryCode);
    //         console.log(JSON.stringify(responsebody))
           
    //         if(responsebody != null){
    //             for(var i=0;i<responsebody.length;i++)
    //         {
    //             expect(responsebody[i]).to.have.all.keys(['id','name','countryCode']);
    //             expect(responsebody[i].id).not.eql(null);
    //             expect(responsebody[i].name).not.eql(null);
    //             expect(responsebody[i].countryCode).not.eql(null);
    //         } 
            
    //     }

    //     });

    // it("Get State-Regions for US", async function () {
    //        var responsebody = await onbe2eObj.getStateByUS();
    //        console.log(JSON.stringify(responsebody));
    //             for(var i=0;i<responsebody.length;i++)
    //         {
    //             expect(responsebody[i]).to.have.all.keys(['id','name','countryCode']);
    //             expect(responsebody[i].id).not.eql(null);
    //             expect(responsebody[i].name).not.eql(null);
    //             expect(responsebody[i].countryCode).to.eql("US");
    //         } 

    //     });

    
    // it("Get State-Regions for AU", async function () {
    //         var responsebody = await onbe2eObj.getStateByAU();
    //         console.log(JSON.stringify(responsebody));
    //              for(var i=0;i<responsebody.length;i++)
    //          {
    //              expect(responsebody[i]).to.have.all.keys(['id','name','countryCode']);
    //              expect(responsebody[i].id).not.eql(null);
    //              expect(responsebody[i].name).not.eql(null);
    //              expect(responsebody[i].countryCode).to.eql("AU");
    //          } 
 
    //      });


    // it("Get State-Regions for CA", async function () {
    //         var responsebody = await onbe2eObj.getStateByCA();
    //         console.log(JSON.stringify(responsebody));
    //              for(var i=0;i<responsebody.length;i++)
    //          {
    //              expect(responsebody[i]).to.have.all.keys(['id','name','countryCode']);
    //              expect(responsebody[i].id).not.eql(null);
    //              expect(responsebody[i].name).not.eql(null);
    //              expect(responsebody[i].countryCode).to.eql("CA");
    //          } 
 
    //      });

// ====================================================================================


        it("Get All Roles for Onboarding", async function () {
            var responsebody = await onbe2eObj.getAllRolesForONB();
            console.log(JSON.stringify(responsebody));

            for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i]).to.have.all.keys(['id','name','roleName','description','productCode']);
            } 

        });


        it("Get Roles by RoleId", async function () {
            var responseData = await onbe2eObj.getAllRolesForONB();
            let rnd = new CommonHelper();
            let random = rnd.getRndInteger(0, responseData.length);
            var roleId = responseData[random].id;
            console.log(roleId);
            var responsebody = await onbe2eObj.getRolesByRoleId(roleId);
            console.log(JSON.stringify(responsebody));

            for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i].id).not.eql(null); 
                expect(responsebody[i].name).not.eql(null); 
                expect(responsebody[i]).to.have.all.keys(['id','name']);
            }
            
        });


        it("Get Roles by Product Code", async function () {
            var responseData = await onbe2eObj.getAllRolesForONB();
            let rnd = new CommonHelper();
            let random = rnd.getRndInteger
            (0, responseData.length);
            var productCode = responseData[random].productCode;
            console.log(productCode);
            var responsebody = await onbe2eObj.getRolesByProductCode(productCode);
            console.log(JSON.stringify(responsebody));

            for(var i=0;i<responsebody.length;i++)
            {
                expect(responsebody[i].productCode).to.eql(productCode); 
                expect(responsebody[i]).to.have.all.keys(['id','name','roleName','description','productCode']);
            }
            
        });




});





       

        







        // it("Get All Roles for Onboarding ", async function () {
        //     var responsebody = await onbe2eObj.getAllRolesForONB();
        //     console.log(JSON.stringify(responsebody));
        //     for(var i=0;i<responsebody.length;i++)
        //     {
        //         expect(responsebody[i]).to.have.all.keys(['id','name','roleName','description','productCode']);
        //     }
            
        // });




        // it("Get Roles by Product Code", async function () {
        //     var responsebody = await onbe2eObj.getRolesByProductCode();
        //     console.log(JSON.stringify(responsebody));
        //     for(var i=0;i<responsebody.length;i++)
        //     {
        //         // expect(responsebody[i].productCode).to.eql(productCode); 
        //         expect(responsebody[i]).to.have.all.keys(['id','name','roleName','description','productCode']);
        //     }
            
        // });





 
        //  it("Get RoleId", async function () {

        //     var responsebody = await onbe2eObj.getRoleID();
        //     // console.log(JSON.stringify(responsebody));
          
        // });



        




