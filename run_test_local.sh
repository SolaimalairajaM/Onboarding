#!/bin/bash
Product_Name="qa-api-onboarding"
#ModuleName="Regression"
ModuleName=$1
TestCaseName=$2
Environment_Name=$3
MailingList="skshirsagar@liquidx.com;"
##############################

export timestamp=$(date +%Y-%m-%d_%H-%M-%S)
export execDate=$(date +%Y-%m-%d) 
export env=${Environment_Name}
#export product=${Product_Name}
export module=${ModuleName}
export testcase=${TestCaseName}

if [ ${ModuleName} == "All" ]; then
  module="*"
  test="*.spec"
 else
  module=${ModuleName} 
if [ ${TestCaseName} == "All" ]; then
  test="*.spec"
  echo "all "
else
   test=${TestCaseName}".spec"
    echo "single"
fi 
fi
curr_dir=`pwd`
read -p "Press any key..."

# if [ ${ModuleName} == "E2E_Flow" ]; then
# read -p "Press any key For E2E..."
# mocha -r ts-node/register ${curr_dir}/app/spec/${module}/${test}.ts --bail --timeout=160000  --reporter mochawesome --reporter-options enableCode=false --reporter-options "mochaFile=results/my-test-output.xml,reportFilename=${ModuleName}${TestCaseName}_${timestamp}_execution_report"
# else
#Execute Tests
echo mocha -r ts-node/register ${curr_dir}/app/spec/${module}/${test}.ts --timeout=160000  --reporter mochawesome --reporter-options enableCode=false --reporter-options "mochaFile=results/my-test-output.xml,reportFilename=${ModuleName}${TestCaseName}_${timestamp}_execution_report"
read -p "Press any key..."
mocha -r ts-node/register "${curr_dir}/app/spec/${module}/${test}.ts" --timeout=160000  --reporter mochawesome --reporter-options enableCode=false --reporter-options "mochaFile=results/my-test-output.xml,reportFilename=${ModuleName}${TestCaseName}_${timestamp}_execution_report"
# fi
#npx mochawesome-merge -f C:/expleoLiquidx/Github/disty-qa-api-integration-tests/mochawesome-report/*.json -o C:/expleoLiquidx/Github/disty-qa-api-integration-tests/reports/result.json
#marge -o  C:/expleoLiquidx/Github/disty-qa-api-integration-tests/FinalReport -f ${TestCaseName} --overwrite false --saveHtml C:/expleoLiquidx/Github/disty-qa-api-integration-tests/reports/result.json
#marge -o  C:/expleoLiquidx/Github/disty-qa-api-integration-tests/FinalReport -f ${ModuleName}/${TestCaseName} --overwrite false --saveHtml C:/expleoLiquidx/Github/disty-qa-api-integration-tests/reports/result.json
echo $?
r=$?
if [ $r = 0 ]; then
    result='Pass'  
else
    result='Fail'
fi
echo ${result}

#Post report to blob
#mocha -r ts-node/register C:/expleoLiquidx/Github/disty-qa-api-integration-tests/app/spec/common/post-reports-to-blob.spec.ts --timeout=160000 --reporter mochawesome --reporter-options "mochaFile=results/my-test-output.xml,reportFilename=Common_Post_to_blob"
#node C:/expleoLiquidx/Github/disty-qa-api-integration-tests/send-email.js "${Product_Name}/${Environment_Name}/${execDate}/${ModuleName}_${timestamp}/${TestCaseName}.html" ${result} ${Environment_Name} "${ModuleName}" "${MailingList}"
#https://lqxqaartifacts.blob.core.windows.net/qa-automation/InBlock/qa/2021-03-01/cohesity_2021-03-01_18-45-44/e2e-po-invoiced.html
#node /etc/inb/send-email.js "Inblock_API_TestResults/${Environment_Name}/${ModuleName}_/${execDate}/${Environment_Name}_Regression_${timestamp}.html" ${result} ${Environment_Name} "${ModuleName}" "${MailingList}"

echo $?

read -p "Press any key..."