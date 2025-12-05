
export default function ActionButton({ icon, color, onClick }: { icon: React.ReactNode; color: 'blue' | 'red'; onClick: () => void }) {
  const colors = {
    blue: 'text-gray-400 hover:text-blue-600 hover:bg-blue-50',
    red: 'text-gray-400 hover:text-red-600 hover:bg-red-50',
  }[color];

  return (
    <button 
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${colors}`}
    >
      {icon}
    </button>
  );
};
