import React from 'react';
import './card.css';

interface CardProps {
	item: {
		value: number;
		matched: boolean;
	};
	handleSelectedCards: (item: any) => void;
	toggled: boolean;
	stopflip?: boolean;
}

const Card: React.FC<CardProps> = ({
	item,
	handleSelectedCards,
	toggled,
	stopflip = false,
}) => {
	return (
		<div className='item'>
			<div className={toggled ? 'toggled' : 'item'}>
				<div className='face'>
					{toggled && <div className='number'>{item.value}</div>}
				</div>
				<div
					className='back'
					onClick={() => !stopflip && handleSelectedCards(item)}
				/>
			</div>
		</div>
	);
};

export default Card;
