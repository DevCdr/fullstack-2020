import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const allResults = useQuery(ALL_BOOKS)
  const [getBooks, result] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    getBooks({ variables: { genre } })
  }, [genre, getBooks])

  if (!props.show) {
    return null
  }

  if (allResults.loading || result.loading) {
    return <div>loading...</div>
  }

  const allBooks = allResults.data.allBooks
  let genres = allBooks.map(b => b.genres).flat().map(b => b.toLowerCase())
  genres = genres.filter((g, i) => genres.indexOf(g) === i).sort()

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      in genre <strong>{genre ? genre : 'all'}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(g => <button key={g} onClick={() => setGenre(g)}>{g}</button>)}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books