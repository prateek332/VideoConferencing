import { useState } from "react";

interface Props {
  numberOfStars: number;
}

export default function StarRating(props: Props) {
  
  const {
    numberOfStars,
  } = props;

  const [stars, setStars] = useState<number[]>([]);

  if (stars.length == 0)
    numberOfStars > 0 ? fillStarsArray(setStars, numberOfStars) : setStars([1, 2, 3, 4, 5]);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState('⭐');
  const [deselectedIcon, setDeselectedIcon] = useState('⚝');

  const changeRating = (newRating: any) => {
    setRating(newRating);
  }

  const hoverRating = (rating: any) => {
    setHovered(rating);
  }

  return (
    <div>
      {
        stars.map(star => {
          return (
            <span
              key={star}
              style={{ cursor: 'pointer' }}
              onClick={() => changeRating(star)}
              onMouseEnter={() => hoverRating(star)}
              onMouseLeave={() => hoverRating(0)}
            >
              {
                rating < star ?
                  hovered < star ? deselectedIcon : selectedIcon
                  :
                  selectedIcon
              }
            </span>
          )
        })
      }
    </div>
  )
}

function fillStarsArray(setStars: any, numberOfStars: number) {
  const tempStarsArray: number[] = [];
  Array.from({ length: numberOfStars }, (v, i) => i).forEach(starIndex => {
    tempStarsArray.push(starIndex);
  });
  setStars(tempStarsArray);
}