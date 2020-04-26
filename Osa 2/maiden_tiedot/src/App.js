import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const Results = ({countries, filter, setFilter}) => {
  const namesToShow = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))

  if (filter !== '' && namesToShow.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  if (filter !== '' && namesToShow.length > 1) {
    return (
      <div>
        {namesToShow.map((country, i) => <Name key={i} country={country} setFilter={setFilter} />)}
      </div>
    )
  }
  if (filter !== '' && namesToShow.length === 1) {
    return (
      <div>
        <Details country={namesToShow[0]} />
      </div>
    )
  }
  return (
    <div></div>
  )
}

const Name = ({country, setFilter}) => {
  return (
    <div>{country.name} <button onClick={() => setFilter(country.name)}>show</button></div>
  )
}

const Details = ({country}) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map((language, i) => <li key={i}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt="flag" height="100" />
      <h3>Weather in {country.capital}</h3>
      <WeatherQuery city={country.capital} />
    </div>
  )
}

const WeatherQuery = ({city}) => {
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}`)
      .then(response => {
        setWeather(response.data.current)
      })
  }, [city])

  return (
    <div>
      <div><b>temperature:</b> {weather.temperature} Celsius</div>
      <img src={weather.weather_icons} alt="weather" height="70" />
      <div><b>wind:</b> {weather.wind_speed} kph direction {weather.wind_dir}</div>
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter} />
      <Results countries={countries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App