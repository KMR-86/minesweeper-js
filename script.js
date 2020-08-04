if (document.readyState !== 'loading') {
    console.log('document is already ready, just execute code here');

    var width = 10;
    var bombAmount = 20

    main();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        main();
    });
}



function createBoard() {
    


    const bombsArray = Array(bombAmount).fill('bomb')
    const emptyArray = Array(width*width - bombAmount).fill('valid')
    const gameArray = emptyArray.concat(bombsArray)
    const shuffledArray = gameArray.sort(() => Math.random() -0.5)
    console.log(shuffledArray)


    grid = document.querySelector(".grid");
    
    for (let i = 0; i < width*width; i++) {
        const square = document.createElement('div')
        square.setAttribute('id', i)
        grid.appendChild(square)

        // if(shuffledArray[i]=="bomb"){
        //     square.style.background="red";
        // }
        
        //normal click
        square.addEventListener('click', function (e) {

            square.style.background="#d2d6d6";


        })
        


    }
}

function main() {
    createBoard();
}