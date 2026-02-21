"use client";

interface ProgressCircleProps {
  progress: number; // 0-100
  totalTasks?: number; // 0 = no tasks, show empty circle
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressCircle({
  progress,
  totalTasks = 0,
  size = 32,
  strokeWidth = 2.8,
  className = "",
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // No tasks = empty brown outline only
  const isEmpty = totalTasks === 0;
  // All tasks done = green full circle
  const isComplete = !isEmpty && progress >= 100;
  // Has tasks but not all done = brown (full or proportional)
  const strokeColor = isComplete ? "#2E7D32" : "#6D4C41";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background: empty brown outline (always visible) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#6D4C41"
        strokeWidth={strokeWidth}
        opacity={isEmpty ? 0.5 : 0.3}
      />
      {/* Progress fill: green when done, brown when partial */}
      {!isEmpty && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isComplete ? 0 : strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      )}
    </svg>
  );
}
