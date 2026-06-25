import { useState } from 'react';
import { type UserLibraryBook } from './Book.tsx';

interface UserLibraryBookCardProps {
  book: UserLibraryBook;
  onRemoveFromLibrary: (book: UserLibraryBook) => void;
  onChangeReadingStatus: (bookId: string, newReadingStatus: string) => void;
  onChangeRating: (bookId: string, rating: number) => void;
}

function UserLibraryBookCard({ book, onRemoveFromLibrary, onChangeReadingStatus, onChangeRating }: UserLibraryBookCardProps) {
  const [isSelectingRating, setIsSelectingRating] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  function handleRemoveFromLibrary() {
    onRemoveFromLibrary(book);
  }

  return (
    <div className="group bg-[#ffffff] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#3d352e] rounded-xl overflow-hidden flex flex-col shadow-[0_2px_6px_rgba(43,37,32,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer relative h-full min-h-[335px] hover:-translate-y-[5px] hover:shadow-[0_12px_24px_rgba(43,37,32,0.1)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:border-[#b45309] dark:hover:border-[#f59e0b]">

      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#fcfaf7] dark:bg-[#121110] flex items-center justify-center border-b border-[#e8e2d9] dark:border-[#3d352e]">
        <img
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          src={book.cover_url}
          alt={`book cover for ${book.title} by ${book.author}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.0)_1.2%,rgba(255,255,255,0.06)_2.2%,rgba(255,255,255,0.0)_4.5%,rgba(0,0,0,0.0)_6.5%,rgba(0,0,0,0.0)_9%)] pointer-events-none"></div>
        {book.readingStatus === 'finished' && (
          <div
            className="absolute top-2 right-2 z-5 flex flex-col items-end"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsSelectingRating(false);
              }
            }}
          >
            <button
              className={`backdrop-blur-md py-[0.25rem] px-[0.55rem] rounded-xl text-[0.72rem] font-bold flex items-center gap-[0.2rem] shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer font-inherit hover:scale-105 hover:border-[#b45309] dark:hover:border-[#f59e0b] ${
                book.rating
                  ? 'bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(28,26,24,0.85)] text-[#b45309] dark:text-[#f59e0b] border border-[rgba(255,255,255,0.3)] dark:border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.95)] dark:hover:bg-[rgba(41,37,36,0.95)]'
                  : 'bg-[rgba(243,244,246,0.85)] dark:bg-[rgba(55,65,81,0.7)] text-[#786d63] dark:text-[#9ca3af] border border-[rgba(229,231,235,0.6)] dark:border-[rgba(75,85,99,0.4)] hover:bg-[rgba(243,244,246,0.95)] dark:hover:bg-[rgba(55,65,81,0.9)] hover:text-[#2b2520] dark:hover:text-[#d1d5db]'
              }`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSelectingRating((prev) => !prev);
              }}
              title={
                book.rating
                  ? `User rating: ${book.rating} out of 5. Click to change.`
                  : 'Click to rate this book'
              }
              aria-label={
                book.rating
                  ? `Rating: ${book.rating} out of 5. Click to change.`
                  : 'Rate this book'
              }
            >
              <span className={`leading-none text-[0.8rem] ${book.rating ? 'text-[#f59e0b]' : 'text-[#9ca3af] dark:text-[#6b7280]'}`}>★</span>{' '}
              {book.rating ? `${book.rating}/5` : 'Rate'}
            </button>

            {isSelectingRating && (
              <div className="mt-1 bg-[rgba(255,255,255,0.95)] dark:bg-[rgba(41,37,36,0.95)] backdrop-blur-xl border border-[#e8e2d9] dark:border-[rgba(255,255,255,0.1)] rounded-lg py-[0.35rem] px-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center animate-[popoverFadeIn_0.15s_cubic-bezier(0.16,1,0.3,1)]" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-[0.2rem]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`bg-transparent border-none p-0 px-0.5 text-[1.15rem] cursor-pointer text-[#d1d5db] dark:text-[#4b5563] transition-[transform,color] duration-120 ease-in-out leading-none hover:scale-125 hover:text-[#f59e0b] ${
                        (hoveredRating ?? (book.rating || 0)) >= star ? 'text-[#f59e0b]' : ''
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => {
                        onChangeRating(book.id, star);
                        setIsSelectingRating(false);
                      }}
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="py-3 px-[0.7rem] flex flex-col gap-[0.2rem] grow">
        <h3 className="font-['Lora',_Georgia,_serif] text-[0.88rem] font-semibold text-[#2b2520] dark:text-[#f2ebe4] m-0 leading-[1.3] line-clamp-2 transition-colors duration-200 ease-in-out group-hover:text-[#b45309] dark:group-hover:text-[#f59e0b]" title={`${book.title} (${book.year_published})`}>
          {book.title} <span className="font-sans text-[0.8rem] font-normal text-[#786d63] dark:text-[#b0a59a] ml-1 whitespace-nowrap">({book.year_published})</span>
        </h3>
        <p className="text-[0.76rem] text-[#786d63] dark:text-[#b0a59a] m-0 mb-[1.15rem] font-medium overflow-hidden text-ellipsis whitespace-nowrap">by {book.author}</p>

        <div className="flex flex-row items-center gap-[0.35rem] mt-auto w-full">
          <div className="relative flex-1 min-w-0">
            <select
              className={`w-full py-[0.45rem] pr-[1.6rem] pl-[0.55rem] rounded-lg border border-[#e8e2d9] dark:border-[#2e2822] bg-[#ffffff] dark:bg-[#1a1816] text-[#2b2520] dark:text-[#f2ebe4] font-sans text-[0.72rem] font-medium cursor-pointer appearance-none bg-no-repeat bg-[position:right_0.45rem_center] bg-[size:0.8rem] text-ellipsis whitespace-nowrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:border-[#b45309] dark:hover:border-[#f59e0b] focus:border-[#b45309] dark:focus:border-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#fef3c7] dark:focus:ring-[#451a03] bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_fill='none'_viewBox='0_0_24_24'_stroke='%23786d63'%3E%3Cpath_stroke-linecap='round'_stroke-linejoin='round'_stroke-width='2'_d='M19_9l-7_7-7-7'/%3E%3C/svg%3E")] dark:bg-[url("data:image/svg+xml,%3Csvg_xmlns='http://www.w3.org/2000/svg'_fill='none'_viewBox='0_0_24_24'_stroke='%23b0a59a'%3E%3Cpath_stroke-linecap='round'_stroke-linejoin='round'_stroke-width='2'_d='M19_9l-7_7-7-7'/%3E%3C/svg%3E")]`}
              defaultValue={book.readingStatus || 'to-read'}
              aria-label="Reading status"
              onChange={(e) => onChangeReadingStatus(book.id, e.target.value)}
            >
              <option value="to-read">📖 To Read</option>
              <option value="reading">⚡ Reading Now</option>
              <option value="finished">✨ Finished</option>
            </select>
          </div>

          <button
            className="shrink-0 w-7 h-7 rounded-lg border border-transparent bg-[rgba(239,68,68,0.30)] dark:bg-[rgba(239,68,68,0.25)] text-[#dc2626] dark:text-[#f87171] font-sans text-[0.75rem] font-semibold cursor-pointer flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:bg-[#dc2626] hover:text-white hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_2px_8px_rgba(220,38,38,0.4)] active:translate-y-0"
            type="button"
            aria-label="Remove book from library"
            title="Remove from library"
            onClick={handleRemoveFromLibrary}
          >
            <span className="trash-icon">🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { UserLibraryBookCard };