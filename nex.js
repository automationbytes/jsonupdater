// const data = {
//     "Features": [
//       {
//         "FeatureName": "FN",
//         "Scenarios_Failed": [
//           {
//             "Failed_ScenarioName": "N1",
//             "Failed_Step": {
//               "Failed_StepName": "And",
//               "Failed_Reason": "TypeError: "
//             }
//           },
//           {
//             "Failed_ScenarioName": "N2",
//             "Failed_Step": {
//               "Failed_StepName": "And",
//               "Failed_Reason": "AssertionError: "
//             }
//           },
//           {
//             "Failed_ScenarioName": "N3",
//             "Failed_Step": {
//               "Failed_StepName": "And",
//               "Failed_Reason": "TimeOutError: "
//             }
//           },
//           {
//             "Failed_ScenarioName": "N4",
//             "Failed_Step": {
//               "Failed_StepName": "And",
//               "Failed_Reason": "TypeError: "
//             }
//           }
//         ]
//       }
//     ]
//   };
  const fs = require('fs');
const path = require("path");

const dataPath = path.join(__dirname, ".jsonreport/output.json");
const dataString = fs.readFileSync(dataPath, "utf8");
const data = JSON.parse(dataString);


  let reasonCounts = {};
  data.Features.forEach(feature => {
      feature.Scenarios_Failed.forEach(scenario => {
          let group = "Other";
          const failedReason = scenario.Failed_Step.Failed_Reason;
          if (failedReason.startsWith("TypeError:")) {
              group = "TypeError";
          } else if (failedReason.startsWith("AssertionError:")) {
              group = "AssertionError";
          } else if (failedReason.startsWith("TimeOutError:")) {
            group = "TimeOutError";
            }
            if (!reasonCounts[group]) {
            reasonCounts[group] = 0;
            }
            reasonCounts[group]++;
            scenario.Failed_Reason_Group = group;
            scenario.Failed_Reason_Count = reasonCounts[group];
            });
            });
            console.log(data);

            fs.writeFileSync("nfailed_scenarios.json", JSON.stringify(data));

            
            
            
            const Excel = require("exceljs");

// Create a new workbook
let workbook = new Excel.Workbook();

// Add a new worksheet to the workbook
let worksheet = workbook.addWorksheet("Failed Scenarios");

// Add the headers to the worksheet
worksheet.columns = [
  { header: "FeatureName", key: "FeatureName", width: 30 },
  { header: "Failed_ScenarioName", key: "Failed_ScenarioName", width: 30 },
  { header: "Failed_StepName", key: "Failed_StepName", width: 30 },
  { header: "Failed_Reason", key: "Failed_Reason", width: 30 },
  { header: "Group", key: "Failed_Reason_Group", width: 30 },
  { header: "Reason_Count", key: "Failed_Reason_Count", width: 30 }
];

worksheet.addRows(
    data.Features.reduce((scenarios, feature) => {
      return scenarios.concat(
        feature.Scenarios_Failed.map(scenario => {
          return {
            FeatureName: feature.FeatureName,
            Failed_ScenarioName: scenario.Failed_ScenarioName,
            Failed_StepName: scenario.Failed_Step.Failed_StepName,
            Failed_Reason: scenario.Failed_Step.Failed_Reason,
            Failed_Reason_Group: scenario.Failed_Reason_Group,
            Failed_Reason_Count: scenario.Failed_Reason_Count
          };
        })
      );
    }, [])
  );
  
// Save the workbook to a file
workbook.xlsx
  .writeFile("nfailed_scenarios_grouped.xlsx")
  .then(() => {
    console.log("File is written.");
  })
  .catch(err => {
    console.log(err);
  });
