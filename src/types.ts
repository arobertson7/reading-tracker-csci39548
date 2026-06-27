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

interface OpenLibraryBook {
  key: string;
  title: string;
  first_publish_year: number;
  edition_count: number;
  ebook_access: "no_ebook" | "borrowable" | "public" | string;
  has_fulltext: boolean;
  public_scan_b: boolean;
  
  // Optional Fields (Missing on several items in the sample payload)
  author_key?: string[];
  author_name?: string[];
  language?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  subtitle?: string;

  // Internet Archive properties found in some documents
  ia?: string[];
  ia_collection?: string[];
  lending_edition_s?: string;
  lending_identifier_s?: string;
}

type ReadingStatus = 'to-read' | 'reading' | 'finished';
type BookRating = 1 | 2 | 3 | 4 | 5;

export { type Book, type UserLibraryBook, type OpenLibraryBook, type ReadingStatus, type BookRating }