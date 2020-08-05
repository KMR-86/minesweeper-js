if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');

    var width = 10;
    var bombAmount = 20;
    grid = document.querySelector(".grid");
    console.log(width*40+"px");
    grid.style.height=width*40+"px";
    grid.style.width=width*40+"px";
    var squares = [];
    var isGameOver = false;
    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width * width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    var shuffledArray = gameArray.sort(() => Math.random() - 0.5)
    //console.log(shuffledArray)
    var grid_clicked = Array(width * width).fill(0);
    var explored_in_click = Array(width * width).fill(0);
    var is_flaged=Array(width*width).fill(0);
    var flag_count=0;
    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        main();
    });
}
function auto_click(i) {
    squares[i].style.background = "#d2d6d6";
    if(shuffledArray[i]=="bomb")squares[i].innerHTML='💣';
    else squares[i].innerHTML = squares[i].getAttribute("data");
    grid_clicked[i] = 1;

}
function expand_around_zero(i) {
    if (squares[i].getAttribute("data") == 0) {


        var row = Math.floor(i / width);
        var col = Math.floor(i % width);
        if (col != 0 && shuffledArray[i - 1] != 'bomb') auto_click(i - 1);
        if (col != width - 1 && shuffledArray[i + 1] != 'bomb') auto_click(i + 1);
        if (row != 0 && shuffledArray[i - width] != 'bomb') auto_click(i - width);
        if (row != width - 1 && shuffledArray[i + width] != 'bomb') auto_click(i + width);
        if (col != 0 && row != 0 && shuffledArray[i - (width+1)] != 'bomb') auto_click(i - (width+1));
        if (row != 0 && col != width - 1 && shuffledArray[i - (width-1)] != 'bomb') auto_click(i - (width-1));
        if (row != width - 1 && col != width - 1 && shuffledArray[i + (width+1)] != 'bomb') auto_click(i + (width+1));;
        if (row != width - 1 && col != 0 && shuffledArray[i + (width-1)] != 'bomb') auto_click(i + (width-1));


    }

}
function expand_empty_area(root, i) {
    console.log(i);
    explored_in_click[i] = 1;
    if (i < 0 || i >= width * width) {
        return;

    }
    if (root != i && squares[i].getAttribute("data") != 0) {
        return;
    }
    if (squares[i].getAttribute("data") == 0 && shuffledArray[i] != "bomb") {
        squares[i].style.background = "#d2d6d6";
        squares[i].innerHTML = squares[i].getAttribute("data");
        grid_clicked[i] = 1;


    }

    var row = Math.floor(i / width);
    var col = i % width;
    if (row >= 0 && row < width && col >= 0 && col < width) {
        if (grid_clicked[i + width] == 0 && explored_in_click[i + width] == 0) expand_empty_area(root, i + width);
        if (grid_clicked[i - width] == 0 && explored_in_click[i - width] == 0) expand_empty_area(root, i - width);
        if (grid_clicked[i + 1] == 0 && explored_in_click[i + 1] == 0 && col != width - 1) expand_empty_area(root, i + 1);
        if (grid_clicked[i - 1] == 0 && explored_in_click[i - 1] == 0 && col != 0) expand_empty_area(root, i - 1);

    }

    for (i = 0; i < width * width; i++) {
        if (grid_clicked[i] == 1) expand_around_zero(i);
    }


}

function game_won(){
    total_cleared=0;
    for(i=0;i<width*width;i++){
        if(grid_clicked[i]==1 && shuffledArray[i]!='bomb')total_cleared++;
    }
    if(total_cleared==width * width - bombAmount)return true;
    else{
        return false;
    }

}
function alertFunc(){
    if(confirm('sorry,you have lost.play again?')){
        window.location.reload();  
    }
}
function alertFunc_after_winning(){
    if(confirm('wanna play again?')){
        window.location.reload();  
    }
}
function createBoard() {


    grid = document.querySelector(".grid");
    flag = document.querySelector(".flag");
    flag.innerHTML="🚩 left : "+(bombAmount-flag_count)+" &nbsp &nbsp &nbsp &nbsp Total 💣 : "+bombAmount;
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        
        square.setAttribute('id', i)
        grid.appendChild(square);
        squares.push(square);

        // if (shuffledArray[i] == "bomb") {
        //     square.style.background = "red";
        // }

        //normal click
        square.addEventListener('click', function (e) {
            if (!isGameOver) {
                square.style.background = "#d2d6d6";
                if (shuffledArray[square.getAttribute("id")] != "bomb") {
                    square.innerHTML = square.getAttribute("data");
                    grid_clicked[square.getAttribute("id")] = 1;
                    explored_in_click.fill(0);
                    expand_empty_area(Number(square.getAttribute("id")), Number(square.getAttribute("id")));
                }
                else {
                    square.innerHTML = '💣';
                    isGameOver=true;
                    for(i=0;i<width*width;i++){
                        if(shuffledArray[i]=="bomb"){
                            auto_click(i);
                        }
                    }
                    myVar = setTimeout(alertFunc, 1000);

                    
                    
                }
                if(game_won()){
                    isGameOver=true;
                    result = document.querySelector(".result");
                    result.innerHTML="Congrats!!!"+"<br />"+" You have won ";
                    myVar = setTimeout(alertFunc_after_winning, 500);
                }
            }


        })

        square.oncontextmenu = function (e) {
            if(!isGameOver){
                e.preventDefault();
                id=square.getAttribute("id");
                if(is_flaged[id]==0 && grid_clicked[id]==0 && flag_count<bombAmount){
                    square.innerHTML = "🚩";
                    flag_count++;
                    is_flaged[id]=1;
                    flag.innerHTML="🚩 left : "+(bombAmount-flag_count)+" &nbsp &nbsp &nbsp &nbsp Total 💣 : "+bombAmount;
                } 
                else if(is_flaged[id]==1 && grid_clicked[id]==0 && flag_count>0){
                    square.innerHTML = "";
                    flag_count--;
                    is_flaged[id]=0;
                    flag.innerHTML="🚩 left : "+(bombAmount-flag_count)+" &nbsp &nbsp &nbsp &nbsp Total 💣 : "+bombAmount;
                }
                
            }
            
            
        }



    }

    for (let i = 0; i < width * width; i++) {
        var bombs_around = 0;
        var row = Math.floor(i / width);
        var col = Math.floor(i % width);
        if (col != 0 && shuffledArray[i - 1] == 'bomb') bombs_around++;
        if (col != width - 1 && shuffledArray[i + 1] == 'bomb') bombs_around++;
        if (row != 0 && shuffledArray[i - width] == 'bomb') bombs_around++;
        if (row != width - 1 && shuffledArray[i + width] == 'bomb') bombs_around++;
        if (col != 0 && row != 0 && shuffledArray[i -(width+1)] == 'bomb') bombs_around++;
        if (row != 0 && col != width - 1 && shuffledArray[i - (width-1)] == 'bomb') bombs_around++;
        if (row != width - 1 && col != width - 1 && shuffledArray[i + (width+1)] == 'bomb') bombs_around++;
        if (row != width - 1 && col != 0 && shuffledArray[i + (width-1)] == 'bomb') bombs_around++;

        squares[i].setAttribute('data', bombs_around);

    }


}

function main() {
    createBoard();
}