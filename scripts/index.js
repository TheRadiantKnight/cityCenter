/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

 
  let key = 'L4W3J70dUZy2q9ipeTeLCHTSSt9wx23hy9SVA1JfJrQ';
  let searchURL =  'https://autosuggest.search.hereapi.com/v1/autosuggest';
  let latAndLong;
  

  // Geolocation for user 

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        latAndLong = `${data.coords.latitude},${data.coords.longitude}`
      }, 
      (error) => {
        console.log('An error happened...', error);
      }
    )
  } 
  
  // query formatting function

  function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  // function displaying menu items 

  function displayPlaces({items}) {
        console.log(items);
    // clear out prev results
      $('#results-list').empty();  

    // for loop through response
      for (let i = 0; i < items.length; i++ ) {

        let card = 
         `<div class="column">
            <div class="card">
              ${items[i].resultType === "place" ? `<h1>${items[i].title}</h1>`: ''}
              ${items[i].categories ? `<p class="title" style="font-size: 1.5em">${items[i].categories[0].name}</p>` : ''}
              ${items[i].address ? `<p style="font-size: 1.25em">${items[i].address.label}</p>` : ''}          
            </div>
         </div>`;
     
     $('#results-list').append(card);
    }     
  }

  // function querying API for locations

  function searchPlaces( q, maxResults = 10) {

    const params = {
        apiKey: key,  
        at: latAndLong,  
        q,
        lang:'en', 
        limit: maxResults  
      };

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    return fetch(url)
      .then(response => {
       if (response.ok) {
         return response.json();
       }
        throw new Error(response.statusText);
     })

  }

  // function for all category listings

  function categoryPlaces() {    
    
      $('.btn-category').on("click", (ev) => {
        ev.preventDefault();
        let queryTerm = ev.target.textContent;
        $('#results').empty();
        searchPlaces(queryTerm)
        .then(({items}) => {
          
          for (let i = 0; i < items.length; i++) {
            
            let queryResult = 
            `<div class="column">
               <div class="card">
               ${items[i].resultType === "place" ? `<h1>${items[i].title}</h1>`: ''}
               ${items[i].categories ? `<p class="title" style="font-size: 1.5em">${items[i].categories[0].name}</p>` : ''}
               ${items[i].address ? `<p style="font-size: 1.25em">${items[i].address.label}</p>` : ''}          
              </div>
            </div>`;
            $('#results').append(queryResult);
          }
        });
      });
  }

  // function for all public services listings

  function pubicServices() {

    $('.btn-public').on("click", (ev) => {
      ev.preventDefault();
      let queryTerm = ev.target.textContent;
      $('#public-results').empty();
      searchPlaces(queryTerm)
      .then(({items}) => {
        //console.log(data);
        for (let i = 0; i < items.length; i++) {
          
          let queryResult = 
          `<div class="column">
             <div class="card">
             ${items[i].resultType === "place" ? `<h1>${items[i].title}</h1>`: ''}
             ${items[i].categories ? `<p class="title" style="font-size: 1.5em">${items[i].categories[0].name}</p>` : ''}
             ${items[i].address ? `<p style="font-size: 1.25em">${items[i].address.label}</p>` : ''}          
            </div>
          </div>`;
          $('#public-results').append(queryResult);
        }
      });
    });    

  }

  // function for all event handling 
  
  function watchForm() {
    $('form').submit(event => {
     event.preventDefault();
     const placesName = $('#placesName').val();      
     searchPlaces(placesName).then(response => displayPlaces(response));
     
    });

  }


  $(() => {
    watchForm();
    getLocation(); 
    categoryPlaces();
    pubicServices();
  });


