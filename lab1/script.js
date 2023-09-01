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
        if (!tweet.value || tweet.value.length > 140) {
            const error = document.getElementById("tweet_error");
            error.innerHTML = "Tweet is too long or to short! Maximum 140 characters, minimum 1 character.";
            return;
        }

        postTweet(tweet.value);

        location.reload();
    });
}

function getTweets() {
  let tweets = document.cookie.match(new RegExp("(^| )" + "tweets" + "=([^;]+)"));

  return tweets ? JSON.parse(tweets[2]).sort((a, b) => {
    return b.timestamp - a.timestamp;
  }) : [];
}

function formatDate(timestamp) {
  const date = new Date(timestamp);

  return `${date.toISOString().substring(0, 10)} ${date.toLocaleTimeString("se-SE", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Stockholm",
            hour12: false,
          })}`;
}

function createTweetCard(tweet) {
  const cardDiv = document.createElement('div');
  cardDiv.id = tweet.id;
  cardDiv.classList.add('card', 'text-center', 'mb-4');
  if (tweet.read) {
    cardDiv.classList.add('bg-info');
  }
  
  const headerDiv = document.createElement('div');
  headerDiv.classList.add('card-header');
  
  const titleParagraph = document.createElement('p');
  titleParagraph.classList.add('text-muted', 'm-0');
  titleParagraph.textContent = tweet.author;
  
  headerDiv.appendChild(titleParagraph);
  
  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('card-body', 'row');
  
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('col-11');
  
  const contentParagraph = document.createElement('p');
  contentParagraph.classList.add('card-text');
  contentParagraph.textContent = tweet.message;
  
  contentDiv.appendChild(contentParagraph);
  
  const checkboxDiv = document.createElement('div');
  checkboxDiv.classList.add('col-1');
  
  const checkboxInput = document.createElement('input');
  checkboxInput.classList.add('form-check-input');
  checkboxInput.type = 'checkbox';
  checkboxInput.value = '';
  checkboxInput.addEventListener('change', readTweet, tweet.id);
  checkboxInput.id = tweet.id + 'checkbox';
  checkboxInput.checked = tweet.read;
  
  checkboxDiv.appendChild(checkboxInput);
  
  bodyDiv.appendChild(contentDiv);
  bodyDiv.appendChild(checkboxDiv);
  
  const footerDiv = document.createElement('div');
  footerDiv.classList.add('card-footer', 'text-muted');
  footerDiv.textContent = `Posted at ${formatDate(tweet.timestamp)}`;
  
  cardDiv.appendChild(headerDiv);
  cardDiv.appendChild(bodyDiv);
  cardDiv.appendChild(footerDiv);
  
  return cardDiv;
  
}

function updateTweets(tweets) {
  document.cookie = "tweets=" + JSON.stringify(tweets);
}

function readTweet(event) {
  const id = event.target.id.replace('checkbox', '');

  if (!event.target.checked) {
    document.getElementById(id).classList.remove('bg-info');
  } else
    document.getElementById(id).classList.add('bg-info');

  tweets = getTweets();
  tweets.map(tweet => {
    if (tweet.id == event.target.id.replace('checkbox', '')) {
      tweet.read = !tweet.read;;
      updateTweets(tweets);
      return;
    }
  });
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
