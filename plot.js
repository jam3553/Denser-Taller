// plot class
class Plot{
	constructor(x , y , w , b){
		this.x = x;
    this.y = y;
		this.width = w;
    this.depth = b;
    this.centrePos = createVector(x + this.width/2, y+this.depth/2);
		this.divided = false;
		this.dividable = true;
		this.colorCode = 180;
		this.buildable = true;
		this.building = [];
		this.green = false;
		if(this.green)
			this.colorCode = color(0,255,0);

	}
	divideWidth(newWidth){
		this.left = new Plot(this.x, this.y, newWidth, this.depth);
		this.right = new Plot(this.x + newWidth, this.y, this.width - newWidth, this.depth);
		this.divided = true;
	}
	divideDepth(newBreadth){
		this.left = new Plot(this.x, this.y, this.width, newBreadth);
		this.right = new Plot(this.x, this.y + newBreadth, this.width , this.depth - newBreadth);
		this.divided = true;
	}
	subdivide(){
		let newWidth = floor(random(this.width*2/5 , this.width*(3/5)));
		let newBreadth = floor(random(this.depth*2/5 , this.depth*(3/5)));
		if(this.width >= this.depth){
			if(this.width - this.widthMargin > plotWidth[0]){
				if(this.width / this.depth > 2.5 && this.width/4 > plotWidth[0] && this.width / this.depth < 3.5 ){
					if(this.depth - this.depthMargin > plotDepth[0])
						this.divideDepth(newBreadth);
					else
						this.divideWidth(newWidth);
				} else
					this.divideWidth(newWidth);
			} else
				this.dividable = false;
		} else {
			if(this.depth - this.depthMargin > plotDepth[0]){
				if(this.depth/this.width > 2.5 && this.depth/this.width < 3.5 &&  this.depth/4 > plotDepth[0])
					if(this.width - this.widthMargin > plotWidth[0])
						this.divideWidth(newWidth);
					else
					this.divideDepth(newBreadth);
				else
					this.divideDepth(newBreadth);
			} else
				this.dividable = false;
		}             
		return;
	}
	createPlots(zoneIndicator){
    do {
			let widthCoeff = randomGaussian(skewedFactor, stddev);
			widthCoeff = constrain(widthCoeff, 0, 1)
      this.widthMargin = floor(map(widthCoeff, 0, 1, plotWidth[0], plotWidth[1]));
      this.depthMargin = floor(map(widthCoeff, 0, 1, plotDepth[0], plotDepth[1])); 
    } while( this.widthMargin * this.depthMargin <= CSPlotAreaRange[0] || this.widthMargin * this.depthMargin >= CSPlotAreaRange[1])
    
		if(this.width < this.widthMargin && this.depth < this.depthMargin)
			this.dividable  = false;

		if(this.dividable){
			if(!this.divided)
				this.subdivide();
			if(this.divided){
				this.left.createPlots(zoneIndicator);
				this.right.createPlots(zoneIndicator);
			}
		} 
	}
	filterPlots(p){
		if(!this.dividable){
			if( this.x > p.x &&
				this.y > p.y &&
				this.x + this.width < p.x + p.width &&
				this.y + this.depth < p.y + p.depth ){
					this.makeGreen();
				}
			
		}else {
			if(this.divided){
				this.left.filterPlots(p);
				this.right.filterPlots(p);
			}
		}
	}

	adjustBuildingDistances(){

		let minDist = 0;
		if( this.building.height > 20) {
			if (this.building.height <= 30){
				// higher than 20 and less than 30
				minDist = 20;
			}
			else if (this.building.height <= 40) {
				//higher than 30 and less than 40
				minDist = 30;
			}
			else {
				// higher than 40
				minDist = 100;
			}
		}
		let thisX = this.x + (this.width - this.building.width)/2;
		let thisY = this.y + (this.depth - this.building.depth)/2;
		let neighbours = buildings.filter((b) => {
			thisX - minDist < b.x + (b.width - b.building.width)/2 + b.building.width &&
			thisY - minDist < b.y + (b.depth - b.building.depth)/2 + b.building.depth &&
			thisX + this.building.width + minDist > b.x + (b.width - b.building.width)/2 &&
			thisY + this.building.depth + minDist > b.y + (b.depth - b.building.depth)/2
		})
		if(neighbours.length > 0) {
			if(neighbours.length == 1) {
				neighbours.forEach(n => n.makeGreen());
			}
			else {
				//console.log(neighbours.length);
			}
		}
	}
	makeGreen(){
    this.green = true;
    this.buildable = false;
    this.dividable = false;
    this.colorCode = color(0,255,0);
    this.building = [];
    this.left = [];
    this.right = [];
    this.divided = false;
    greenPlots.push(this);
    if(buildings.includes(this))
      buildings = buildings.filter((b) => b != this);
	}
	show() {
		stroke(0);
		strokeWeight(1);
		rectMode(CORNER);
		if(this.green)
			this.colorCode = color(0,255,0);
		fill(this.colorCode);
		rect(this.x, this.y, this.width, this.depth);
		if(this.divided){
			this.left.show();
			this.right.show();
		}
	}
	height_Coeff_Generator() {
    let hs = randomGaussian(heightIdeal, 0.3);
    hs = constrain(hs, 0, 1);
		return hs; 
	}

	selectBuilding(wLimit, dLimit, stack){
		//  generate the height coefficent which is skewed selected based on heightIdeal
		if(stack >= 50) {
			this.makeGreen();
			return false
		}
		let hs = this.height_Coeff_Generator()
		// let densitySelector = randomGaussian(heightIdeal, 0.25);
		// constrain(densitySelector, 0, 1);
		let NDHRLimit = 25;
		if(heightIdeal >= 0.5) {
				NDHRLimit = 80;
		}
		if(heightIdeal > 0.85)
			NDHRLimit = 200;
		let NDHRCount= 0;

		let NDLRLimit = 120;


		let NDLRCount= 0;

		if(buildings.length > 0){
			buildings.map(b => {if(b.building) {
				if(b.building.type == 2) NDHRCount++; 
				if(b.building.type == 1) NDLRCount++; 
			}
			})
		}
		//console.log(NDHRCount, NDHRLimit)
		let footprintSelectedBuildings = buildingsList.filter((b) => {
			let control1 = this.width - b.width;
			let control2 = this.depth - b.depth;
			let picked = false;
				if(b.type == 2 || b.type == 4) {
					/// if buildings are low rise, select buildings with the margins of 5 in width and 10 in depth
					if( b.width < this.width && b.depth < this.depth && 
						control1 > 10 && control1 < wLimit &&	
						control2 > 10 && control2 < dLimit ){
							picked = true;
					}
				} 
				else if(b.type == 1 || b.type == 3 || b.type == 5) {
					/// if buildings are low rise, select buildings with the margins of 0 in width and 3 in depth
					if( b.width < this.width && b.depth < this.depth &&
						 control1 < wLimit && control2 < dLimit){
						picked = true;
					} 
			}
			return picked;
    });
		if(footprintSelectedBuildings.length > 0) {
			/// Filter buildings that is within the range of 5 m of the selected height
			let heightSelector = floor(map(hs, 0 , 1, min(footprintSelectedBuildings.map(b => b.height)), max(footprintSelectedBuildings.map(b => b.height))));
			let selectedBuildings = footprintSelectedBuildings.filter(b => abs(b.height - heightSelector) < 5 )
			if(NDHRCount >= NDHRLimit) {
				selectedBuildings = selectedBuildings.filter(b => b.type != 2)	
			} 
			if(NDLRCount >= NDLRLimit) {
				selectedBuildings = selectedBuildings.filter(b => b.type != 1)
			}	
			if(selectedBuildings.length > 0) { 
				this.building = random(selectedBuildings); 		
				buildings.push(this);
			}
			else 
				this.selectBuilding(wLimit, dLimit, ++stack);
			}
		else {
      // if cannot find any building make it a green space
      this.makeGreen();	 
    }
	}

	addBuildings(zoneIndicator){
		if(!this.dividable){
			if(this.buildable)
				this.selectBuilding(20,20, 1);
		}else {
			if(this.divided){
				this.left.addBuildings(zoneIndicator);
				this.right.addBuildings(zoneIndicator);
			}
		}
	}
	showBuildings(){
		stroke(0);
		strokeWeight(1);
		rectMode(CENTER);
	   
		if(!this.dividable){
			if(this.building){
				let percent = map(this.building.height, min(buildingsHeights), max(buildingsHeights), 0, 1);
				let from = color(0,0,255);
				let to = color(255,0,0);
				let c = lerpColor(from, to, percent);
				if(this.green)
					this.colorCode = color(0,255,0);
				if(this.building.height > 0) {
					fill(c)
					rect(this.centrePos.x, this.centrePos.y, this.building.width, this.building.depth);
					fill(180);
					text(this.building.type, this.centrePos.x, this.centrePos.y);
				}
			 }
			 else if(this.green)
				this.colorCode = color(0,255,0);
    } else {
			if(this.divided) {
				this.left.showBuildings();
				this.right.showBuildings();
			}
		}
	}
}
