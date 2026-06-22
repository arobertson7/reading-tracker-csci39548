interface Book {
  id: string; // the value of the "key" field in OpenLibrary API which uniquely identifies the Work
  title: string;
  author: string;
  year_published: number;
  cover_url: string;
}

export { type Book }