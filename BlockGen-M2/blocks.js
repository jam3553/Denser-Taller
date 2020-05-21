class Block {
	constructor(x , y , w , b, colorCode){
		this.x = x;
		this.y = y;
		this.width = w;
		this.depth = b;
		this.buildings = [];
		this.plots = [];
		this.colorCode= colorCode;
		this.divided = false;
		this.dividable = true;
		if(this.width * this.depth < 6000){
			this.dividable  = false;
		}
	}
	subdivide(){
		const subBlocksColor = 255;
		widthArray = [this.width/3, this.width/2, 2*this.width/3];
		depthArray = [this.depth/3, this.depth/2, 2*this.depth/3];
		if(this.width >= this.depth){
			let plotWidth = random(widthArray); //floor(random(this.width*2/5 , this.width*(3/5)));
			this.left = new Block(this.x, this.y, plotWidth - minorStreetWidth/2, this.depth, subBlocksColor);
			//this.plots.push(this.left);
			this.right = new Block(this.x + plotWidth + minorStreetWidth/2, this.y, this.width - plotWidth - minorStreetWidth/2, this.depth,subBlocksColor);

		} else {
			let plotBreadth = random(depthArray);//floor(random(this.depth*2/5 , this.depth*(3/5)));
			this.left = new Block(this.x, this.y, this.width, plotBreadth-minorStreetWidth/2, subBlocksColor);
			this.right = new Block(this.x, this.y + plotBreadth + minorStreetWidth/2, this.width , this.depth - plotBreadth - minorStreetWidth/2, subBlocksColor);
		}           
		this.divided = true;

	}

	createMinorStreets(){
		const subBlocksColor = 255;
		if(this.width >= this.depth){
			let newWidth = floor(random(this.width*2/5 , this.width*(3/5)));
			this.left = new Block(this.x, this.y, newWidth - minorStreetWidth/2, this.depth, subBlocksColor);
			//this.plots.push(this.left);
			this.right = new Block(this.x + newWidth + minorStreetWidth/2, this.y, this.width - newWidth - minorStreetWidth/2, this.depth,subBlocksColor);


		} else {
			let newBreadth = floor(random(this.depth*2/5 , this.depth*(3/5)));
			this.left = new Block(this.x, this.y, this.width, newBreadth-minorStreetWidth/2, subBlocksColor);
			this.right = new Block(this.x, this.y + newBreadth + minorStreetWidth/2, this.width , this.depth - newBreadth - minorStreetWidth/2, subBlocksColor);
		}           
		this.divided = true;

	}

	isOdd(num){ return num % 2;}

	
	createPlots(){
		if(!this.dividable){
			plots.push(new Plot(this.x, this.y, this.width, this.depth))
			if(this.divided){
				this.left.createPlots();
				this.right.createPlots();
			}
		} else {
			if(this.divided){
				this.left.createPlots();
				this.right.createPlots();
			}
		}   
	}
	addMinorStreets(){
		if(this.dividable){
			if(!this.divided)
				this.createMinorStreets();
			this.left.addMinorStreets();
			this.right.addMinorStreets();
		} else {
			//this.divide();
		}  
	}
	show(){
		if(!this.dividable){
			stroke(0);
			strokeWeight(1);
			rectMode(CORNER);
			fill(160);
			rect(this.x, this.y, this.width, this.depth);
			//fill(0)
			//text('w: '+ this.width + '\n b: '+this.depth, this.x+5, this.y+this.depth/2)
		} else {
			if(this.divided){
				fill(this.colorCode);
				this.left.show();
				this.right.show();
			}
		}
	}
}

/// street class
class Street{
	constructor(type, width, startX, startY, endX, endY){
		this.type = type;
		this.width = width;
		this.startX = startX;
		this.endX = endX;
		this.startY = startY;
		this.endY =endY;
	}
	show(){
		stroke(90);
		strokeWeight(15);
		line(this.startX, this.startY, this.endX, this.endY);
	}
}
