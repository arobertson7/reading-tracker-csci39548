import { useState } from 'react'
import './App.css'
import BookCollection from './BookCollection'
import { type Book } from './BookCard'
import oneFishTwoFish from './assets/one-fish-two-fish.jpg'; // temporary for sample book cover
import breakfastOfCHampions from './assets/breakfast-of-champions.jpg' // temporary for sample book cover
import greenwichPark from './assets/greenwich-park.jpg' // temporary for sample book cover
import unbearable from './assets/unbearable.jpg' // temporary for sample book cover

function App() {
  const [userBooks, setUserBooks] = useState<Book[]>([
    { id: 1, title: "One Fish, Two Fish, Red Fish, Blue Fish", author: "Dr. Seuss", year_published: 1960, cover_url: oneFishTwoFish },
    { id: 2, title: "Breakfast of Champions", author: "Kurt Vonnegut", year_published: 1973, cover_url: breakfastOfCHampions},
    { id: 3, title: "Greenwich Park", author: "Katherine Faulkner", year_published: 2021, cover_url: greenwichPark},
    { id: 4, title: "The Unbearable Lightness of Being", author: "Milan Kundera", year_published: 1984, cover_url: unbearable}
  ]);
  // const [queriedBooks, setQueriedBooks] = useState<Book[]>([]);

  return (

    <>
      <header>
        <h1>Reading Tracker</h1>
        <p>A book a day keeps the... Wait. <br />A book a day? That's like a lot of time spent reading.</p>
      </header>

      <main>
        <BookCollection books={userBooks}></BookCollection>
      </main>

      <footer>
        <p>&copy;2026 Austin Robertson - Brooklyn, NY</p>
      </footer>
    </>

  )
}

export default App
