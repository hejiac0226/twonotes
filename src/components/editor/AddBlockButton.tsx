import { BsPlusCircle } from 'react-icons/bs';

interface AddBlockButtonProps {
    onClick: () => void;
}

export default function AddBlockButton({ onClick }: AddBlockButtonProps) {
    return (
        <div className="h-4 group relative">
            <button
                onClick={onClick}
                className="absolute -left-10 top-1/2 -translate-y-1/2
                           opacity-0 group-hover:opacity-100 transition-opacity
                           p-1 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
                <BsPlusCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
        </div>
    );
} 