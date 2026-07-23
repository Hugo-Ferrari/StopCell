interface LogoProps {
    size?: number
    className?: string
}

function Logo({ size = 176, className = '' }: LogoProps) {
    return (
        <div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 115"
                className="absolute inset-0 h-full w-full text-orange-500"
                fill="none"
            >
                <path
                    d="M50 2 L96 28.5 L96 81.5 L50 108 L4 81.5 L4 28.5 Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                />
            </svg>
            <span className="relative text-2xl font-extrabold uppercase leading-tight tracking-wide">
                <span className="block text-white">
                    ST<span className="text-orange-500">O</span>P
                </span>
                <span className="block text-orange-500">CELL</span>
            </span>
        </div>
    )
}

export default Logo