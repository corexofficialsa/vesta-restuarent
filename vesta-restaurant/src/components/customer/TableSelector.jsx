export default function TableSelector({ onStaffClick }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-purple-50/30 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-xl shadow-purple-200">
            <span className="text-white font-bold text-3xl">V</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Welcome to Vesta
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Please scan the QR code on your table<br />to begin your dining experience.
        </p>
      </div>

      {/* Staff access — subtle gear at bottom-left */}
      <button
        onClick={onStaffClick}
        aria-label="Staff access"
        className="absolute bottom-5 left-5 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-300 select-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}
