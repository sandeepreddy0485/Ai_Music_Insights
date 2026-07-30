import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, onRatingChange = null, size = 'md', readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFilled = rating >= star;
        const isHalf = rating >= star - 0.5 && rating < star;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onRatingChange && onRatingChange(star)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-slate-800 text-slate-600'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
