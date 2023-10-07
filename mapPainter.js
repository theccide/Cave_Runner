const WALL_PARTS = {
    NOWALL: 0, RIGHT: 1, LEFT: 2, HOR: 3, BOTTOM: 4, RIGHT_BOTTOM_CORNER: 5, LEFT_BOTTOM_CORNER: 6,
    BOTTOM_T: 7, TOP: 8, RIGHT_TOP_CONRER: 9, LEFT_TOP_CONRER: 10, TOP_T: 11, VER: 12, RIGHT_T: 13,
    LEFT_T: 14, MIDDLE_T: 15
};

const WALL_NAMES = {
    0: 'NOWALL', 1: 'RIGHT', 2: 'LEFT', 3: 'HOR', 4: 'BOTTOM', 5: 'RIGHT_BOTTOM_CORNER', 
    6: 'LEFT_BOTTOM_CORNER', 7: 'BOTTOM_T', 8: 'TOP', 9: 'RIGHT_TOP_CONRER',
    10: 'LEFT_TOP_CONRER', 11: 'TOP_T', 12: 'VER', 13: 'RIGHT_T', 14: 'LEFT_T', 15: 'MIDDLE_T'
};

const clearMatrix=(width,height)=>{
    let newMatrix = [];
    for(let y=0; y < height; y++){
        newMatrix[y] = [];
        for(let x=0; x < width; x++){
            newMatrix[y][x] = 0;
        }
    }
    return newMatrix;
}

const setBit=(byte, position, value)=> {
    if (value === 1) { return byte | (1 << position);}            
    return byte & ~(1 << position); // If the value is 0, clear the bit.
}

const buildDetailedMatrix=()=>{
    let detailedMatrix = JSON.parse(JSON.stringify(matrix));
    let breakMatrix  = clearMatrix(numColTiles, numRowTiles);

    // find how walls connect to each other
    matrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            let byte = 0b00000000;
            if(matrix[y][x]==1){
                if(x!= 0) byte = setBit(byte, 0, matrix[y][x-1]);
                if(x < matrix[y].length) byte = setBit(byte, 1, matrix[y][x+1]);
                if(y!= 0) byte = setBit(byte, 2, matrix[y-1][x]);
                if(y < matrix.length) byte = setBit(byte, 3, matrix[y+1][x]);
            }
            detailedMatrix[y][x] = byte;
        })
    });

    // look for rows of lines to add breaks to them
    let rows = [], cols=[];    
    let horLine = null, verLine=null;
    detailedMatrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            if(detailedMatrix[y][x]==WALL_PARTS["HOR"]){
                if(x < detailedMatrix[y].length && detailedMatrix[y][x+1]==WALL_PARTS["HOR"]) {
                    if (!horLine) { horLine = []; }//return;}
                    horLine.push({x, y});
                }
                else{
                    if(horLine) {horLine.push({x, y}); rows.push([...horLine]);}
                    horLine = null;
                }
            }
            if(detailedMatrix[y][x]==WALL_PARTS["VER"]){
                if(y < detailedMatrix.length && detailedMatrix[y+1][x]==WALL_PARTS["VER"]) {
                    if (!verLine) { verLine = []; }//return;}
                    verLine.push({x, y});
                }
                else{
                    if(verLine) {verLine.push({x, y});cols.push([...verLine]);}
                    verLine = null;
                }
            }
        })        
    });

    rows.forEach(line => {
        line.forEach(cell => {
            breakMatrix[cell.y][cell.x] = 1;
        });
    });
    cols.forEach(line => {
        line.forEach(cell => {
            breakMatrix[cell.y][cell.x] = 2;
        });
    });

    return {detailedMatrix,breakMatrix};
}

const drawWalls=({detailedMatrix,breakMatrix},tileName, faceName)=>{
    wallBuffer.clearRect(0, 0, mapSize.width, mapSize.height); //clear canvas

    // draw shadows
    detailedMatrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            if(
                cell==WALL_PARTS.HOR || cell==WALL_PARTS.BOTTOM_T || cell==WALL_PARTS.RIGHT || cell==WALL_PARTS.LEFT ||
                cell==WALL_PARTS.LEFT_BOTTOM_CORNER || cell==WALL_PARTS.RIGHT_BOTTOM_CORNER || cell==WALL_PARTS.BOTTOM
            ){
                drawImageFrom00(wallBuffer, images[`Images/builder/bot_shadow.png`],x*32,(y*32)+32,32,32);
                drawImageFrom00(wallBuffer, images[`Images/builder/top_shadow.png`],x*32,(y*32)+64,32,32);
            }
            if(
                cell==WALL_PARTS.VER || cell==WALL_PARTS.TOP || cell==WALL_PARTS.BOTTOM || cell==WALL_PARTS.RIGHT_T ||
                cell==WALL_PARTS.RIGHT_BOTTOM_CORNER || cell==WALL_PARTS.RIGHT_TOP_CONRER
            ){
                drawImageFrom00(wallBuffer, images[`Images/builder/right_shadow.png`],(x*32),y*32,32,32);
                drawImageFrom00(wallBuffer, images[`Images/builder/shadow.png`],(x*32)+32,y*32,32,32);
            }
            if(
                cell==WALL_PARTS.RIGHT_BOTTOM_CORNER
            ){
                drawImageFrom00(wallBuffer, images[`Images/builder/shadow.png`],(x*32)+32,(y*32)+32,32,32);
                drawImageFrom00(wallBuffer, images[`Images/builder/top_shadow.png`],(x*32)+32,(y*32)+64,32,32);
            }            
        })
    });
    
    // draw wall faces
    detailedMatrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            if(
                cell==WALL_PARTS.HOR || cell==WALL_PARTS.BOTTOM_T || cell==WALL_PARTS.RIGHT || cell==WALL_PARTS.LEFT ||
                cell==WALL_PARTS.LEFT_BOTTOM_CORNER || cell==WALL_PARTS.RIGHT_BOTTOM_CORNER || cell==WALL_PARTS.BOTTOM
            )
                drawImageFrom00(wallBuffer, images[`Images/builder/wall_faces/${faceName}/HOR.png`],x*32,(y*32)+25,32,32);
        })
    });

    // draw wall edges
    detailedMatrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            if(cell!=0)
                drawImageFrom00(wallBuffer, images[`Images/builder/wall_types/${tileName}/${WALL_NAMES[cell]}.png`],x*32,y*32,32,32);
        })
    });

    // draw wall breaks
    breakMatrix.forEach((row,y) => { 
        row.forEach((cell, x)=>{
            if(cell==1){
                const randDist = Tools.getNumberBetween(5, 32-7);
                drawImageFrom00(wallBuffer, images[`Images/builder/wall_types/${tileName}/HOR_BREAK.png`],x*32+randDist,y*32,7,32);
            }
            if(cell==2){
                const randDist = Tools.getNumberBetween(5, 32-8);
                drawImageFrom00(wallBuffer, images[`Images/builder/wall_types/${tileName}/VER_BREAK.png`],x*32,y*32+randDist,32,8);
            }            
        })
    });

    drawImageSpriteFrom00(backBuffer, wallCanvas,             
        0,0, mapSize.width, mapSize.height,
        0,0, mapSize.width, mapSize.height
    );
}

const setupFacesToLoad=({tileName})=>{
    const path = `Images/builder/wall_faces/${tileName}`;
    let tilesToLoad = [`${path}/HOR.png`];
    return tilesToLoad;
}

const setupTilesToLoad=({tileName, extraFiles})=>{
    const path = `Images/builder/wall_types/${tileName}`;
    let tilesToLoad = [];
    Object.values(WALL_NAMES).forEach(wallFile => {
        if(wallFile!=="NOWALL") tilesToLoad.push(`${path}/${wallFile}.png`);
    });
    extraFiles.forEach(fileName=>{
        tilesToLoad.push(`${path}/${fileName}.png`);
    });
    return tilesToLoad;
}