const fs = require('fs');
const path = require('path');
const sendMail = require('./email');
 
var reportLink = process.argv[2];
var resultStatus =  process.argv[3];
var productName = process.argv[4];
var folderName = process.argv[5];
var mailingList = process.env.MailingList;
 
console.log("Email -resultStatus", resultStatus);
console.log("Email -reportLink", reportLink);
console.log("Email -productName", productName);
console.log("Email - folderName", folderName);
console.log("Email -mailingList", mailingList);

 
var report = "https://lqxqaartifacts.blob.core.windows.net/api-automation/"+ reportLink

const main = async () => {

const searchRegExp = /--folder/gi;
const replaceWith = '';
const folders = folderName.replace(searchRegExp, replaceWith); 
console.log('Entering parameter - send-email-main',folders);

  const options = {
    to: mailingList,
    //cc: '',
    replyTo: '',
    subject: 'Execution Report  -'+ productName + ' - ' + process.env.ClusterName +' - '+ resultStatus,
    text: "Environment: "+ productName + "\r\n\r\n" +   "Region name: "+ process.env.ClusterName + "\r\n\r\n" +   "Specified Folders: "+ folders + "\r\n\r\n" + report,
    textEncoding: 'base64',
    headers: [
      { key: 'X-Application-Developer', value: 'PG' },
      { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
  };

  const messageId = await sendMail(options);
  return messageId;
};

main()
  .then((messageId) => console.log('Message sent successfully:', messageId))
  .catch((err) => console.error(err));