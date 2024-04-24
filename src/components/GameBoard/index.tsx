import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Card from '../Card';
import './GameBoard.css';
import { Player, Winner } from '@/enums';

interface Card {
	id: number;
	value: number;
	matched: boolean;
}

const GameBoard: React.FC = () => {
	const [numCards, setNumCards] = useState<number>(4);

	const shuffledCardsArray = useMemo(() => {
		const initialCards: Card[] = [];
		for (let i = 1; i <= numCards / 2; i++) {
			initialCards.push(
				{ id: initialCards.length, value: i, matched: false },
				{ id: initialCards.length + 1, value: i, matched: false }
			);
		}

		for (let i = initialCards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
		}
		return initialCards;
	}, [numCards]);

	const [cardsArray, setCardsArray] = useState<Card[]>(shuffledCardsArray);
	const [firstCard, setFirstCard] = useState<Card | null>(null);
	const [secondCard, setSecondCard] = useState<Card | null>(null);
	const [stopFlip, setStopFlip] = useState<boolean>(false);
	const [currentPlayer, setCurrentPlayer] = useState<
		Player.COMPUTER | Player.PLAYER
	>(Player.PLAYER);
	const [playerPairs, setPlayerPairs] = useState<number>(0);
	const [computerPairs, setComputerPairs] = useState<number>(0);
	const [winner, setWinner] = useState<
		Winner.YOU | Winner.COMPUTER | Winner.DRAW | null
	>(null);

	const startNewGame = useCallback(() => {
		setFirstCard(null);
		setSecondCard(null);
		setCurrentPlayer(Player.PLAYER);
		setPlayerPairs(0);
		setComputerPairs(0);
		setCardsArray(shuffledCardsArray);
	}, [shuffledCardsArray]);

	const resetCards = useCallback(() => {
		setFirstCard(null);
		setSecondCard(null);
		setStopFlip(false);
	}, []);

	const determineWinner = useCallback(() => {
		if (playerPairs > computerPairs) {
			setWinner(Winner.YOU);
		} else if (playerPairs < computerPairs) {
			setWinner(Winner.COMPUTER);
		} else {
			setWinner(Winner.DRAW);
		}
	}, [playerPairs, computerPairs]);

	const updatePairs = useCallback(() => {
		currentPlayer === Player.PLAYER
			? setPlayerPairs((prev) => prev + 1)
			: setComputerPairs((prev) => prev + 1);

		if ((playerPairs + computerPairs + 1) * 2 === cardsArray.length) {
			determineWinner();
		}
	}, [
		cardsArray.length,
		computerPairs,
		currentPlayer,
		determineWinner,
		playerPairs,
	]);

	const handleCardComparison = useCallback(
		(
			firstCard: { value: number | undefined },
			item: { value: number | undefined }
		) => {
			setStopFlip(true);
			if (firstCard?.value === item.value) {
				setCardsArray((prevArray) => {
					return prevArray.map((unit) => {
						if (unit.value === firstCard?.value) {
							return { ...unit, matched: true };
						} else {
							return unit;
						}
					});
				});
				updatePairs();
				resetCards();
			}
		},
		[updatePairs, resetCards]
	);

	const handleSelectedCards = useCallback(
		(item: Card) => {
			setFirstCard((prevFirstCard) => {
				if (prevFirstCard !== null) {
					handleCardComparison(prevFirstCard, item);
					setSecondCard(item);
					return prevFirstCard;
				} else {
					return item;
				}
			});
		},
		[handleCardComparison]
	);

	useEffect(() => {
		if (firstCard && secondCard && firstCard.value !== secondCard.value) {
			const timeoutId = setTimeout(() => {
				resetCards();
				setCurrentPlayer((player) =>
					player === Player.PLAYER ? Player.COMPUTER : Player.PLAYER
				);
			}, 2000);
			return () => clearTimeout(timeoutId);
		}
	}, [firstCard, resetCards, secondCard]);

	const pickCardsForComputer = useCallback(() => {
		if (currentPlayer === Player.COMPUTER) {
			const unmatchedCards = cardsArray.filter((card) => !card.matched);
			const unmatchedCardsIndices = unmatchedCards.map((card) => card.id);
			const indices = new Set<number>();
			while (indices.size < 2) {
				indices.add(Math.floor(Math.random() * unmatchedCardsIndices.length));
			}
			const selectedIndices = Array.from(indices);
			return [
				unmatchedCards[selectedIndices[0]],
				unmatchedCards[selectedIndices[1]],
			];
		}
	}, [cardsArray, currentPlayer]);

	useEffect(() => {
		if ((playerPairs + computerPairs) * 2 === cardsArray.length) {
			return; // If all pairs have been matched, stop the game
		}

		const cards = pickCardsForComputer();

		if (cards) {
			const [firstUnmatchedCard, secondUnmatchedCard] = cards;
			const firstCardTimeoutId = setTimeout(() => {
				handleSelectedCards(firstUnmatchedCard);
			}, 1000);

			const secondCardTimeoutId = setTimeout(() => {
				handleSelectedCards(secondUnmatchedCard);
			}, 1000);
			return () => {
				clearTimeout(firstCardTimeoutId);
				clearTimeout(secondCardTimeoutId);
			};
		}
	}, [
		cardsArray.length,
		computerPairs,
		handleSelectedCards,
		pickCardsForComputer,
		playerPairs,
	]);

	const handleNumberOfCardsChange = useCallback(
		(e: { target: { value: string } }) => {
			const value = e.target.value;
			setNumCards(value === '' ? 0 : Number(value));
		},
		[]
	);

	return (
		<div className='container'>
			<div className='board'>
				{cardsArray.map((item) => (
					<div key={item.id}>
						<Card
							disabled={currentPlayer === Player.COMPUTER}
							key={item.id}
							item={item}
							handleSelectedCards={handleSelectedCards}
							toggled={
								item === firstCard ||
								item === secondCard ||
								item.matched === true
							}
							stopFlip={stopFlip}
						/>
					</div>
				))}
			</div>
			<div className='comments'>
				{!winner && (
					<p className='text'>
						{currentPlayer === Player.PLAYER
							? 'Your turn!'
							: "Computer's turn!"}
					</p>
				)}
				{(playerPairs + computerPairs) * 2 === cardsArray.length &&
					winner !== Winner.DRAW && (
						<div className='comments'>
							<p className='text'>{winner} won!</p>
						</div>
					)}

				{(playerPairs + computerPairs) * 2 === cardsArray.length &&
					winner === Winner.DRAW && (
						<div className='comments'>
							<p className='text'>Draw!</p>
						</div>
					)}
			</div>
			<div className='comments'>
				<p>Player Pairs: {playerPairs}</p>
				<p>Computer Pairs: {computerPairs}</p>
			</div>
			<div className='text-center'>
				<label className='text' htmlFor='num-cards'>
					Number of Cards:
				</label>
				<input
					className='input'
					type='number'
					value={numCards === 0 ? '' : numCards}
					onChange={handleNumberOfCardsChange}
					min={2}
					max={16}
				/>
				<div className='text-red-500'>
					{numCards % 2 !== 0 && (
						<span>Please select an even number of cards.</span>
					)}
				</div>
				<button
					className={`button ${
						numCards % 2 !== 0 || numCards === 0 ? 'disabled' : ''
					}`}
					onClick={startNewGame}
					disabled={numCards % 2 !== 0 || numCards === 0}
				>
					New Game
				</button>
			</div>
		</div>
	);
};
export default GameBoard;
