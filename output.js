function make_street_layout(){
    let endX;
    let endY;	
    let y;
    let x;

    noFill();
    strokeWeight(2);
    rect(0,0,landWidth,landHeight);
    for(let i=0 ; i < 2; i++){
        x = 0;
        y = 0;
        if(i == 0) {
            while (x <= landWidth-40) {
                streetWidth = random(streetWidthList);
                y = 0;
                endX = x;
                endY = landHeight-1;
                streetsV.push(new Street('main street', streetWidth , x , y , endX, endY));
                x += random(blockWidth);
            }
            streetsV.push(new Street('main street', streetWidth , landWidth-1 , 0 , landWidth-1, landHeight-1));
        } else {
            while (y <= landHeight-40){
                streetWidth = random(streetWidthList);
                x = 0;
                endX = landWidth - 1;
                endY = y;
                streetsH.push(new Street('main street', streetWidth , x , y , endX, endY));
                y += random(blockDepth);
            }
            streetsH.push(new Street('main street', streetWidth , 0 , landHeight-1 , landWidth-1, landHeight-1));
        }
    }
    y = 0;
    x = 0;
    intersections = make2DArray(streetsV.length, streetsH.length)
    for(let i = 0 ; i < streetsH.length ; i++){
        for(let j = 0 ; j < streetsV.length ; j++) {
            intersections[i][j] = line_intersect(streetsH[i].startX, streetsH[i].startY,streetsH[i].endX,streetsH[i].endY, streetsV[j].startX, streetsV[j].startY, streetsV[j].endX, streetsV[j].endY);
        }
    }
    for(let i = 0 ; i < streetsH.length-1 ; i++) {
        for(let j=0 ; j < streetsV.length-1 ; j++) {
            let blockX = intersections[i][j].x + streetsV[j].width/2;
            let blockY = intersections[i][j].y + streetsH[i].width/2;
            let blockW = intersections[i][j+1].x - intersections[i][j].x - streetsV[j].width;
            let blockD = intersections[i+1][j].y - intersections[i][j].y - streetsH[i].width;
            grid.push(new Block(blockX, blockY, blockW, blockD, 255));
        }
    }
    ///// create buildings list
    for (let i = 0 ; i < 4000 ; i++) {
        let b = floor(map(random(), 0, 1, 1, 5.9));
        buildingsList.push(new Building(b));
    }
}
function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var ua, ub, denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
    if (denom == 0) {
        return null;
    }
    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
        ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
    return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ub * (y2 - y1)
    };
}
/// this function create a 2D array with dimensions of cols and rows
function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (i=0;i<rows; i++)
        arr[i] = new Array(rows);
    return arr;
}
function getQuantity(btype) {
    return buildings.filter(function(b) {
        if(b.building) {
            return b.building.type === btype;
        }
    }).length
}
function getBuildableArea(plot){
    if(!plot.divided)
        return plot.width*plot.depth;
    else if(plot.divided)
        return getBuildableArea(plot.left) + getBuildableArea(plot.right);
}
let maxDistXLeft;
let maxDistYRight;
let maxDistYTop;
let maxDistYBot;

function resetVariables() {
    builtArea = 0;
    floorArea = [0, 0, 0, 0, 0];  
    totalFloorArea = 0;
    totalEnvelope = 0;

    totalHeight = 0;
    urbanDensity = 0;
    averageHeight = 0;

    nonDomesticFloorArea = 0;
    domesticFloorArea = 
    noPeople = 0;

    WLC = [0,0,0,0,0];

    maxDistXLeft = 0;
    maxDistXRight = 0;
    maxDistYTop = 0;
    maxDistYBot = 0;

    StreetArea  = 0;
    plotArea = 0;
    greenArea = 0;
}
function getStats(){
    resetVariables();
    buildings.forEach(function(b){
        let type = b.building.type;
        WLC[type-1] += b.building.floorArea * (Number(ECstructure[type-1])+Number(ECa4a5c[type-1])+Number(OC[type-1])) + b.building.envelope * Number(ECenvelope[type-1]) + b.building.roofArea * Number(ECroof[type-1]);
        plotArea += b.width*b.depth;
        builtArea += b.building.footprint;
        floorArea[b.building.type-1] += b.building.floorArea;
        totalHeight += b.building.height
        totalEnvelope += b.building.envelope;

        xDist = landCentre.x - b.x;
        if(xDist > maxDistXLeft)
            maxDistXLeft = xDist;
        xDist = b.x + b.width - landCentre.x;
        if(xDist > maxDistXRight)
            maxDistXRight = xDist;

        yDist = landCentre.y - b.y;
        if(yDist > maxDistYTop)
            maxDistYTop = yDist;
        yDist = b.y + b.depth - landCentre.y;
        if(yDist > maxDistYBot)
            maxDistYBot = yDist;
        return;
    });
    landArea = floor((maxDistXLeft + maxDistXRight) * (maxDistYTop + maxDistYBot));
    // floor area
    floorArea.forEach(function(f, index){ 
        totalFloorArea += f;
        if(index > 1) {
            noPeople += floor(f/floorAreaPP[index])
        }
    });
    
    greenPlots.forEach((g) => greenArea += g.width * g.depth);
    greenPPCurrent = floor((greenArea/landArea)*100);

    urbanDensity = Number.parseFloat(builtArea/landArea).toFixed(4) * 100;
    averageHeight = Number(Math.round(totalHeight/buildings.length+'e2')+'e-2').toFixed(2);
    streetArea = landArea - plotArea - greenArea;
}
function showStats(){
    getStats();
    textFont('Helvetica');
    let statsDev = select('#status');
    let text = '<br />Total number of Buildings: '+ buildings.length + "<br /><br />";
    for ( i = 0 ; i < 5 ; i++) {
        text += 'Type '+ (i+1) + ' [ ' + buildingCat[i]  +' ]: '+ getQuantity(i+1).toString() + "<br />";
    }
        text += "<br />";
    statsDev.html(text.bold(), false);

    text = 'Urban density (A/B): ' + floor(Number.parseFloat(builtArea/landArea).toFixed(4) * 100) +'% <br /> ';
    statsDev.html(text.bold(), true);
    text = '(A) Total built area: '+ builtArea + " m2 <br />";
    text += '(B) Total land area: '+ landArea + " m2<br /><br />";
    statsDev.html(text, true);

    text = "Average height: "+ floor(Number(Math.round(totalHeight/buildings.length+'e2')+'e-2').toFixed(2)) +"m <br />";
    statsDev.html(text.bold(), true);
    text = "(C) Total height: "+ totalHeight + " m <br />";
    text += "(D) Number of buildings = " + buildings.length + "<br /><br />";
    statsDev.html(text, true);

    text = "Greeness Factor (G/B): " + floor(Number(Math.round(greenArea/landArea+'e3')+'e-3').toFixed(2)*100)  + "%<br />"
    statsDev.html(text.bold(), true);
    text = "Green area: " + floor(greenArea)  + " m2<br />";
    text += "Green area per capita: " + (greenArea/noPeople).toFixed(2)  + " m2/p<br /><br />"
    statsDev.html(text, true);

    text = "Street Area: " + floor(streetArea) + " m2<br /><br />";
    statsDev.html(text.bold(), true);

    text = '';
    for(let i = 0 ; i < 5 ; i++){
        //text += "Floor Area Type "+(i+1)+": " + floor(floorArea[i]) + " m2 <br />";
        if(i > 1)
            text += "People in Type "+ (i+1)+": " + floor(floorArea[i]/floorAreaPP[i]) + "<br />";
    }
    text += "<br />Toral number of people: " + noPeople + "<br />";
    text += "Total land use: " + landArea + " m2<br />";
    statsDev.html(text, true);

    /// show the color gradient
    rectMode(CORNER); // Default rectMode is CORNER
    fill('red'); // Set fill to white
    let colorDiv = createDiv();
    colorDiv.position(landWidth+25,200);
    colorDiv.style('width:30; height:500;')
    colorDiv.style('background', 'linear-gradient(to bottom, #ff0000 0%, #0000ff 100%)');
    stroke("red");
    strokeWeight(5);
    noFill();
    rect(landCentre.x - maxDistXLeft, landCentre.y - maxDistYTop, maxDistXLeft + maxDistXRight , maxDistYTop + maxDistYBot);
}


function saveData() {
    const headers = [["ID", "Type", "plot_width", "plot_depth", "Building_Width", "Building_Depth", "Building_Height", "xCor", "yCor", "Floor_Area" , "Footprint", "Envelope", "Roof_Area", "Facade_Area", "Number_Stories", "Storey_Height", "Type1_WLC", "Type2_WLC", "Type3_WLC", "Type4_WLC","Type5_WLC"]];
    let csvContent1 = "data:text/csv;charset=utf-8," + headers.map(e=>e.join(","));
    csvContent1 += "\n"
    buildings.map(function(p, index) {
        if(p.building.type) {
            csvContent1 +=  (index+1) +"," + p.building.type +"," + p.width + 
            ","+ p.depth + "," + p.building.width  +"," +p.building.depth  +
            "," +p.building.height + "," + (p.x )+"," + (p.y) +"," + 
            p.building.floorArea  +"," + p.building.footprint  +"," + p.building.envelope  
            +"," + p.building.roofArea + "," + p.building.facadeArea +"," + 
            p.building.noStories  +"," + p.building.storeyHeight  + "," + WLC[0] +"," + WLC[1] + "," + WLC[2] + "," + WLC[3] + "," + WLC[4] + "\n";
        }
        else {
            csvContent1 +=  (index+1) + ",0," + p.width + "," + p.depth +
            ",0 ,0 ,0 ," + (p.x )+ "," + (p.y) + ", 0, 0, 0, 0, 0, 0, 0 , 0, 0, 0, 0, 0\n";
        }
    });
    let encodedUri = encodeURI(csvContent1);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Model_" + modelIndex.toString() + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "Model.csv".
}

function showValues(){
    select('#skewedFactorValue').html(Number.parseFloat(skewedFactor).toFixed(2), false);
    select('#skewedFactor').value(skewedFactor);
    select('#greenPerCapitaValue').html(greenPPIdeal, false);
    select('#greenPerCapita').value(greenPPIdeal);
    select('#heightFactorValue').html(Number.parseFloat(heightIdeal).toFixed(2), false);
    select('#heightFactor').value(heightIdeal);

    fill(50);
    noStroke();
    textSize(20);
    text('Height colour map ', landWidth+25, 100, 90);
    text(max(buildingsHeights)+' m', landWidth+60, 200);
    text(floor(3*(max(buildingsHeights) + min(buildingsHeights))/4)+' m', landWidth+60, 325);
    text(floor(max(buildingsHeights) + min(buildingsHeights))/2+' m', landWidth+60, 450);
    text(floor((max(buildingsHeights) + min(buildingsHeights))/4)+' m', landWidth+60, 575);
    text(min(buildingsHeights)+' m', landWidth+60, 700);
}

function adjustGreenArea(){
    if(greenPPIdeal > 0) { 
        let ND = buildings.filter(b => b.building.type < 3)
        if(ND.length - greenPPIdeal < 10)
            greenPPIdeal = ND.length-10;
        for( let i = 0 ; i < greenPPIdeal ; i++){
            random(ND).makeGreen();
        }
    }
}
