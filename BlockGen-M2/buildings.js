class Building {
	constructor(type) {
        this.type = type;     
        let widthCoeff =  random(0,1); //randomGaussian(skewedF, stddev);
        let depthCoeff =  random(0,1); //randomGaussian(skewedF, stddev);
        let heightCoeff = random(0,1); //randomGaussian(skewedF, stddev);
        // constrain(widthCoeff, 0, 1);
        // constrain(depthCoeff, 0, 1);
        // constrain(heightCoeff, 0, 1);
        switch(this.type){ 
            case 1:
            //NDLR
                this.width = floor(map(widthCoeff, 0, 1, buildingType1[0], buildingType1[1]));
                this.depth = floor(map(depthCoeff, 0, 1, buildingType1[2], buildingType1[3]));
                this.storeyHeight = 3.2;
                this.height = floor(Math.ceil(parseInt(floor(map(heightCoeff, 0, 1, buildingType1[4], buildingType1[5])))/this.storeyHeight)*this.storeyHeight);
                if( Math.round(this.height/this.storeyHeight))
                this.xDist = 0;
                this.yDist = 0;
                break;
            case 2:
            //NDHR
                this.width = floor(map(widthCoeff, 0, 1, buildingType2[0], buildingType2[1]));
                this.depth = floor(map(depthCoeff, 0, 1, buildingType2[2], buildingType2[3]));
                this.storeyHeight = 3.9;
                this.height = floor(Math.ceil(parseInt(floor(map(heightCoeff, 0, 1, buildingType2[4], buildingType2[5])))/this.storeyHeight)*this.storeyHeight);
                this.xDist = 0;
                this.yDist = 0;                
                break;
            case 3:
            // DLR
                this.width = floor(map(widthCoeff, 0, 1, buildingType3[0], buildingType3[1]));
                this.depth = floor(map(depthCoeff, 0, 1, buildingType3[2], buildingType3[3]));
                this.storeyHeight = 3.4;
                this.height = floor(Math.ceil(parseInt(floor(map(heightCoeff, 0, 1, buildingType3[4], buildingType3[5])))/this.storeyHeight)*this.storeyHeight);
                this.xDist = 0;
                this.yDist = 0;
                break;
            case 4:
            // DHR
                this.width = floor(map(widthCoeff, 0, 1, buildingType4[0], buildingType4[1]));
                this.depth = floor(map(depthCoeff, 0, 1, buildingType4[2], buildingType4[3]));
                this.storeyHeight = 3;
                this.height = floor(Math.ceil(parseInt(floor(map(heightCoeff, 0, 1, buildingType4[4], buildingType4[5])))/this.storeyHeight)*this.storeyHeight);
                this.xDist = 0;
                this.yDist = 0;
                break;
            case 5:
            /// TERR
                this.width = floor(map(widthCoeff, 0, 1, buildingType5[0], buildingType5[1]));
                this.depth = floor(map(depthCoeff, 0, 1, buildingType5[2], buildingType5[3]));
                this.storeyHeight = 4;
                this.height = floor(Math.ceil(parseInt(floor(map(heightCoeff, 0, 1, buildingType5[4], buildingType5[5])))/this.storeyHeight)*this.storeyHeight);
                this.xDist = 0;
                this.yDist = 0;
                break;
            default:
                break;
        }
        this.x = 0;
        this.y = 0;
        this.footprint = this.width * this.depth;
        this.noStories = Math.round(this.height/this.storeyHeight);
        this.floorArea = this.footprint * this.noStories;
        this.roofArea = this.footprint;
        this.facadeArea = (2 * this.width + 2 * this.depth) * this.height + this.roofArea;
        this.envelope = (2 * this.width + 2 * this.depth) + this.height
    }
}
