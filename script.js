 const table = document.querySelector("#tableId");
const cells = table.getElementsByTagName('td');
const part1 = document.querySelector("#part1Span");
const part2 = document.querySelector("#part2Span");
const part3 = document.querySelector("#part3Span");

// water bottles
const waterBottle = document.querySelector("#bottleOfWater")
const secondBottleOfWater = document.querySelector("#bottleOfWater2")
const thirdBottleOfWater = document.querySelector("#bottleOfWater3")
const fourthBottleOfWater = document.querySelector("#bottleOfWater4")

// action pts
const playerOneAction = document.querySelector("#palm1")
const playerTwoAction = document.querySelector("#palm2")
const playerThreeAction = document.querySelector("#palm3")
const playerFourAction = document.querySelector("#palm4")

let bottle1 = document.querySelector('#waterBottleNum1')
const bottle2 = document.querySelector('#waterBottleNum2')
const bottle3 = document.querySelector('#waterBottleNum3')
const bottle4 = document.querySelector('#waterBottleNum4')

let bottle1tracker = 6
let actions = 3



const palm1 = document.querySelector("#palmNum1")
const palm2 = document.querySelector("#palmNum2")
const palm3 = document.querySelector("#palmNum3")
const palm4 = document.querySelector("#palmNum4")

palm1.style.marginLeft = '20px'
palm2.style.marginLeft = '20px'
palm3.style.marginLeft = '20px'
palm4.style.marginLeft = '20px'

bottle1.style.marginLeft = '20px'
bottle2.style.marginLeft = '20px'
bottle3.style.marginLeft = '20px'
bottle4.style.marginLeft = '20px'


function pointerHandler() {
    table.style.cursor = 'pointer';
    table.style.cursor = 'auto'
}

table.addEventListener("mouseover", pointerHandler);
function middleCellCalc() {
    return Math.floor(cells.length / 2);
}

function randomSpotsCalcForOases() {
    const middleIndex = middleCellCalc();
    const selectedCells = [];
    while (selectedCells.length < 4) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        if (!selectedCells.includes(randomIndex) && randomIndex !== middleIndex) {
            selectedCells.push(randomIndex);
        }
    }
    return selectedCells;
}

function RandomOasesHandler() {
    const oases = ['Assets/Assets/Oasis marker.png', 'Assets/Assets/Oasis marker.png', 'Assets/Assets/Oasis marker.png', 'Assets/Assets/Oasis marker.png'];
    const selectedCells = randomSpotsCalcForOases();
    selectedCells.forEach((cellIndex, index) => {
        const rndImgIndex = Math.floor(Math.random() * oases.length);
        const imgSrc1 = oases[rndImgIndex];
        let imgSrc2;
        if (index === 3) {
            imgSrc2 = 'Assets/Assets/Drought.png';
        } else {
            imgSrc2 = 'Assets/Assets/Oasis.png';
        }
        const cell = cells[cellIndex];
        const oasesImage = document.createElement('img');
        oasesImage.src = imgSrc1;
        oasesImage.classList.add('img');
        oasesImage.style.maxWidth = '100%';
        oasesImage.style.maxHeight = '100%';
        cell.appendChild(oasesImage);
        
        playerOneAction.addEventListener("click", function() {
            if (!oasesImage.flipped && cellIndex === global && (global !== 0)) {
                oasesImage.src = imgSrc2;
                oasesImage.flipped = true;
                cell.style.backgroundColor = 'rgba(253,231,190,255)'
            }
           })
    });
    
}
    const stargateSource = 'Assets/Assets/Stargate.png';
    const stargatePic = document.createElement('img');
    const targetCell1 = cells[middleCellCalc()];
    stargatePic.src = stargateSource;
    stargatePic.classList.add('img');
    stargatePic.style.maxHeight = '100%';
    stargatePic.style.maxWidth = '100%';
    targetCell1.style.position = 'relative';
    stargatePic.style.position = 'absolute';
    stargatePic.style.top = 0;
    stargatePic.style.left = 0; 
    stargatePic.style.zIndex = 1;
    targetCell1.appendChild(stargatePic);

    let global = 0;
    function loadPlayer() {
        const table = document.querySelector("#tableId");
        const cells = Array.from(table.getElementsByTagName('td'));
        let targetCellIndex = middleCellCalc();
        const playerPic = document.createElement('img');
        playerPic.src = 'Assets/Assets/Player.png';
        playerPic.classList.add('img');
        playerPic.style.maxHeight = '100%';
        playerPic.style.maxWidth = '100%';
        playerPic.style.position = 'absolute'; 
        playerPic.style.top = 0; 
        playerPic.style.left = 0; 
        playerPic.style.zIndex = 2;
        cells[targetCellIndex].appendChild(playerPic);
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                const targetIndex = cells.indexOf(cell);
                global = targetIndex;
                if (isAdjacent(targetCellIndex, targetIndex)) {
                    const targetCell = cells[targetIndex];
                    playerPic.style.top = 0; 
                    playerPic.style.left = 0;
                    playerPic.remove(); 
                    targetCell.appendChild(playerPic); 
                    targetCellIndex = targetIndex;
                    bottle1tracker = bottle1tracker - 1;
                    }
            });
            
        });
    
        function isAdjacent(currentIndex, targetIndex) {
            return Math.abs(currentIndex - targetIndex) === 1 || Math.abs(currentIndex - targetIndex) === 5;
        }
    }


    function addClues(cell, clueImage) {
        cell.appendChild(clueImage);
        clueImage.style.visibility = 'hidden';
    
        playerOneAction.addEventListener("click", function() {
            const cellIndex = Array.from(cells).indexOf(cell);
            if (cellIndex === global && (global !== 0)) {
                clueImage.style.visibility = 'visible';
                clueImage.style.backgroundColor = 'rgba(253, 231, 190, 1)';
                actions = actions - 1;
                    const actionsDisplay = document.querySelector("#palmNum1")
                    if(actionsDisplay) {
                        actionsDisplay.textContent = actions;
                }
                
            } 
            if(actions === 0) {
                bottle1tracker = bottle1tracker - 1;
                const bottleScoreDisplay = document.querySelector("#waterBottleNum1");
                if(bottleScoreDisplay) {
                    bottleScoreDisplay.textContent = bottle1tracker;
                }
            }
        });
    }
    
    function cellDoesNotContainImg(index) {
        if(cells[index].querySelector('img')) {
            return false
        } else {
            return true
        }
    }

    function panelsPopulate() {
        // ------- upper panels ----------
        const items = ['Assets/Assets/Item 1.png', 'Assets/Assets/Item 2.png', 'Assets/Assets/Item 3.png'];
        const partElements = [part1, part2, part3];
        
        partElements.forEach((part, index) => {
            part.textContent = '';
            const itemSrc = items[index];
            const itemImage = document.createElement('img');
            itemImage.classList.add('img');
            itemImage.src = itemSrc;
            itemImage.style.maxHeight = '100%';
            itemImage.style.maxWidth = '100%';
            itemImage.style.opacity = 0.7;
            part.appendChild(itemImage);
        });

        const palmImgSrc = 'Assets/Assets/Action Points.png';
        const palmImgs = [playerOneAction, playerTwoAction, playerThreeAction, playerFourAction];
        palmImgs.forEach((player, index) => {
        const palmImg = document.createElement('img');
        palmImg.src = palmImgSrc;
        palmImg.style.maxHeight = '100%';
        palmImg.style.maxWidth = '100%';
        player.style.position = 'relative';
        palmImg.style.position = 'absolute';
        player.appendChild(palmImg);
        palmImg.style.cursor = 'pointer';
        palmImg.style.left = '-10px'
        });
        

        const wbImageSrc = 'Assets/Assets/Water.png';
        const wbImages = [waterBottle, secondBottleOfWater, thirdBottleOfWater, fourthBottleOfWater];
        wbImages.forEach((bottle, index) => {
        const wbImage = document.createElement('img');
        wbImage.src = wbImageSrc;
        wbImage.classList.add('img');
        wbImage.style.maxHeight = '100%';
        wbImage.style.maxWidth = '100%';
        bottle.style.position = 'relative';
        wbImage.style.position = 'absolute';
        bottle.appendChild(wbImage);
        wbImage.style.left = '-10px'

    });

        // --->> upper panels ---- //
    

        // - gathering available spots for further use- ---
        let availableSpots = [];
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].querySelector('img')) {
                availableSpots.push(i);
            }
        }
        // // // 

        
        const selectedTiles = [];
        while (selectedTiles.length < 3) {
            const randomIndex = Math.floor(Math.random() * availableSpots.length);
            const selectedTile = availableSpots[randomIndex];
            selectedTiles.push(selectedTile);
            availableSpots.splice(randomIndex, 1);
        }
    
        selectedTiles.forEach((tileIndex, index) => {
            const itemSrc = items[index];
            const cell = cells[tileIndex];
            const itemImage = document.createElement('img');
            itemImage.src = itemSrc;
            itemImage.classList.add('img');
            itemImage.style.maxWidth = '100%';
            itemImage.style.maxHeight = '100%';
            cell.appendChild(itemImage);
            itemImage.style.visibility = 'hidden';
            
            // down clue, first //
            const downClueSrc_item1 = 'Assets/Assets/Item 1 - clue_DOWN.png';
            const downClue_item1 = document.createElement('img');
            downClue_item1.src = downClueSrc_item1;
            downClue_item1.classList.add('img');
            downClue_item1.style.maxWidth = '100%';
            downClue_item1.style.maxHeight = '100%';
            // down clue, first//

            // up clue first //
            const downClueSrc_item2 = 'Assets/Assets/Item 1 - clue_UP.png';
            const downClue_item2 = document.createElement('img');
            downClue_item2.src = downClueSrc_item2;
            downClue_item2.classList.add('img');
            downClue_item2.style.maxWidth = '100%';
            downClue_item2.style.maxHeight = '100%';
            // up clue first//

            // (go to right ) clue of first
            const downClueSrc_item3 = 'Assets/Assets/Item 1 - clue_RIGHT.png';
            const downClue_item3 = document.createElement('img');
            downClue_item3.src = downClueSrc_item3;
            downClue_item3.classList.add('img');
            downClue_item3.style.maxWidth = '100%';
            downClue_item3.style.maxHeight = '100%';
            // (go to right ) clue of first

            //go left clue
            const downClueSrc_item4 = 'Assets/Assets/Item 1 - clue_LEFT.png';
            const downClue_item4 = document.createElement('img');
            downClue_item4.src = downClueSrc_item4;
            downClue_item4.classList.add('img');
            downClue_item4.style.maxWidth = '100%';
            downClue_item4.style.maxHeight = '100%';
            
            //go left clue

            // --------->>> SECOND ITEM OPERATIONS ------------<<<<< ///

            // down clue, second //
            const secondClueDown_src = 'Assets/Assets/Item 2 - clue_DOWN.png';
            const secondClueDown = document.createElement('img');
            secondClueDown.src = secondClueDown_src;
            secondClueDown.classList.add('img');
            secondClueDown.style.maxWidth = '100%';
            secondClueDown.style.maxHeight = '100%';
            // down clue, second//

            
            // up clue second //
            const secondClueUp_src = 'Assets/Assets/Item 2 - clue_UP.png';
            const secondClueUp = document.createElement('img');
            secondClueUp.src = secondClueUp_src;
            secondClueUp.classList.add('img');
            secondClueUp.style.maxWidth = '100%';
            secondClueUp.style.maxHeight = '100%';
            // up clue second//
            
            // (go to right ) clue of second
            const secondClueRight_src = 'Assets/Assets/Item 2 - clue_RIGHT.png';
            const secondClueRight = document.createElement('img');
            secondClueRight.src = secondClueRight_src;
            secondClueRight.classList.add('img');
            secondClueRight.style.maxWidth = '100%';
            secondClueRight.style.maxHeight = '100%';
            // (go to right ) clue of second
            
            //go left clue
            const secondClueLeft_src = 'Assets/Assets/Item 2 - clue_LEFT.png';
            const secondClueLeft = document.createElement('img');
            secondClueLeft.src = secondClueLeft_src;
            secondClueLeft.classList.add('img');
            secondClueLeft.style.maxWidth = '100%';
            secondClueLeft.style.maxHeight = '100%';



            // ******************** Third Item Operations ******************
            const thirdClueDown_src = 'Assets/Assets/Item 3 - clue_DOWN.png';
            const thirdClueDown = document.createElement('img');
            thirdClueDown.src = thirdClueDown_src;
            thirdClueDown.classList.add('img');
            thirdClueDown.style.maxWidth = '100%';
            thirdClueDown.style.maxHeight = '100%';
            
            const thirdClueUp_src = 'Assets/Assets/Item 3 - clue_UP.png';
            const thirdClueUp = document.createElement('img');
            thirdClueUp.src = thirdClueUp_src;
            thirdClueUp.classList.add('img');
            thirdClueUp.style.maxWidth = '100%';
            thirdClueUp.style.maxHeight = '100%';
            // up clue third//
            
            const thirdClueRight_src = 'Assets/Assets/Item 3 - clue_RIGHT.png';
            const thirdClueRight = document.createElement('img');
            thirdClueRight.src = thirdClueRight_src;
            thirdClueRight.classList.add('img');
            thirdClueRight.style.maxWidth = '100%';
            thirdClueRight.style.maxHeight = '100%';
            // (go to right ) clue of third
            
            const thirdClueLeft_src = 'Assets/Assets/Item 3 - clue_LEFT.png';
            const thirdClueLeft = document.createElement('img');
            thirdClueLeft.src = thirdClueLeft_src;
            thirdClueLeft.classList.add('img');
            thirdClueLeft.style.maxWidth = '100%';
            thirdClueLeft.style.maxHeight = '100%';
            

            // HOLES
            const holeSrc = 'Assets/Assets/Hole.png';
            const hole = document.createElement('img');
            hole.src = holeSrc;
            hole.classList.add('img');
            hole.style.maxHeight = '100%';
            hole.style.maxWidth = '100%';
            //hole.style.visibility = 'hidden'
            

            
            // ******************--------- > down clue for the items <-------*****************
            if (itemSrc === 'Assets/Assets/Item 1.png') {
                let aboveCellIndex = tileIndex - 20;
                if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                    addClues(cells[aboveCellIndex], downClue_item1)               
                } else {
                    aboveCellIndex = tileIndex - 15;
                    if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                        addClues(cells[aboveCellIndex], downClue_item1)
                    } else {
                        aboveCellIndex = tileIndex - 10;
                        if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                            addClues(cells[aboveCellIndex], downClue_item1)
                        } else {
                            aboveCellIndex = tileIndex - 5;
                            if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                                addClues(cells[aboveCellIndex], downClue_item1)
                            }
                        }
                    }
                }
            } 
            if(itemSrc === 'Assets/Assets/Item 2.png') {
                let aboveCellIndex = tileIndex - 20;
                if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                    addClues(cells[aboveCellIndex], secondClueDown)               
                } else {
                    aboveCellIndex = tileIndex - 15;
                    if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                        addClues(cells[aboveCellIndex], secondClueDown)
                    } else {
                        aboveCellIndex = tileIndex - 10;
                        if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                            addClues(cells[aboveCellIndex], secondClueDown)
                        } else {
                            aboveCellIndex = tileIndex - 5;
                            if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                                addClues(cells[aboveCellIndex], secondClueDown)
                            }
                        }
                    }
                }
            }  
            if(itemSrc === 'Assets/Assets/Item 3.png') {
                aboveCellIndex = tileIndex - 15;
                    if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                        addClues(cells[aboveCellIndex], thirdClueDown)
                    } else {
                        aboveCellIndex = tileIndex - 10;
                        if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                            addClues(cells[aboveCellIndex], thirdClueDown)
                        } else {
                            aboveCellIndex = tileIndex - 5;
                            if (aboveCellIndex >= 0 && availableSpots.includes(aboveCellIndex) && cellDoesNotContainImg(aboveCellIndex)) {
                                addClues(cells[aboveCellIndex], thirdClueDown)
                            }
                        }
                    }
            }
            // ******************--------- > down clue for the items <-------*****************
            



            // ****************** up clue for the itesm ***************//
            if (itemSrc === 'Assets/Assets/Item 1.png') {
                let downCellIndex = tileIndex + 20;
                if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                    addClues(cells[downCellIndex], downClue_item2)               
                } else {
                    downCellIndex = tileIndex + 15;
                    if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                        addClues(cells[downCellIndex], downClue_item2)
                    } else {
                        downCellIndex = tileIndex + 10;
                        if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                            addClues(cells[downCellIndex], downClue_item2)
                        } else {
                            downCellIndex = tileIndex + 5;
                            if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                                addClues(cells[downCellIndex], downClue_item2)
                            }
                        }
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 2.png') {
                let downCellIndex = tileIndex + 20;
                if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                    addClues(cells[downCellIndex], secondClueUp)               
                } else {
                    downCellIndex = tileIndex + 15;
                    if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                        addClues(cells[downCellIndex], secondClueUp)
                    } else {
                        downCellIndex = tileIndex + 10;
                        if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                            addClues(cells[downCellIndex], secondClueUp)
                        } else {
                            downCellIndex = tileIndex + 5;
                            if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                                addClues(cells[downCellIndex], secondClueUp)
                            }
                        }
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 3.png') {
                let downCellIndex = tileIndex + 20;
                if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                    addClues(cells[downCellIndex], thirdClueUp)               
                } else {
                    downCellIndex = tileIndex + 15;
                    if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                        addClues(cells[downCellIndex], thirdClueUp)
                    } else {
                        downCellIndex = tileIndex + 10;
                        if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                            addClues(cells[downCellIndex], thirdClueUp)
                        } else {
                            downCellIndex = tileIndex + 5;
                            if (downCellIndex >= 0 && availableSpots.includes(downCellIndex) && cellDoesNotContainImg(downCellIndex)) {
                                addClues(cells[downCellIndex], thirdClueUp)
                            }
                        }
                    }
                }
            }
            // ****************** up clue for the item ***************//




            // *************** go Right clue for the item *****************/
            if (itemSrc === 'Assets/Assets/Item 1.png') {
                for (let i = tileIndex - 1; i >= 0; i--) {
                    if (Math.floor(tileIndex / 5) === Math.floor(i / 5) && availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], downClue_item3);
                    } else {
                        break; 
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 2.png') {
                for (let i = tileIndex - 1; i >= 0; i--) {
                    if (Math.floor(tileIndex / 5) === Math.floor(i / 5) && availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], secondClueRight);
                    } else {
                        break; 
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 3.png') {
                for (let i = tileIndex - 1; i >= 0; i--) {
                    if (Math.floor(tileIndex / 5) === Math.floor(i / 5) && availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], thirdClueRight);
                    } else {
                        break; 
                    }
                }
            }
            // *************** go Right clue for the  item *****************/



            
            // *************** go Left clue for the items *****************/
            if (itemSrc === 'Assets/Assets/Item 1.png') {
                for (let i = tileIndex + 1; i % 5 !== 0; i++) {
                    if (availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], downClue_item4);
                        break;
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 3.png') {
                for (let i = tileIndex + 1; i % 5 !== 0; i++) {
                    if (availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], thirdClueLeft);
                        break;
                    }
                }
            } 
            if (itemSrc === 'Assets/Assets/Item 2.png') {
                for (let i = tileIndex + 1; i % 5 !== 0; i++) {
                    if (availableSpots.includes(i) && cellDoesNotContainImg(tileIndex)) {
                        addClues(cells[i], secondClueLeft);
                        break;
                    }
                }
            }
            
            // *************** go Left clue for the  items *****************
            playerOneAction.addEventListener("click", function() {
                if(tileIndex === global && (global !== 0)) {
                    itemImage.style.visibility = 'visible'
                    cell.style.backgroundColor = 'rgba(253,231,190,255)';
                    partElements[index].querySelector('img').style.opacity = 1;
                    actions = actions - 1;
                    const actionsDisplay = document.querySelector("#palmNum1")
                    if(actionsDisplay) {
                        actionsDisplay.textContent = actions;
                    }
                }        
           })
           

        });   
        
    }

    function fillTheRest(){
        let availableSpots = [];
        for (let i = 0; i  < cells.length; i++) {
            if (!cells[i].querySelector('img')) {
                availableSpots.push(i);
            }
        }
        
        for (let i = 0; i <= availableSpots.length; i++) {
            const freeInd = availableSpots[i];
            if (freeInd >= 0 && freeInd < cells.length) {
                const cell = cells[freeInd];
                if (cellDoesNotContainImg(freeInd)) {
                    const holeSrc = 'Assets/Assets/Hole.png';
                    const hole = document.createElement('img');
                    hole.src = holeSrc;
                    hole.classList.add('img');
                    hole.style.maxWidth = '100%';
                    hole.style.maxHeight = '100%';
                    cell.appendChild(hole);
                    hole.style.visibility = 'hidden'

                    playerOneAction.addEventListener("click", function() {
                        const cellIndex = Array.from(cells).indexOf(cell);
                        if (cellIndex === global && (global !== 0)) {
                            hole.style.visibility = 'visible';
                            hole.style.backgroundColor = 'rgba(253, 231, 90, 1)';
                        } 
                    });
                }
            }
        }
    }

    
    
document.addEventListener("DOMContentLoaded", function(){
    RandomOasesHandler();
    loadPlayer();
    panelsPopulate();
    fillTheRest()
});




