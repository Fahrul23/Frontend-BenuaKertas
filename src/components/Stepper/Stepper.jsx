import React from 'react';
import { cn } from "@/utils";

const defaultSteps = [
  { id: 1, label: 'Model\nProduk' },
  { id: 2, label: 'Ukuran' },
  { id: 3, label: 'Bahan' },
  { id: 4, label: 'Warna\nKemasan' },
  { id: 5, label: 'Finishing\nLaminasi' },
  { id: 'ellipsis', label: '', isEllipsis: true },
  { id: 8, label: '' },
];

const Stepper = ({ steps = defaultSteps, currentStep = 1, className }) => {
  return (
    <div className={cn(
      "w-full rounded-[5px] border-2 border-color-secondary bg-white px-4 md:px-8 py-4 relative",
      className
    )}>
      <div className="flex items-start justify-between w-full relative">
        {steps.map((step, index) => {
          const stepNumber = typeof step.id === 'number' ? step.id : index + 1;
          const isActive = stepNumber <= currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex flex-col items-center relative flex-1">
              {/* Connecting Line - Left Side */}
              {!isFirst && (
                <div className={cn(
                  "absolute top-[14px] md:top-[17px] right-1/2 w-full h-[1.5px] bg-color-secondary z-0 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-30"
                )} />
              )}
              
              {/* Connecting Line - Right Side */}
              {!isLast && (
                <div className={cn(
                  "absolute top-[14px] md:top-[17px] left-1/2 w-full h-[1.5px] bg-color-secondary z-0 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-30"
                )} />
              )}

              {/* Outer Circle with white background to cover the line */}
              <div className={cn(
                "w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full border flex items-center justify-center flex-shrink-0 relative z-20 bg-white transition-all duration-500",
                "border-color-secondary",
                isCurrent && "scale-110 shadow-md"
              )}>
                {/* Inner Circle */}
                <div className={cn(
                  "w-[22px] h-[22px] md:w-[26px] md:h-[26px] rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500",
                  step.isEllipsis
                    ? "bg-[#E3ECDA] text-color-secondary"
                    : (isActive ? "bg-color-secondary text-white scale-100" : "bg-white text-color-secondary scale-90")
                )}>
                  {step.isEllipsis ? (
                    <div className="flex gap-[2px]">
                      <div className="w-[3px] h-[3px] rounded-full bg-color-secondary" />
                      <div className="w-[3px] h-[3px] rounded-full bg-color-secondary" />
                      <div className="w-[3px] h-[3px] rounded-full bg-color-secondary" />
                    </div>
                  ) : step.id}
                </div>
              </div>

              {/* Step Label */}
              {step.label && (
                <span className={cn(
                  "mt-2 text-[9px] md:text-[10px] font-medium text-center leading-[1.2] w-full max-w-[50px] md:max-w-[70px] whitespace-pre-line transition-all duration-500",
                  isActive ? "text-color-secondary opacity-100" : "text-color-secondary opacity-50"
                )}>
                  {step.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
