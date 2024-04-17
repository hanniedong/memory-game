import React, { useEffect } from "react"; 
import Card from "./Card";

interface Card {
  id: number;
  value: number;
  matched: boolean;
}

function GameBoard(): JSX.Element {
  const [cardsArray, setCardsArray] = React.useState<Card[]>([]);  
  const [moves, setMoves] = React.useState<number>(0); 
  const [firstCard, setFirstCard] = React.useState<Card | null>(null); 
  const [secondCard, setSecondCard] = React.useState<Card | null>(null); 
  const [stopFlip, setStopFlip] = React.useState<boolean>(false);  
  const [won, setWon] = React.useState<number>(0); 

  //this function start new Game 
  function NewGame(): void { 
    setTimeout(() => { 
      const initialCards = [];
      for (let i = 1; i <= 2; i++) {
        initialCards.push({ id: initialCards.length + 1, value: i, matched: false}, {id: initialCards.length + 2, value: i, matched: false});
      }
      setCardsArray(shuffleCards(initialCards));
      setMoves(0); 
      setFirstCard(null); 
      setSecondCard(null); 
      setWon(0); 
    }, 1200); 
  } 

  console.log(cardsArray)

  const shuffleCards = (cards: Card[]): Card[] => {
    // Shuffle the cards using Fisher-Yates algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  };

  //this function helps in storing the firstCard and secondCard value 
  function handleSelectedCards(item: Card): void { 
    if (firstCard !== null && firstCard.id !== item.id) { 
      setSecondCard(item); 
    } else { 
      setFirstCard(item); 
    } 
  } 

  // if two have been selected then we check if the cards are same or not, 
  //if they are same then we stop the flipping ability 
  // else we turn them back 
  useEffect(() => { 
    console.log("first", firstCard, "second", secondCard)
    if (firstCard && secondCard) { 
      setStopFlip(true); 
      if (firstCard.value === secondCard.value) { 
        setCardsArray((prevArray) => { 
          return prevArray.map((unit) => { 
            if (unit.value === firstCard.value) { 
              return { ...unit, matched: true }; 
            } else { 
              return unit; 
            } 
          }); 
        }); 
        setWon((preVal) => preVal + 1); 
        removeSelection(); 
      } else { 
        setTimeout(() => { 
          removeSelection(); 
        }, 1000); 
      } 
    } 
  }, [firstCard, secondCard]); 

  
  //after the selected images have been checked for  
  //equivalency we empty the firstCard and secondCard component 
  function removeSelection(): void { 
    setFirstCard(null); 
    setSecondCard(null); 
    setStopFlip(false); 
    setMoves((prevValue) => prevValue + 1); 
  } 

  //starts the game for the first time. 
  useEffect(() => { 
    NewGame(); 
  }, []); 

  return ( 
    <div className="container mx-auto p-4">
      <div className="header text-center mb-4"> 
        <h1 className="text-3xl font-bold">Memory Game</h1> 
      </div> 
      <div className="board grid grid-cols-4 gap-4"> 
        { 
          cardsArray.map((item, index) => ( 
            <Card 
              item={item} 
              key={index} 
              handleSelectedCards={handleSelectedCards} 
              toggled={ 
                item === firstCard || 
                item === secondCard || 
                item.matched === true
              } 
              stopflip={stopFlip} 
            /> 
          )) 
        } 
      </div> 

      {won < cardsArray.length / 2 ? ( 
        <div className="comments text-center mt-4">Moves : {moves}</div> 
      ) : ( 
        <div className="comments text-center mt-4"> 
          <p>You Won in {moves} moves!</p> 
        </div> 
      )} 
      <button className="button bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block" onClick={NewGame}> 
        New Game 
      </button> 
    </div> 
  ); 
} 

export default GameBoard;