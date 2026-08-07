interface LogoProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

function Logo({
  size = 176,
  className = "",
  strokeWidth = 2.5,
}: LogoProps) {
  return (
    <div
      className={` relative flex shrink-0 select-none   items-center   justify-center  transition-transform  duration-300  hover:scale-105
        ${className}
      `}
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 100 115"
        className="absolute inset-0 h-full w-full text-primary"
        fill="none"
      >
        <path
          d="M50 2 L96 28.5 L96 81.5 L50 108 L4 81.5 L4 28.5 Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="relative flex flex-col items-center justify-center font-extrabold uppercase leading-none tracking-wider"
        style={{
          fontSize: size * 0.13,
        }}
      >
        <span className="text-foreground">
          ST<span className="text-primary">O</span>P
        </span>

        <span className="text-primary">CELL</span>
      </div>
    </div>
  );
}

export default Logo;