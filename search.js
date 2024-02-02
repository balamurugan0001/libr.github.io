// Get the user's query from the URL
let query = window.location.search;

// Parse the user's query using the URLSearchParams constructor
let params = new URLSearchParams(query);

// Display the user's query in the span element with the id "query"
document.getElementById("query").innerHTML = "<strong>" + params.get("query") + "</strong>";

// Perform a web search using the user's query and the Bing Web Search API
fetch("https://api.bing.microsoft.com/v7.0/search?q=" + params.get("query") + "&mkt=en-US", {
  headers: {
    // Include the API key in the request header
    "Ocp-Apim-Subscription-Key": "YOUR_API_KEY"
  }
})
.then(response => {
  // Convert the response to a JavaScript object
  return response.json();
})
.then(data => {
  // Access the search results from the webPages.value property
  let results = data.webPages.value;

  // Display the search results in the ul element with the id "results"
  let output = "";
  for (let i = 0; i < results.length; i++) {
    // Create a list item with a link for each web page
    // Add custom attributes for the date, title, and rating of the web page
    output += "<li data-date='" + results[i].dateLastCrawled + "' data-title='" + results[i].name + "' data-rating='" + results[i].rating + "'><a href='" + results[i].url + "' target='_blank' title='" + results[i].snippet + "'>" + results[i].name + "</a></li>";
  }
  document.getElementById("results").innerHTML = output;
})
.catch(error => {
  // Handle the error response
  console.log(error);
});

// Define a function that will sort the search results according to the selected option
function sort_results(event) {
  // Get the value of the selected option
  let option = event.target.value;

  // Get the search results from the ul element with the id "results"
  let results = document.querySelectorAll("#results li");

  // Convert the collection of list items to an array
  let array = Array.from(results);

  // Define a custom compare function that will compare two list items based on the selected option
  function compare(a, b) {
    // Get the value of the custom attribute for the selected option from the list items
    let valueA = a.getAttribute("data-" + option);
    let valueB = b.getAttribute("data-" + option);

    // Compare the values in a case-insensitive and locale-aware way
    // Return a negative number, zero, or a positive number depending on the comparison result
    return valueA.localeCompare(valueB, undefined, {numeric: true, sensitivity: 'base'});
  }

  // Sort the array of list items using the sort method and the custom compare function
  array.sort(compare);

  // Clear the HTML content of the ul element with the id "results"
  document.getElementById("results").innerHTML = "";

  // Append the sorted array of list items to the ul element with the id "results"
  for (let i = 0; i < array.length; i++) {
    document.getElementById("results").appendChild(array[i]);
  }
}
