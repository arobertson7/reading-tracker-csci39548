interface DarkModeToggleButtonProps {
  isDarkMode: boolean;
  onToggle: (isDarkMode: boolean) => void;
}

function DarkModeToggleButton({ isDarkMode, onToggle }: DarkModeToggleButtonProps) {

  return (
    <button
      onClick={() => onToggle(!isDarkMode)}
      className="fixed top-4 right-4 md:top-6 md:right-8 z-50 p-2.5 rounded-full bg-[#ffffff]/90 dark:bg-[#1a1816]/90 border border-[#e8e2d9] dark:border-[#2e2822] shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#fef3c7] dark:focus:ring-[#451a03] flex items-center justify-center"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <svg className="w-5 h-5 text-[#f59e0b] transition-transform duration-500 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-[#b45309] transition-transform duration-500 hover:-rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )

}

export default DarkModeToggleButton;