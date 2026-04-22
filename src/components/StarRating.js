import { HiStar } from "react-icons/hi";

export default function StarRating({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <HiStar
          key={star}
          size={size}
          className={
            star <= Math.round(rating) ? "star-filled" : "star-empty"
          }
        />
      ))}
      <span className="ml-1.5 text-white/40 text-xs">({rating?.toFixed(1)})</span>
    </div>
  );
}
