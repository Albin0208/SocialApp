const API_URL = "http://localhost:5000/messages";

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
 * Escapes HTML characters in a string to prevent script injection.
 * @param {string} html - The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("tweet").value.trim();
    let author = document.getElementById("author").value.trim();
    if (!message || message.length > 140) {
      displayError(
        "Tweet is too long or too short! Maximum 140 characters, minimum 1 character."
      );
      return;
    }
    if (!author) {
      author = "Anonymous";
    }

    postTweet({ message: escapeHTML(message), author: escapeHTML(author) });
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
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.data.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    displayError("Error fetching tweets:", error);
    return [];
  }
}

/**
  * Formats a timestamp to a string.
  * @param {number} timestamp - A timestamp.
  * @returns {string} A formatted string.
  * @example
  * formatDate(1609459200000) => "2021-01-01 00:00"
*/
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

  // Creates the header with the author
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
  checkboxInput.addEventListener("change", markTweetAsRead, tweet._id);
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

/**
  * Marks a tweet as read or unread.
  * @param {Event} event - The event object.
  * @returns {void}
*/
function markTweetAsRead(event) {
  const id = event.target.id.replace("checkbox", "");

  fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ read: event.target.checked }),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
      if (event.target.checked) {
        document.getElementById(id).classList.add("read");
      } else document.getElementById(id).classList.remove("read");
    })
    .catch(error => {
      displayError("Failed to update tweet", error);
    });
}

/**
  * Posts a tweet to the server.
  * @param {Object} input_tweet - A tweet object.
  * @returns {void}
*/
function postTweet(input_tweet) {
  const tweet = {
    ...input_tweet,
    timestamp: Date.now(),
    read: false,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tweet),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Success:", data);
      const tweetFeed = document.getElementById("tweet_feed");
      document.getElementById("tweet_form").reset(); // Clear the form
      const card = createTweetCard({ _id: data.data.id, ...tweet });
      tweetFeed.prepend(card);
    })
    .catch(error => {
      displayError("Failed to post tweet", error);
    });
}

window.onload = initializeApp;
