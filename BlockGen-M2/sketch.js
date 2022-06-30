
let grid, streetsV, streetsH, intersections ;  
const streetWidthList = [16, 14, 14, 13, 25];
const minorStreetWidth = 7;

let buildingsList, plots, greenPlots;

let streetArea;
let builtArea;
let floorArea = [];
let plotArea ;
let greenArea;

let totalFloorArea;
let totalEnvelope = 0;
let mainParks = [];

let urbanDensity = 0;
let averageHeight = 0;
let noPeople = 0;

let heightIdeal = 0;
let densityIdeal = 0;
let noPeopleIdeal = 0;
let skewedFactor, stddev;
let greenPPCurrent, greenPPIdeal;

let modelIndex = 0;


let domesticFloorArea = 0;
let domesticBuildings = [];
let nonDomesticFloorArea = 0;
let nonDomesticBuildings = [];

let buildingsHeights= [];
let totalHeight;

let maximumGreen;

let blockWidth = [80,100, 120,120,160, 200]; // width of blocks
let blockDepth = [80,100, 160,160,120, 200]; 	// depth of blocks

const plotWidth = [7, 202]; //[min, max]
const plotDepth = [16, 115]; // [min, max]
const CSPlotAreaRange = [120, 8050]

/// Carbon coefficients
let WLC = [0,0,0,0,0] ;
let ECstructure = [];
let ECCoeff = [];
let ECenvelope = [];
let ECroof = [];
let ECa4a5c = [];
let OC = [];
let LUC = [];

//buildingType = [buildingMinWidth, buildingMaxWidth, buildingMinDepth, buildingMaxDepth, buildingMinHeigth, buildingMaxHeight]
//plotType = [plotMinWidth, plotMaxWidth, plotMinDepth, plotMaxDepth]
const buildingCat = ["NDLR", "NDHR", "DLR", "DHR", "TERR"];

// const buildingType1 = [12.9,44,18.2,62.6, 12.7, 17];  // Non domestic Low Rise
// const buildingType2 = [21.7,70,35.3,114.7, 76.2, 118];
// const buildingType3 = [7.3,16.4, 16,37.7, 11.6, 16];
// const buildingType4 = [16.4,31.6,24.4,47.9, 62.2, 82];
// const buildingType5 = [6.4, 202.2, 36.8, 11.4, 8, 9.9];

const buildingType1 = [12.9, 44,18.2,62.6, 12.7, 35];
const buildingType2 = [21.7,70,35.3,114.7, 35, 118];
const buildingType3 = [7.3,35, 16,37.7, 11, 35];
const buildingType4 = [16.4,31.6,24.4,47.9, 35, 82];
const buildingType5 = [50, 180, 11.4, 36.8, 8, 9.9];


// const buildingType1 = [12.9,44,18.2,62.6, 12.7, 35];
// const buildingType2 = [21.7,70,35.3,114.7, 35, 200];
// const buildingType3 = [7.3,16.4, 16,37.7, 11, 17];
// const buildingType4 = [16.4,31.6,24.4,47.9, 17, 82];
// const buildingType5 = [6.4, 202.2, 36.8, 11.4, 8, 9.9];

const plotType1 = [12.9,44,18.2,62.6];
const plotType2 = [21.7,70,35.3,114.7];
const plotType3 = [7.3,16.4,16,37.7];
const plotType4 = [16.4,31.6,24.4,47.9];
const plotType5 = [6.4, 202.2, 11.4, 36.8];

const floorAreaPP = [10.5, 10.5, 36, 36, 46];

const landHeight =2201;
const landWidth =2201;
let landCentre;

const zone1Width = 400;
const zone1Depth = 400;

const zoneWidthIncrement = 50;
const zoneDepthIncrement = 50;

let visualisation = true;

function preload() {
	skewedFactor = select('#skewedFactor').value();
	stddev = 0.3;
	greenPPIdeal = select('#greenPerCapita').value();
	heightIdeal = select('#heightFactor').value();
	//densityIdeal = select('#densityFactor').value();
	noPeopleIdeal = select('#numberPeople').value();
	readTextFile("EC_Data.txt");
}
function setup() {
	const canvas = createCanvas(landWidth+150, landHeight+10);
	canvas.parent('sketch-holder');
	background(220);
	landCentre = createVector(landWidth/2, landHeight/2);

	buildingsList = [];
	buildings = [];
	greenPlots = [];
	plots = [];
	grid = [];
	streetsV = [];
	streetsH = [];
	intersections = [];  
	mainParks = [];
	urbanDensity = 0;
	averageHeight = 0;
	noPeople = 0;
	WLC = 0 ;
	floorArea = [];
	domesticBuildings = [];
	nonDomesticBuildings = [];
	init();  // initiate the programme
	//finalise();
}
let zoneCounter = 1;
////////////
let plotsInZone ;
async function init() {
	make_street_layout();
	for( let g of grid) {	
		g.addMinorStreets();
		g.createPlots();
		g.show();
	}
	plotsInZone = plots.filter((p) => 
		p.x > landCentre.x - zone1Width/2 &&
		p.x + p.width < landCentre.x + zone1Width/2 &&
		p.y > landCentre.y - zone1Depth/2 &&
		p.y < landCentre.y + zone1Depth/2 )
	plotsInZone.forEach(p => {
		p.createPlots(zoneCounter)
		p.filterPlots(p);
		//p.addBuildings(zoneCounter);
	})
	let newPlots = shuffle(plotsInZone);
	newPlots.forEach(p => p.addBuildings())
	getStats();
	while(noPeople < noPeopleIdeal) {
		++zoneCounter;
		let dx1 = landCentre.x - zone1Width/2 - zoneCounter * zoneWidthIncrement/2;
		let dx2 = landCentre.x + zone1Width/2 + zoneCounter * zoneWidthIncrement/2;
		let dy1 = landCentre.y - zone1Depth/2 - zoneCounter * zoneDepthIncrement/2;
		let dy2 = landCentre.y + zone1Depth/2 + zoneCounter * zoneDepthIncrement/2;
		if( dx1 < 0 || dx2 > landWidth || dy1 < 0 || dy2 > landHeight)
			break;
		extend(dx1, dx2, dy1, dy2);
	}
	setTimeout(function(){	
		adjustNoPeople();
	}, 100);

	setTimeout(function(){	
		finalise();
	}, 200);

}
function finalise() {
	//console.log(buildings.length)
	adjustGreenArea();
	//console.log(buildings.length)
	buildings.forEach((b) => buildingsHeights.push(b.building.height));
	if(visualisation)
		show();
	isNew = true;
}
//////////////
function extend(dx1, dx2, dy1, dy2) {
	/// select the plots within the extended range 
	let zonePlots = plots.filter(p => p.x > dx1 && p.x + p.width < dx2 &&	p.y > dy1 &	p.y < dy2 )
	// filter the plots in the previous zone
	plotsInZone.map(e => {zonePlots = zonePlots.filter((p) => p != e)}) 
	zonePlots.forEach(p => {
		p.createPlots(zoneCounter)
		p.filterPlots(p);
		p.addBuildings(zoneCounter);
	})
	plotsInZone = plotsInZone.concat(zonePlots);
	getStats();
}

function show(){
	plotsInZone.forEach(p => p.show())
	buildings.forEach(b => b.showBuildings());
	greenPlots.forEach(g => g.show())
	showStats();
	showValues();
}

function adjustNoPeople() {
	//console.log("Adjusting number of people!")
	let extraPeople = noPeople - noPeopleIdeal;
	if(extraPeople > 50) {
		let minDiff = extraPeople;
		let extraBuilding; 
		buildings.map((b) => {
			if(b.building.type > 2){
				let peopleInBuilding = floor(Number(b.building.floorArea/floorAreaPP[b.building.type-1]));
				if(minDiff  > extraPeople - peopleInBuilding && peopleInBuilding - extraPeople  < 50) {
					minDiff = extraPeople - peopleInBuilding;
					extraBuilding = b;
				}
			}
		})
		//console.table([extraPeople , floor(Number(extraBuilding.building.floorArea/floorAreaPP[extraBuilding.building.type-1])), extraBuilding.building.type ])
		if(extraBuilding){ 
			//console.log(buildings.length)
			buildings.map((b) => {if(b == extraBuilding) b.makeGreen();});
			//console.log(buildings.length)
		}
		getStats();
		if(noPeople - noPeopleIdeal > 50)
			adjustNoPeople();
	}		
}

function regenerate() {
	visualisation = true;
	clear();
	zoneCounter = 1
	preload();
	setup();
}

let isNew = false;
function readTextFile(file) {
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
	{
			if(rawFile.readyState === 4)
			{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
							var allText = rawFile.responseText;
							let lines = allText.split('\n');
							let header = lines.shift();
							lines.forEach(l => {
								ECstructure.push(l.split(',')[1])
								ECenvelope.push(l.split(',')[2]);
								ECroof.push(l.split(',')[3]);
								ECa4a5c.push(l.split(',')[4]);
								OC.push(l.split(',')[5]);
								LUC.push(l.split(',')[6]);
							})								
					}
			}
	}
	rawFile.send(null);
}
function regeneratePromise() {
	return new Promise((resolve) => {
		clear();
		zoneCounter = 1
		//preload();
		setup();
		resolve();
	})
}
function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}
let csvContent2 = '';
async function generateModel(iterations) {
	noPeopleIdeal = select('#numberPeople').value();
	csvContent2 = '';
	let count = 1;
	for (let i = 0; i < iterations ; i++) {
		for (let j = 0; j < iterations ; j++) {
			for(let k = 0 ; k < iterations ; k++) {
				console.time(`${count} of ${iterations*iterations*iterations}`);
				heightIdeal = map(i, 0, iterations-1, 0, 1);
				skewedFactor = map(j , 0, iterations-1, 0, 1);
				greenPPIdeal = floor(map(k, 0, iterations-1, 1, maximumGreen));
				isNew = false;
				zoneCounter = 1
				isNew = false;
				++modelIndex;
				await regeneratePromise().then(sleeper(200)).then(() => {
					getStats()
					console.log(`H: ${averageHeight}, DF: ${urbanDensity}`);
					let WLCTotal = 0;
					WLC.map(w => WLCTotal += w );
					WLCTotal += LUC[0]*floor(landArea);
					csvContent2 += modelIndex + "," + urbanDensity + "," + averageHeight + "," + noPeople + "," + landArea/1000000 + "," + WLCTotal/1000000000 + "," + plotArea +"," + streetArea + "," + greenArea + "," +
						+ WLC[0]/1000000000 + ","+ WLC[1]/1000000000 +","+ WLC[2]/1000000000 +","+ WLC[3]/1000000000 +","+ WLC[4]/1000000000 + ","
						+ getQuantity(1).toString() + "," + getQuantity(2).toString() + "," + getQuantity(3).toString() + ","
						+ getQuantity(4).toString() + "," + getQuantity(5).toString() + "," + "\n";
				  saveData();
                  console.log("line 311 sketch.js - savedData?")

				}).catch((err) => {
					console.error(err)
				})
				console.timeEnd(`${count} of ${iterations*iterations*iterations}`)
				count++;
			}
		}
	}
    console.log("line 319 sketch.js")
		return new Promise((resolve, reject) => {
			if(csvContent2)
				resolve(csvContent2);
			else 
				reject(err = new Error("Not iterated!"));
		})	
}
let saveEachModel
async function initiateModelsGeneration(){
	maximumGreen = 60
	saveEachModel = select('#saveEachModel');
	visualisation = false;
	const headers = [["Model_ID","Density_Factor", "Height", "Number_People","Land_Area_km2", "WLC_MtCO2" ,"Plot_Area_m2","Street_Area_m2", "Green_Area_m2", "NDLR_WLC" , "NDHR_WLC" , "DLR_WLC" , "DHR_WLC" , "HOUSE_WLC","NDLR_Total","NDHR_Total" , "DLR_Total", "DHR_Total", "HOUSE_Total" ]];
	let csvContent = "data:text/csv;charset=utf-8," + headers.map(e=>e.join(","));
	csvContent += "\n"
	let iterations = select("#iterations").value();
	generateModel(iterations).then((content) => {
		csvContent += content;
		let encodedUri2 = encodeURI(csvContent);
		let link2 = document.createElement("a");
		link2.setAttribute("href", encodedUri2);
		let fileName = "M2_"+noPeopleIdeal/1000+"k.csv";
		link2.setAttribute("download", fileName);
		document.body.appendChild(link2); // Required for FF

		link2.click(); // This will download the data file named "Model.csv".
	}).catch((err) => console.error(err))
}
function change_heightFactor(val){
	select('#heightFactorValue').html(val, false);
}
function change_densityFactor(val){
	select('#densityFactorValue').html(val, false);
}
function change_greenPP(val){
	select('#greenPerCapitaValue').html(val, false);
}