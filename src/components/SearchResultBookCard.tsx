import { type Book } from '../types.ts';

interface SearchResultBookCardProps {
  book: Book;
  onToggleAddToLibrary: (book: Book) => void;
  addedToLibrary: boolean;
}

function SearchResultBookCard({ book, onToggleAddToLibrary, addedToLibrary }: SearchResultBookCardProps) {

  return (
    <div className="group bg-[#ffffff] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#3d352e] rounded-xl overflow-hidden flex flex-col shadow-[0_2px_6px_rgba(43,37,32,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer relative h-full min-h-[325px] hover:-translate-y-[5px] hover:shadow-[0_12px_24px_rgba(43,37,32,0.1)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:border-[#b45309] dark:hover:border-[#f59e0b]">
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#fcfaf7] dark:bg-[#121110] flex items-center justify-center border-b border-[#e8e2d9] dark:border-[#3d352e]">
        <img
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          src={book.cover_url}
          alt={`book cover for ${book.title} by ${book.author}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.0)_1.2%,rgba(255,255,255,0.06)_2.2%,rgba(255,255,255,0.0)_4.5%,rgba(0,0,0,0.0)_6.5%,rgba(0,0,0,0.0)_9%)] pointer-events-none"></div>
      </div>

      <div className="py-3 px-[0.7rem] flex flex-col gap-[0.2rem] grow">
        <h3 className="font-['Lora',_Georgia,_serif] text-[0.88rem] font-semibold text-[#2b2520] dark:text-[#f2ebe4] m-0 leading-[1.3] line-clamp-2 transition-colors duration-200 ease-in-out group-hover:text-[#b45309] dark:group-hover:text-[#f59e0b]" title={`${book.title} (${book.year_published})`}>
          {book.title} <span className="font-sans text-[0.8rem] font-normal text-[#786d63] dark:text-[#b0a59a] ml-1 whitespace-nowrap">({book.year_published})</span>
        </h3>
        <p className="text-[0.76rem] text-[#786d63] dark:text-[#b0a59a] m-0 mb-[1.15rem] font-medium overflow-hidden text-ellipsis whitespace-nowrap">by {book.author}</p>

        <button
          className={`mt-auto self-center py-[0.45rem] px-[1.1rem] rounded-[20px] border font-sans text-[0.76rem] font-semibold cursor-pointer flex items-center justify-center gap-1 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(43,37,32,0.06)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:translate-y-0 ${
            addedToLibrary
              ? 'bg-[#e8f5e9] dark:bg-[#1b4332] text-[#2e7d32] dark:text-[#81c784] border-[#c8e6c9] dark:border-[#2d6a4f] hover:bg-[#2e7d32] dark:hover:bg-[#2d6a4f] hover:text-white hover:border-[#2e7d32] dark:hover:border-[#2d6a4f]'
              : 'bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border-[#e8e2d9] dark:border-[#2e2822] hover:bg-[#b45309] dark:hover:bg-[#f59e0b] hover:text-white hover:border-[#b45309] dark:hover:border-[#f59e0b]'
          }`}
          type="button"
          onClick={() => onToggleAddToLibrary(book)}
        >
          {addedToLibrary ? "✓ Added to Library" : "+ Add to Library"}
        </button>
      </div>
    </div>
  );
}

export { SearchResultBookCard };