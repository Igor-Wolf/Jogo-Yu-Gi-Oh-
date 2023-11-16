

const state=   {

    score:{

        playerScore:0,
        computerScore:0,
        scorebox:document.getElementById("score_points"),

    },

    cardSprites:{

        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),

    },

    fieldCards:{

        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
        
    },

    playersSides: {

        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    
    },

    actions:{

        button: document.getElementById("next-duel"),
    }

}

const pathImages = "./src/assets/icons/"
const cardData =[{

    id: 0,
    name: "Blue Eyes White Dragon",
    type:"Paper",
    img:`${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],

},

{

    id: 1,
    name: "Dark Magician",
    type:"Rock",
    img:`${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],

},

{

    id: 2,
    name: "Exodia",
    type:"Scissors",
    img:`${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],

},

]

async function creatCardImage(IdCard, fieldSide){

    const cardImage= document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",IdCard);
    cardImage.classList.add("card");

    if (fieldSide===state.playersSides.player1){

        cardImage.addEventListener("click", ()=>{setCardField(cardImage.getAttribute("data-id"));});
        cardImage.addEventListener("mouseover", ()=>{drawSelectCards(IdCard)});
    
    }

    return cardImage;
}

async function getRandomCardId(){

    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function setCardField(cardId){

    await removeAllCardsImages();
    let computerCardId= await getRandomCardId();

    await ShowHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId,computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function checkDuelResults(playerCardId, computerCardId){

    let duelResults= "Empate"
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){

        duelResults= "Ganhou";
        state.score.playerScore++;
        playAudio("win")
    }

    if(playerCard.LoseOf.includes(computerCardId)){

        duelResults = "Perdeu";
        state.score.computerScore++;
        playAudio("lose")

    }

    return duelResults;

}

async function drawCardsInField(cardId, computerCardId){

    state.fieldCards.player.src= cardData[cardId].img;
    state.fieldCards.computer.src= cardData[computerCardId].img;

}

async function ShowHiddenCardFieldsImages(value){

    if (value==true){

        state.fieldCards.player.style.display="block";
        state.fieldCards.computer.style.display="block";

    }
    if (value==false){

        state.fieldCards.player.style.display="none"
        state.fieldCards.player.style.display="none"

    }

}

async function hiddenCardDetails(){

    state.cardSprites.name.innerText= ""
    state.cardSprites.type.innerText = ""
    state.cardSprites.avatar.innerText= ""

}

async function drawButton(text){

    state.actions.button.innerText = text
    state.actions.button.style.display = "block";

}

async function updateScore(){

    state.score.scorebox.innerText= `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}` 
    
}

async function removeAllCardsImages(){

    let {computerBOX, player1BOX} = state.playersSides;
    let imgElements= computerBOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());

    imgElements= player1BOX.querySelectorAll("img");
    imgElements.forEach((img)=> img.remove());
}

async function drawSelectCards(index){

    state.cardSprites.avatar.src= cardData[index].img;
    state.cardSprites.name.innerText= cardData[index].name;
    state.cardSprites.type.innerText= "Atribute :" + cardData[index].type;

}

async function drawCards(cardNumbers, fieldSide){

    for(let i=0; i<cardNumbers; i++){

        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide)
        console.log(cardImage)
        document.getElementById(fieldSide).appendChild(cardImage)

    }

}

async function resetDuel(){

    state.cardSprites.avatar.src= "";
    state.actions.button.style.display= "none"

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display="none"

    init();
}

async function playAudio(status){

    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();


}

function init(){

    ShowHiddenCardFieldsImages(false);

    drawCards(5,state.playersSides.player1);
    drawCards(5,state.playersSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();