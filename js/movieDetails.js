document.addEventListener('DOMContentLoaded', async function () {
    const movieId = getMovieIdFromQueryString();
    if (movieId) {
      const movieData = await getMovieDetails(movieId);
      if (movieData) {
        displayMovieDetails(movieData);
      }
    } else {
      console.error("Movie ID not provided in the query string");
    }
  });
  
  function displayMovieDetails(movieDetails) {
    if (movieDetails) {
      let movieCartona = `
        <div class="movie-details">
          <div class="mov-img">
            <img src=${imgPath + movieDetails.poster_path} alt="movie">
          </div>
          <div class="mov-desc">
            <h2 class="movie-title">${movieDetails.original_title}</h2>
            <p>Overview: ${movieDetails.overview}</p>
            <p>Rate: ${movieDetails.vote_average}</p>
            <p>Release Date: ${movieDetails.release_date}</p>
          </div>
        </div>
      `;
      const movieDetailsContainer = document.getElementById('movieDetails');
      if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = movieCartona;
      } else {
        console.error("Element with ID 'movieDetails' not found");
      }
    }
  }
  
  function getMovieIdFromQueryString() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('movieId');
  }
  
  async function getMovieDetails(movieId) {
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=01080d9fdf2c432d932059229a9af8ce`;
  
    try {
      const response = await fetch(detailsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Movie Details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching movie details:", error.message);
      return null;
    }
}