import { useState, useEffect } from "react";
import { type UserLibraryBook, type Book, type ReadingStatus, type BookRating } from "../types.ts";

const STORAGE_KEY = "user_library_books";

export function useLibraryBooks() {
  const [userLibraryBooks, setUserLibraryBooks] = useState<UserLibraryBook[]>(() => {
    // Load user's library if it exists in local storage
    const raw_library_books = localStorage.getItem(STORAGE_KEY);
    if (!raw_library_books) return [];
    try {
      return JSON.parse(raw_library_books) as UserLibraryBook[];
    } catch {
      return [];
    }
  });

  // Save user's library to localStorage when there is a change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userLibraryBooks));
  }, [userLibraryBooks]);

  function inUserLibrary(bookId: string) {
    for (const userLibraryBook of userLibraryBooks) {
      if (userLibraryBook.id === bookId) return true;
    }
    return false;
  }

  function addToUserLibrary(book: Book) {
    setUserLibraryBooks([...userLibraryBooks, {
      id: book.id,
      title: book.title,
      author: book.author,
      year_published: book.year_published,
      cover_url: book.cover_url,
      readingStatus: 'to-read',
      dateAdded: new Date()
    }]);
  }

  function removeFromUserLibrary(book: Book) {
    setUserLibraryBooks(userLibraryBooks.filter((userLibraryBook) => userLibraryBook.id !== book.id));
  }

  function toggleAddToUserLibrary(book: Book) {
    if (inUserLibrary(book.id)) { // remove from library
      removeFromUserLibrary(book);
    } else { // else add to library
      addToUserLibrary(book);
    }
  }

  function updateBookReadingStatus(bookId: string, newReadingStatus: string) {
    if (newReadingStatus !== 'to-read' && newReadingStatus !== 'reading' && newReadingStatus !== 'finished') {
      return; // double check that newReadingStatus is a valid ReadingStatus before changing
    }
    setUserLibraryBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? {
          ...book, readingStatus: newReadingStatus as ReadingStatus,
          rating: undefined // any change in reading status would logically reset the rating
        } : book
      )
    )
  }

  function updateBookRating(bookId: string, rating: number) {
    setUserLibraryBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, rating: rating as BookRating } : book
      )
    )
  }

  return { userLibraryBooks, inUserLibrary, removeFromUserLibrary, toggleAddToUserLibrary, updateBookReadingStatus, updateBookRating};
}