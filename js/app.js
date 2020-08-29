// import { http } from "./http"

let list = document.querySelector(".list");
let chart = document.getElementById("myChart").getContext("2d");
var labels = [];
var amounts = [];
var labels2 = [""];

// this is used to mockup the data in order to show chart even before data was added
var mockAmounts=["1"]
var mockColors=["#BDBDBD"];
var mockPercentage=["No Entered Data Yet"];
var inputCounter = 0;
// this is used to clear up the labels area
var labels = ["", "", "", "", "", "", "", "", "", ""];
var fundingGoal = 0;
var percentageAmount = [];
var deleteState=false;
// chart slices colors
var colors = [
  "#FF764A",
  "#FFA723",
  "#F2C94C",
  "#FF5794",
  "#D62565",
  "#2F80ED",
  "#0C6741",
  "#19A986",
  "#00DFAA",
  "#55FFD6",
];



const button = document.querySelector(".add-item-btn");
button.addEventListener("click", createInputFields);

init();
function init(){
displayChart();
displayGoal();
}


function createInputFields(e) {
  if(inputCounter<9){
    const newInputGroup = document.createElement("div");
    newInputGroup.className = "input-group";
    newInputGroup.innerHTML = `
    <span class="list-item-circle" style="background-color:${colors[inputCounter]};"${colors[inputCounter]}""></span>
    <input type="text" class="input-add-first-name" id="${inputCounter}" placeholder=" New Budget Item"
     >
     <div class="input-dollar-icon">
     <input type="text" class="input-add-amount" id="${inputCounter}" placeholder="1000" >
  <span class="dollar-icon"><i class="fas fa-dollar-sign"></i></span>
     </div>
  
  <span  class="delete-icon" > <i id="${inputCounter}" class="fas fa-times"></i></span>
    `;
    inputCounter++;
  
    document.querySelector(".input-groups-container").appendChild(newInputGroup);
  
    // input fields event listners
    document
      .querySelectorAll(".input-group")
      .forEach((group) => group.addEventListener("keyup", captureData));
  

      // delete icons event listner
  document.querySelectorAll(".delete-icon").forEach((icon)=> icon.addEventListener("click",deleteItem));

  }
else{
  alert("Max of 10 items")
}

  e.preventDefault();
}
function deleteItem(e){
  
  const toBeDeletedItem=e.target.parentElement.parentElement;
  toBeDeletedItem.remove();
 
  amounts.splice(e.target.id,1);
// decreasing the id of input fields to be able to insert its value in the right array index
document.querySelectorAll(".input-add-amount").forEach((listItem)=> listItem.id=listItem.id-1);
document.querySelectorAll(".input-add-first-name").forEach((listItem)=> listItem.id=listItem.id-1);


// making sure that there are items to be displayed other wise switch to default chart
if((document.querySelectorAll(".input-add-amount").length)===0){
  // default mode
defaultMode();
}
else{
  mockAmounts=amounts;
  mockColors=colors;
}
// decreaseing the global array counter for next input fields to be created
inputCounter--;
updateChart();
}

// getting the chart back to default status
function defaultMode(){
  mockAmounts=["1"];
  mockColors=["#BDBDBD"];
  mockPercentage=["No Data Entered"]
}

function captureData(e) {
  const target = e.target;
// keycode for backlash is 8
    if (target.classList.contains("input-add-amount")) {
      var allowedChar = /^[0-9]*$/;
      
      if (target.value.match(allowedChar)) {
        
        if(e.keyCode===8){
          if(e.target.value.length===0){
            
          amounts[target.id]="0";

          }
          else{
          updateValues(target)

          }
        }
        else{
          
          updateValues(target)
        }

         

        // checking if the value is being written or overwritten
       
      }
      // replacing the mockArrays with the actual  to display added data along with its colors
     replaceMockArray();
      updateChart();
    } 


  e.preventDefault();
}
function updateValues(target){

  if (amounts[target.id]) {
    // data is being overwritten
    if (target.value !== NaN) {
      amounts[target.id] = target.value;
    } else {
      alert("Please enter a value for amount");
    }
  } else {
    // data is being written
    if (target.value !== NaN) {
      amounts.push(target.value);
    } else {
      alert("Please enter a value for amount");
    }
  }
}

function replaceMockArray(){
 
  mockAmounts=amounts;
  mockColors=colors;
  mockPercentage=percentageAmount;
}
function updateChart(){
 
  calculateGoal();
  calculatePercentage();
  displayChart();
  
}

// for fetching json data
async function getData() {
  const res = await fetch("http://localhost:3000/data");
  const data = res.json();
  displayList(data);

  getNames(data, displayChart);
  getAmount(data, displayChart);
}

function displayList2() {
  for (let i = 0; i < amounts.length; i++) {
    const listItem = document.createElement("li");
    listItem.className = "list-item";
    listItem.innerHTML = `
    <span class="list-item-circle" style="background-color:${colors[inputCounter]};"${colors[inputCounter]}""></span>
    <input type="text" class="input-add-first-name" id="${inputCounter}" placeholder=" New Budget Item" value=${labels2[i]}
     >
  <input type="text" class="input-add-amount" id="${inputCounter}" placeholder="1000" " value=${amounts[i]}>
  
  `;
    list.appendChild(listItem);
    counter++;
  }
}
// Goal calculation
function calculateGoal() {
  fundingGoal = 0;
  console.log(amounts)
  for (let i = 0; i < amounts.length; i++) {
      if(amounts[i]!==NaN){
        fundingGoal += parseInt(amounts[i]);
      }
      else{
        alert("Please fill in value for amount fields")
      }
    
  }
  if(fundingGoal==0){
    defaultMode();
  }
  displayGoal();
}


// goal  display dynamically
function displayGoal() {

  if(!document.querySelector(".funding-goal")){

    let goal = document.createElement("span");
    goal.className = "funding-goal";
    goal.innerHTML = ` <span class="funding-goal-upper-text">Funding Goal</span> <br>   RM <span  class="goal-value">${fundingGoal}</span>`;
  document.querySelector(".chart-side").appendChild(goal);

  }
  else{
    document.querySelector(".goal-value").textContent=fundingGoal;
  }
}



// getting slice percentage
function calculatePercentage() {
  for (let i = 0; i < amounts.length; i++) {
    percentageAmount[i] = ((parseInt(amounts[i]) / fundingGoal) * 100).toFixed(
      2
    );
    percentageAmount[i] += "%";
  }
}

// chartjs functionality
function displayChart() {
  let costChart = new Chart(chart, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Campaign",
          data: mockAmounts,
          backgroundColor: mockColors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      onHover: function () {
        this.data.datasets[0].data = mockPercentage;
      },
      plugins:{
        beforeDatasetsUpdate(){

            if(this.data.datasets[0].data.length===0){

        this.data.datasets[0].data = mockAmounts;
            
            }
          }
      },

      labels: false,

      cutoutPercentage: 96,
    }
    
  });
  
  Chart.plugins.register({
    afterDraw: function (costChart) {
        if (costChart.data.datasets.length === 0) {
            // No data is present
            var ctx = costChart.chart.costChart;
            var width = costChart.chart.width;
            var height = costChart.chart.height
            costChart.clear();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "20px 'Helvetica'";
            ctx.fillText('No data to display', width / 2, height / 2);
            ctx.restore();
        }
    }

});
}

