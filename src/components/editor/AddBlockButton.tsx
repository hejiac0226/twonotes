interface AddBlockButtonProps {
    onClick: () => void;
}

export default function AddBlockButton({ onClick }: AddBlockButtonProps) {
    return (
        <div className="h-4 flex items-center ml-12 relative" style={{ top: '9px' }}>
            <button
                onClick={onClick}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>
        </div>
    );
} 