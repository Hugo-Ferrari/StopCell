interface LogoProps {
    size?: number
    className?: string
}

function Logo({ size = 176, className = '' }: LogoProps) {
    return (
        <div
            className={`relative flex items-center justify-center transition-colors ${className}`}
            style={{ width: size, height: size }}
        >
            <svg
                viewBox="0 0 100 115"
                className="absolute inset-0 h-full w-full text-primary"
                fill="none"
            >
                <path
                    d="M50 2 L96 28.5 L96 81.5 L50 108 L4 81.5 L4 28.5 Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                />
            </svg>

            <span className="relative text-2xl font-extrabold uppercase leading-tight tracking-wide">
                <span className="block text-foreground">
                    ST<span className="text-primary">O</span>P
                </span>

                <span className="block text-primary">
                    CELL
                </span>
            </span>
        </div>
    )
}

export default Logo;