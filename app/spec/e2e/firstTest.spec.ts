import 'mocha';
import { Context } from 'mocha';
import { chai, path,E2EONBHelper,RestAPIHelper,CommonHelper, context, uuid} from '../index'

var env = process.env.env;
var envFile = process.env.env + '-env.json';
let workingDir = process.cwd();
let config = require(path.join(workingDir, 'app/config/' + envFile));

var expect = chai.expect;
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

    //----------------------Multi-InvoiceIngestion----------------------------//

    it("Get Available products in Onboarding ", async function () {

        await new Promise<void>((resolve) => setTimeout(async function () {
            await onbe2eObj.getAvailableProductsForONB();
            // allProducts = await onbe2eObj.getAvailableProductsForONB();
            // console.log("********* Get Available Invoices For Facility  ******", allProducts);
            // resolve(allProducts);
            // console.log("invoices - ", allProducts);
        }));

    });
});