interface Book {
  id: string; // the value of the "key" field in OpenLibrary API which uniquely identifies the Work
  title: string;
  author: string;
  year_published: number;
  cover_url: string;
}

interface UserLibraryBook extends Book {
  readingStatus: ReadingStatus;
  rating?: BookRating;
  dateAdded: Date;
}

type ReadingStatus = 'to-read' | 'reading' | 'finished';
type BookRating = 1 | 2 | 3 | 4 | 5;

export { type Book, type UserLibraryBook }