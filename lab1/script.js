window.onload = () => {
  const tweets = getTweets();

  for (const tweet of tweets) {
    const card = createTweetCard(tweet);
    document.getElementById('tweet_feed').appendChild(card);
  }

    const form = document.getElementById("tweet_form");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const tweet = document.getElementById("tweet");
        if (tweet.value.length > 140) {
            const error = document.getElementById("tweet_error");
            error.innerHTML = "Tweet is too long! Maximum 140 characters.";
            return;
        }

        postTweet(tweet.value);

        location.reload();
    });
}

function getTweets() {
  let tweets = document.cookie.match(new RegExp("(^| )" + "tweets" + "=([^;]+)"));

  return tweets ? JSON.parse(tweets[2]) : [];
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  return `${date.toISOString().substr(0, 16).replace('T', ' ')}`;
}

function createTweetCard(tweet) {
  const cardDiv = document.createElement('div');
  cardDiv.id = tweet.id;
  cardDiv.classList.add('card', 'text-center', 'mb-4');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('card-header');

  const titleParagraph = document.createElement('p');
  titleParagraph.classList.add('text-muted', 'm-0');
  titleParagraph.textContent = tweet.author;

  headerDiv.appendChild(titleParagraph);

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('card-body');

  const contentParagraph = document.createElement('p');
  contentParagraph.classList.add('card-text');
  contentParagraph.textContent = tweet.message;

  const checkboxInput = document.createElement('input');
  checkboxInput.classList.add('form-check-input');
  checkboxInput.type = 'checkbox';
  checkboxInput.value = '';
  checkboxInput.addEventListener('change', readTweet);
  checkboxInput.id = 'flexCheckDefault';

  bodyDiv.appendChild(contentParagraph);
  bodyDiv.appendChild(checkboxInput);

  const footerDiv = document.createElement('div');
  footerDiv.classList.add('card-footer', 'text-muted');
  footerDiv.textContent = `Posted at ${formatDate(tweet.timestamp)}`;

  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(bodyDiv);
  cardDiv.appendChild(footerDiv);

  return cardDiv;
}

function readTweet(id) {
  console.log("Read")
}


function postTweet(message) {
  let tweets = getTweets();

  const tweet = {
    id: getTweets().length,
    message: message,
    timestamp: Date.now(),
    author: "Anonymous",
    read: false,
  };


  tweets.push(tweet);

  document.cookie = "tweets=" + JSON.stringify(tweets);
}