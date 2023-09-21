/**
 * Initializes the app by fetching the tweets from the server and rendering them in the UI.
 * @returns {void}
 */
function initializeApp() {
  getTweets()
    .then(tweets => {
      renderTweets(tweets);
      initializeTweetForm();
    })
    .catch(error => {
      displayError("Error fetching tweets:", error);
    });
}

/**
 * Renders the tweets in the UI.
 * @param {Array} tweets - An array of tweet objects.
 * @returns {void}
 */
function renderTweets(tweets) {
  const tweetFeed = document.getElementById("tweet_feed");
  tweets.forEach(tweet => {
    const card = createTweetCard(tweet);
    tweetFeed.appendChild(card);
  });
}

/**
  * Unescapes HTML characters in a string.
  * @param {string} html - The string to unescape.
  * @returns {string} The escaped string.
  * 
  * @example
  * unescapeHTML("&lt;script&gt;alert(&#39;hello world&#39;)&lt;/script&gt;");
  *  => "<script>alert('hello world')</script>"
*/
function unescapeHTML(html) {
  var unescapeEl = document.createElement("textarea");
  unescapeEl.innerHTML = html;
  return unescapeEl.textContent;
}

/**
 * Initializes the tweet form and adds a submit event listener.
 * When the form is submitted, the tweet is posted to the server.
 * If the tweet is successfully posted, the page is reloaded.
 * If the tweet is not successfully posted, an error is displayed.
 * @returns {void}
 */
function initializeTweetForm() {
  const form = document.getElementById("tweet_form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const tweet = document.getElementById("tweet");
    if (!tweet.value || tweet.value.length > 140) {
      displayError(
        "Tweet is too long or too short! Maximum 140 characters, minimum 1 character."
      );
      return;
    }

    try {
      await postTweet(tweet.value);
      //location.reload();
    } catch (error) {
      displayError("Error posting tweet:", error);
    }
  });
}

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 * @param {Error} error - The error object.
 * @returns {void}
 */
function displayError(message, error) {
  console.error(message, error);
  const error_field = document.getElementById("tweet_error");
  error_field.textContent = message;
}

/**
 * Fetches the tweets from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of tweet objects.
 * @throws {Error} An error is thrown if the request fails.
 */
async function getTweets() {
  try {
    const response = await fetch("http://localhost:5000/messages");
    const data = await response.json();
    return data.data.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  return `${date.toISOString().substring(0, 10)} ${date.toLocaleTimeString(
    "se-SE",
    {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Stockholm",
      hour12: false,
    }
  )}`;
}

/**
 * Creates a tweet card element.
 * @param {Object} tweet - A tweet object.
 * @returns {HTMLDivElement} A tweet card element.
 */
function createTweetCard(tweet) {
  const cardDiv = document.createElement("div");
  cardDiv.id = tweet._id;
  cardDiv.classList.add("custom-card");
  if (tweet.read) {
    cardDiv.classList.add("read");
  }

  const headerDiv = document.createElement("header");
  const headerParagraph = document.createElement("p");
  headerParagraph.textContent = unescapeHTML(tweet.author);
  headerDiv.appendChild(headerParagraph);

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("content");

  const contentParagraph = document.createElement("p");
  contentParagraph.textContent = unescapeHTML(tweet.message);

  const checkboxInput = document.createElement("input");
  checkboxInput.type = "checkbox";
  checkboxInput.addEventListener("change", readTweet, tweet._id);
  checkboxInput.id = tweet._id + "checkbox";
  checkboxInput.checked = tweet.read;

  contentDiv.appendChild(contentParagraph);
  contentDiv.appendChild(checkboxInput);

  const footerDiv = document.createElement("footer");
  footerDiv.textContent = `Posted at: ${formatDate(tweet.timestamp)}`;

  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(contentDiv);
  cardDiv.appendChild(footerDiv);

  return cardDiv;
}

function readTweet(event) {
  const id = event.target.id.replace("checkbox", "");

  fetch(`http://localhost:5000/messages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ read: event.target.checked }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    if (event.target.checked) {
      document.getElementById(id).classList.add("read");
    } else document.getElementById(id).classList.remove("read");
  })
  .catch((error) => {
    console.error('Error:', error);
    displayError("Failed to update tweet");
  });
}

function postTweet(message) {
  const tweet = {
    message: message,
    author: "Anonymous",
    timestamp: Date.now(),
    read: false,
  }

  fetch('http://localhost:5000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweet),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const tweetFeed = document.getElementById("tweet_feed");
      document.getElementById("tweet_form").reset(); // Clear the form
      const card = createTweetCard({ id: data.data.id, ...tweet});
      tweetFeed.prepend(card);
    })
    .catch((error) => {
      console.error('Error:', error);
      displayError("Failed to post tweet");
    });
}

window.onload = initializeApp;
