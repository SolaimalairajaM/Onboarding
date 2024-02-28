import { RequestInfo, RequestInit } from 'node-fetch';

const fetch = (url: RequestInfo, init?: RequestInit) =>
    import('node-fetch').then(({ default: fetch }) => fetch(url, init));
var headers = {}
export class RestAPIHelper {

    async getRequest(url: string, accesstoken: string) {
        console.log("token = "+accesstoken)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accesstoken,
                'x-platform-code': 'LQX' 
            }
        });

        if (response.status != 200) {
            console.log('url -', url);
            console.log(`status: ${response.status}`)
            console.log(`error: ${response}`)

            throw (`error occured in getRequest : ${response.status}`);
        } else {
            const data = await response.json();
            console.log('url -', url);
            console.log("getRequest pass");
            return data;
        }
    }
    // POST, put, patch
    async sendRequest(method: string, url: string, accesstoken: string, reqbody?: any) {
        const response:any= await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accesstoken
            },
            body: JSON.stringify(reqbody)
        })
        if (!response.ok) {
            let resClone = response.clone();
            response.text().then((data: any) => {
                // console.log(`Error Response nody -${data}`);    
                console.error(`error occured in : ${url} Status:- ${response.status} and Response body :-${data}`);
            })
            throw resClone.text();
        } else {
            console.log("status code = " + response.status)
            let data;
            try {
                if (response.headers.get('content-type').includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
            } catch {
                data = await response.text();// 'text';
                console.log("in catch",url)
            }
            // const data = await response.json();
            //const responseCopy = response.clone();

            return data;
        }
    }

    /**
 * Get the accesstoken for user
 * @param user : Username :string
 * @returns :accessToken :string
 */
    async getAccessToken(user: string, password: string,config:any) {
        let username: string = user.replace('+', '%2B');
        console.log('grant_type=password&client_id=' + config.clientId + '&username=' + username + '&password=' + password + '&scope=openid ' + config.scope + ' offline_access&response_type=token id_token' )
        const response = await fetch(config.b2cURI, {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: 'grant_type=password&client_id=' + config.clientId + '&username=' + username + '&password=' + password + '&scope=openid ' + config.scope + ' offline_access&response_type=token id_token',
        });

        if (response.status != 200) {
            console.log(`error: ${response}`)
            console.log('grant_type=password&client_id=' + config.clientId + '&username=' + username + '&password=' + password + '&scope=openid ' + config.scope + ' offline_access&response_type=token id_token')
            throw (`Error occured in getAccessToken$ ${user} : ${response.status}`);
        } else {
            var responseData: any = await response.json();
            var accessToken: string = responseData.access_token;
            console.log(`getAccessToken status code: ${response.status}`);
            console.log(accessToken);
            return accessToken;
            
        }
    }
    async sendFormdataRequest(method: string, url: string, accesstoken: string, reqbody?: string) {
        const response:any = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accesstoken
            },
            body: JSON.stringify(reqbody)
        })
        if (!response.ok) {
            console.log(`error: ${response}`)
            throw (`error occured in ${url} : Status:- ${response.status} and Response body :- ${response.text()}`);
        } else {
            let data;
            try {
                if (response.headers.get('content-type').includes('application/json')) {
                    //  console.log("in of try")
                    data = await response.json();
                    // console.log("in of try")
                } else {
                    data = await response.text();
                    // console.log("in else try")
                }
            } catch {
                data = 'text';
                console.log("in catch")
            }
            // const data = await response.json();
            //const responseCopy = response.clone();

            return data;
        }
    }
  
// ============================================================================ 
async deleteRequest(url: string, accesstoken: string) {
    console.log("token = "+accesstoken)
    console.log(url);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + accesstoken,
            'x-platform-code': 'LQX' 
        }
    });

}



}




