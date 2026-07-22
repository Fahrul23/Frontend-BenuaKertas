import { cn } from '@/utils';

/**
 * Skeleton pulse animation for a single card — matches the OptionCard aspect ratio.
 * Use `variant="model"` for the larger square model cards (Step 1).
 * Use `variant="option"` (default) for the portrait 3/4 option cards (Step 3, 5).
 */
const SkeletonCard = ({ variant = 'option', className }) => {
  if (variant === 'model') {
    return (
      <div className={cn('rounded-xl overflow-hidden', className)}>
        {/* Card shell */}
        <div className="relative bg-white rounded-xl shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_4px_4px_rgba(0,0,0,0.25)] p-6 animate-pulse">
          {/* Image placeholder */}
          <div className="h-32 bg-gray-200 rounded-lg mb-4" />
          {/* Label placeholder */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
        </div>
      </div>
    );
  }

  // variant === 'option' — portrait 3/4 card used in MaterialStep & FinishingStep
  return (
    <div className={cn('relative w-full aspect-[3/4] max-w-[120px] md:max-w-[150px] lg:max-w-[180px] animate-pulse', className)}>
      <div className="absolute inset-0 bg-white rounded-lg shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_4px_4px_rgba(0,0,0,0.25)]">
        {/* Image area */}
        <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-gray-200 rounded" />
        {/* Label area */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-3 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

/**
 * Skeleton for a square material card (used in MaterialStep).
 */
export const SkeletonMaterialCard = ({ className }) => (
  <div className={cn('w-[140px] md:w-[180px] lg:w-[200px] flex-shrink-0 animate-pulse', className)}>
    <div className="relative w-full aspect-square bg-white rounded-lg shadow-[0px_0px_2px_rgba(0,0,0,0.10),0px_4px_4px_rgba(0,0,0,0.25)]">
      {/* Image area */}
      <div className="absolute inset-2 md:inset-3 bottom-10 md:bottom-12 bg-gray-200 rounded" />
      {/* Label area */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  </div>
);

/**
 * Skeleton for GSM radio-button pills (used in MaterialStep thickness section).
 */
export const SkeletonRadioButton = ({ className }) => (
  <div className={cn('h-10 w-24 bg-gray-200 rounded-full animate-pulse', className)} />
);

export default SkeletonCard;
