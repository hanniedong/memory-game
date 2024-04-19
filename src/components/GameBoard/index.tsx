import React, { useEffect, useState, useCallback } from 'react';
import Card from '../Card';
import './GameBoard.css';

interface Card {
	id: number;
	value: number;
	matched: boolean;
}

const PLAYER = 'player';
const COMPUTER = 'computer';

const GameBoard: React.FC = () => {
	const [cardsArray, setCardsArray] = useState<Card[]>([]);
	const [firstCard, setFirstCard] = useState<Card | null>(null);
	const [numCards, setNumCards] = useState<number>(8);
	const [secondCard, setSecondCard] = useState<Card | null>(null);
	const [stopFlip, setStopFlip] = useState<boolean>(false);
	const [currentPlayer, setCurrentPlayer] = useState<'player' | 'computer'>(
		PLAYER
	);
	const [playerPairs, setPlayerPairs] = useState<number>(0);
	const [computerPairs, setComputerPairs] = useState<number>(0);
	const [winner, setWinner] = useState<'player' | 'computer' | 'draw' | null>(
		null
	);

	const startNewGame = useCallback(() => {
		const initialCards: Card[] = [];
		for (let i = 1; i <= numCards / 2; i++) {
			initialCards.push(
				{ id: initialCards.length, value: i, matched: false },
				{ id: initialCards.length + 1, value: i, matched: false }
			);
		}
		setCardsArray(shuffleCards(initialCards));
		setFirstCard(null);
		setSecondCard(null);
		setCurrentPlayer(PLAYER);
		setPlayerPairs(0);
		setComputerPairs(0);
	}, [numCards]);

	useEffect(() => {
		startNewGame()
	},[])

	const shuffleCards = (cards: Card[]): Card[] => {
		for (let i = cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cards[i], cards[j]] = [cards[j], cards[i]];
		}
		return cards;
	};

	const handleSelectedCards = useCallback(
		(item: Card) => {
			if (firstCard !== null && firstCard.id !== item.id) {
				setSecondCard(item);
			} else {
				setFirstCard(item);
			}
		},
		[firstCard]
	);

	useEffect(() => {
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
				currentPlayer === PLAYER
					? setPlayerPairs((prev) => prev + 1)
					: setComputerPairs((prev) => prev + 1);
				removeSelection();
			} else {
				setTimeout(() => {
					removeSelection();
				}, 1000);
			}
		}
	}, [firstCard, secondCard, currentPlayer]);

	const pickRandomIndices = useCallback((collection: number[]) => {
		const indices = new Set<number>();
		while (indices.size < 2) {
			indices.add(Math.floor(Math.random() * collection.length));
		}
		return Array.from(indices);
	}, []);

	useEffect(() => {
		if (currentPlayer === COMPUTER) {
			const unmatchedCards = cardsArray.filter((card) => !card.matched);
			const unmatchedCardsIndices = unmatchedCards.map((card) => card.id);
			const selectedIndices: number[] = pickRandomIndices(
				unmatchedCardsIndices
			);
			setTimeout(() => {
				setFirstCard(unmatchedCards[selectedIndices[0]]);
			}, 1000);
			setTimeout(() => {
				setSecondCard(unmatchedCards[selectedIndices[1]]);
			}, 1000);
		}
	}, [currentPlayer]);

	const removeSelection = useCallback(() => {
		setFirstCard(null);
		setSecondCard(null);
		setStopFlip(false);
		setTimeout(() => {
			setCurrentPlayer((player) => (player === PLAYER ? COMPUTER : PLAYER));
		}, 1000);
	}, []);

	useEffect(() => {
		if ((playerPairs + computerPairs) * 2 === cardsArray.length) {
			if (playerPairs > computerPairs) {
				setWinner(PLAYER);
			} else if (playerPairs < computerPairs) {
				setWinner(COMPUTER);
			} else {
				setWinner('draw');
			}
		}
	}, [playerPairs, computerPairs, cardsArray.length]);

	const generateText = useCallback(() => {
		let text;
		switch (winner) {
			case PLAYER:
				text = 'You Won!';
				break;
			case COMPUTER:
				text = 'Computer Won!';
				break;
			case 'draw':
				text = 'It is a draw!';
				break;
			default:
				text = '';
		}
		return text;
	}, [winner]);

	return (
		<div className='container'>
			<div className='board'>
				{cardsArray.map((item, index) => (
					<Card
						key={index}
						item={item}
						handleSelectedCards={handleSelectedCards}
						toggled={
							item === firstCard || item === secondCard || item.matched === true
						}
						stopflip={stopFlip}
					/>
				))}
			</div>
			<div className='comments'>
				<p className='text'>{currentPlayer === PLAYER ? 'Your turn!' : "Computer's turn!"}</p>
			</div>
			<div className='comments'>
				<p>Player Pairs: {playerPairs}</p>
				<p>Computer Pairs: {computerPairs}</p>
			</div>
			{(playerPairs + computerPairs) * 2 === cardsArray.length && (
				<div className='comments'>
					<p className='text'>{generateText()}</p>
				</div>
			)}
			<div className='text-center'>
				<label className='text' htmlFor='num-cards'>Number of Cards:</label>
				<input
					className='input'
					type='number'
					value={numCards}
					onChange={(e) => setNumCards(Number(e.target.value))}
					min={2}
					max={16}
				/>
				<button className='button' onClick={startNewGame}>
					New Game
				</button>
			</div>
		</div>
	);
};

export default GameBoard;
