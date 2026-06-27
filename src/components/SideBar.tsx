interface SideBarProps {
  displayMode: string;
  onClickDisplayMode: (displayMode: string) => void;
}

function SideBar({ displayMode, onClickDisplayMode }: SideBarProps) {

  return (
    <aside className="bg-[#ffffff] dark:bg-[#1a1816] border-b border-[#e8e2d9] dark:border-[#2e2822] p-6 md:py-10 md:px-7 flex flex-col gap-6 md:gap-10 z-10 md:w-[280px] md:h-full md:border-b-0 md:border-r md:shrink-0">
      <header>
        <h1 className="font-['Lora',_Georgia,_serif] text-[1.8rem] md:text-[2.2rem] font-bold text-[#b45309] dark:text-[#f59e0b] mb-2 tracking-[-0.02em]">
          Reading Tracker
        </h1>
        <p className="text-[0.85rem] text-[#786d63] dark:text-[#b0a59a] leading-[1.4]">
          A book a day keeps the... Wait. <br />A book a day? That's like a lot of reading.
        </p>
      </header>

      <nav className="flex gap-3 mt-2 md:flex-col md:gap-2 md:mt-4 md:grow">
        <button
          className={`flex items-center gap-2 py-[0.6rem] px-4 md:py-3 md:px-4 rounded-lg bg-transparent border border-transparent text-[#786d63] dark:text-[#b0a59a] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] md:w-full ${displayMode === "userLibrary" ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border-[#e8e2d9] dark:border-[#2e2822]" : ""
            }`}
          onClick={() => onClickDisplayMode("userLibrary")}
        >
          <span className="text-[1.1rem]">📚</span> My Library
        </button>
        <button
          className={`flex items-center gap-2 py-[0.6rem] px-4 md:py-3 md:px-4 rounded-lg bg-transparent border border-transparent text-[#786d63] dark:text-[#b0a59a] text-[0.9rem] font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] md:w-full ${displayMode === "searchBooks" ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border-[#e8e2d9] dark:border-[#2e2822]" : ""
            }`}
          onClick={() => onClickDisplayMode("searchBooks")}
        >
          <span className="text-[1.1rem]">🔍</span> Search Books
        </button>
      </nav>

      <footer className="hidden md:block md:mt-auto md:text-[0.75rem] md:text-[#a39b92] dark:text-[#85796d] md:leading-[1.5] md:border-t md:border-[#e8e2d9] dark:border-[#2e2822] pt-5">
        <p>&copy;2026 Austin Robertson <br /> Brooklyn, NY</p>
      </footer>
    </aside>
  )
}

export default SideBar;