import React, { useCallback } from 'react';
import './card.css';

interface CardProps {
	item: {
		value: number;
		matched: boolean;
	};
	handleSelectedCards: (item: any) => void;
	toggled: boolean;
	stopFlip?: boolean;
	disabled: boolean;
}

const Card: React.FC<CardProps> = React.memo(({
	item,
	handleSelectedCards,
	toggled,
	stopFlip = false,
	disabled,
}) => {

	const handleOnClick = useCallback(()=> {
	 (!disabled && !stopFlip) && handleSelectedCards(item)
	},[disabled, handleSelectedCards, item, stopFlip])

	return (
		<div className='item'>
			<div className={toggled ? 'toggled' : 'item'}>
				<div className='face'>
					{toggled && <div className='number'>{item.value}</div>}
				</div>
				<div
					className='back'
					onClick={handleOnClick}
				/>
			</div>
		</div>
	);
});

Card.displayName = 'Card';

export default Card;
