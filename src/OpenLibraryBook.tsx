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

export { type OpenLibraryBook };