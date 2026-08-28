export interface HashLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HashLoader({ size = "md", className = "" }: HashLoaderProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#ff6600]"
      >
        {/* Horizontal Top Line */}
        <line
          x1="6"
          y1="14"
          x2="34"
          y2="14"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-hash-h-top origin-center"
        />
        {/* Horizontal Bottom Line */}
        <line
          x1="6"
          y1="26"
          x2="34"
          y2="26"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-hash-h-bottom origin-center"
        />
        {/* Vertical Left Line */}
        <line
          x1="16"
          y1="6"
          x2="14"
          y2="34"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-hash-v-left origin-center"
        />
        {/* Vertical Right Line */}
        <line
          x1="26"
          y1="6"
          x2="24"
          y2="34"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="animate-hash-v-right origin-center"
        />
      </svg>
    </div>
  );
}

export default HashLoader;
