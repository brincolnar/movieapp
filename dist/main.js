console.clear();
const apiKey = "8cfb407f1d513714da1fe05fd596b64a";
const movieGrid = document.querySelector("#movie-grid");
const filterInput = document.querySelector("#filter-input");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-form input");
const libraryGrid = document.querySelector("#library-grid");

let results;

window.addEventListener("load", (event) => {
  // popular movies request
  const Url =
    "https://api.themoviedb.org/3/movie/popular?api_key=" +
    apiKey +
    "&language=en-US&page=1";

  fetch(Url)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      results = res.results;
      sessionStorage.setItem('movies', JSON.stringify(results));

      for (var i = 0; i < results.length; i++) {

        // create a card for each movie
        var card = document.createElement("div");
        card.id = `${results[i].id}`;

        card.className = "m-auto w-64 bg-gray-100";
        card.innerHTML = `<img width="100%" height="400" src="https://image.tmdb.org/t/p/original${results[i].poster_path}" alt="">
            <h2 class="m-4">${results[i].title}</h2>
            <a id="add-library-icon" class="p-3" href=""><i alt="Add to Library" class="text-3xl fa fa-plus hover:text-indigo-200"></i></a>
            <a id="see-details-icon" class="p-3" href="#"><i alt="See Details" class="text-3xl fa fa-eye hover:text-indigo-200"></i></a>`;
            
        movieGrid.appendChild(card);
      }
    });

    // populate library grid
    let libraryMovies = JSON.parse(sessionStorage.getItem('library'));

    for (var i = 0; i < libraryMovies.length; i++) {

      // create a card for each movie
      var card = document.createElement("div");
      card.id = `${libraryMovies[i].id}`;

      card.className = "m-auto w-64 bg-gray-100";
      card.innerHTML = `<img width="100%" height="400" src="https://image.tmdb.org/t/p/original${libraryMovies[i].poster_path}" alt="">
          <h2 class="m-4">${libraryMovies[i].title}</h2>
          <a id="remove-icon" class="p-3" href=""><i alt="Remove from Library" class="text-3xl fa fa-trash hover:text-indigo-200"></i></a>
          <a id="see-details-icon" class="p-3" href="#"><i alt="See Details" class="text-3xl fa fa-eye hover:text-indigo-200"></i></a>`;
          
      libraryGrid.appendChild(card);
    }

    const removeFromLibraryButtons = document.querySelectorAll('#remove-icon');

    for (let index = 0; index < removeFromLibraryButtons.length; index++) {
      const element = removeFromLibraryButtons[index];

      element.addEventListener('click', e => {
        e.preventDefault()
        const library = JSON.parse(sessionStorage.getItem('library'))
        
        for (let index = 0; index < library.length; index++) {
          const element = library[index];
          
          // remove by id
          const id = e.target.parentElement.parentElement.id;
          
          if(element.id == id) {
            library.splice(index, 1);
          }

          sessionStorage.setItem('library', JSON.stringify(library))

          location.reload()
        }
      })
      
    }

});


filterInput.addEventListener('keyup', filterMovies);

// filtering movies using DOM
function filterMovies(e) {
  
  const titles = document.querySelectorAll("#movie-grid h2");
  
  for (let index = 0; index < titles.length; index++) {

    // check if title contains filter
    if(titles[index].textContent.indexOf(e.target.value) == -1) {
      console.log('Filter: ' + e.target.value);
      titles[index].parentElement.style.display = 'none';
    } else {
      titles[index].parentElement.style.display = 'block';
    }
    
  }
}

searchForm.addEventListener('submit', searchMovies);

function searchMovies(e) {
  e.preventDefault();

  // hide filter
  filterInput.style.display = 'none';

  let encodedQuery = encodeURI(searchInput.value);
  console.log('encodedQuery:  ' + encodedQuery);
  let queryUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + encodedQuery;
  
  fetch(queryUrl)
    .then(res => {return res.json()})
    .then(data => {
      
      movieGrid.innerHTML = '';
      const gridTitle = document.querySelector('#grid-title');
      gridTitle.innerHTML = `Search results for '${searchInput.value}': `;

      // if no results
      if(data.results.length == 0) {
        gridTitle.innerHTML = `No results for '${searchInput.value}' :( `;
        return;
      }


      // interested only in top 10 results
      for (let index = 0; index < 10; index++) {
        // create a card for each movie
        let card = document.createElement("div");
        card.id = `${data.results[index].id}`;

        card.className = "m-auto w-64 bg-gray-100";
        card.innerHTML = `<img width="100%" height="400" src="https://image.tmdb.org/t/p/original${data.results[index].poster_path}" alt="">
            <h2 class="m-4">${data.results[index].title}</h2>
            <a id="add-library-icon" class="p-3" href=""><i alt="Add to Library" class="text-3xl fa fa-plus hover:text-indigo-200"></i></a>
            <a id="see-details-icon" class="p-3" href="#"><i alt="See Details" class="text-3xl fa fa-eye hover:text-indigo-200"></i></a>`;
    
        movieGrid.appendChild(card);
      }

      setTimeout(() => {
        const addLibraryButtons = document.querySelectorAll('#add-library-icon');
        
        for (let index = 0; index < addLibraryButtons.length; index++) {
          const button = addLibraryButtons[index];
      
          button.addEventListener('click', addToLibrary);
          
        }
      }, 100)
    });
}


// after the movies get loaded and cards are created
setTimeout(() => {
  const addLibraryButtons = document.querySelectorAll('#add-library-icon');
  
  for (let index = 0; index < addLibraryButtons.length; index++) {
    const button = addLibraryButtons[index];

    button.addEventListener('click', addToLibrary);
    
  }


}, 100)


function addToLibrary(e) {
  e.preventDefault()
  const id = e.target.parentElement.parentElement.id;
  console.log('movie id:  ' + e.target.parentElement.parentElement.id);

  // add functionality
  if(sessionStorage.getItem('library') == null) {
    sessionStorage.setItem('library', JSON.stringify([]));
  }

  const Url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;

  fetch(Url)
    .then(data => {return data.json()})
    .then(res => {
      console.log(`res: `);
      console.log(res)

      // get and change session storage library
      let library = JSON.parse(sessionStorage.getItem('library'));
      library.push(res);

      // save new library array to session storage
      sessionStorage.setItem('library', JSON.stringify(library));
    })
}

function removeFromLibrary(e) {
  e.preventDefault();

  const library = JSON.parse(sessionStorage.getItem('library'));
  // const id = e.target.parentElement.parentElement.id;

  library.array.forEach(element => {
    console.log(element)
  });
}
