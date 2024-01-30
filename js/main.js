document.addEventListener('DOMContentLoaded', async function () {
  await getTrendingMovies();
  displayMovies();
});

var trendingMovies = [];
var imgPath = "https://image.tmdb.org/t/p/w500";

async function getTrendingMovies() {
  const apiUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=01080d9fdf2c432d932059229a9af8ce`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }
    const data = await response.json();
    trendingMovies = data.results;
    console.log("Trending Movies:", trendingMovies);
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

function displayMovies() {
  let cartona = ``;
  for (let i = 0; i < trendingMovies.length; i++) {
    cartona += `
      <div class="movie-box">
        <div class="movie">
          <div class="movie-img">
            <img src=${imgPath + trendingMovies[i].poster_path} alt="movie">
          </div>
          <div class="movie-desc">
            <a href="#" class="movie-title" data-movie-id="${trendingMovies[i].id}">
              ${trendingMovies[i].original_title}
            </a>
            <p>rate: ${trendingMovies[i].vote_average}</p>
          </div>
        </div>
      </div>
    `;
  }
  document.getElementById('moviesList').innerHTML = cartona;

  const movieTitles = document.querySelectorAll('.movie-title');
  movieTitles.forEach(title => {
    title.addEventListener('click', async (event) => {
      event.preventDefault();
      const movieId = title.dataset.movieId;
      const movieData = await getMovieDetails(movieId);
      if (movieData) {
        console.log("Clicked Movie Data:", movieData);
        displayMovieDetails(movieData);
        window.location.href = `movieDetails.html?movieId=${movieId}`;
      }
    });
  });
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



// -------------------signup


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    submitFormData();
  });
});

function submitFormData() {
  let user = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  let errorMsg = "";
  let errorsList = [];

  function goToHome() {
    window.location.href = 'login.html';
  }

  function validateForm() {
    let isValid = true;
    errorsList = [];
    const errorMessagesElement = document.getElementById("errorMessages");
    errorMessagesElement.innerHTML = "";

    // Validate name
    if (user.name.length < 3 || user.name.length > 30) {
      isValid = false;
      errorsList.push({ message: "Name must be between 3 and 30 characters" });
    }

    // Validate phone
    if (!/^[0-9]{11}$/.test(user.phone)) {
      isValid = false;
      errorsList.push({ message: "Phone must be 11 digits numeric" });
    }

    // Validate email
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
      !["com", "net", "org"].includes(user.email.split(".")[1])
    ) {
      isValid = false;
      errorsList.push({ message: "Invalid email format" });
    }

    // Validate password 
    if (user.password.length === 0) {
      isValid = false;
      errorsList.push({ message: "Password is required" });
    }

    if (!isValid) {
      errorMessagesElement.innerHTML = errorsList.map(error => error.message).join("<br>");
    }

    return isValid;
  }

  function submitForm() {
    try {
      let isValid = validateForm();
      if (!isValid) {
        console.log(errorsList);
        return;
      }

      let users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));

      goToHome();
    } catch (error) {
      console.error('Error submitting form data:', error);
      errorMsg = 'An error occurred while submitting the form.';
    }
  }

  submitForm();
}


// ----------------- login


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      submitLogin();
  });
});

function submitLogin() {
  let user = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
  };

  let users = JSON.parse(localStorage.getItem('users')) || [];

  // Find the user in the local storage
  let loggedInUser = users.find(u => u.email === user.email && u.password === user.password);

  if (loggedInUser) {
      localStorage.setItem("userToken", "dummyToken");
      goToHome();
  } else {
      displayError(['Invalid email or password']);
  }
}

function displayError(errors) {
  const loginErrorMessagesElement = document.getElementById("loginErrorMessages");
  loginErrorMessagesElement.innerHTML = errors.join("<br>");
}

function goToHome() {
  window.location.href = 'index.html';
}


