var startedCounting = false,
    charityJSON = null,
    requestCount = 0,
    minutesBetweenUpdates = 10;

function animateCounter(id, start = 0, end = null) {
  startedCounting = true;
  $(`[data-stat="${id}"]`).each(function() {
    var $this = $(this),
      countTo = end || $this.text();

    // DD: Prevent popping animation
    $this.css('width',$this.width() + 12)

    $({ countNum: start }).animate({ countNum: countTo }, {
      duration: 3000,
      easing: 'swing',
      step: function() {
        $this.text(Math.floor(this.countNum).toLocaleString('en'));
      },
      complete: function() {
        $this.text(this.countNum.toLocaleString('en'));
      }
    });
  });
}

function startObserver() {
  var counterObserver = new IntersectionObserver(function(entries) {
    if(entries[0].isIntersecting === true && !startedCounting) {
      animateCounter('meals')
      animateCounter('education')
      animateCounter('everything')
      counterObserver.disconnect();
    }
  }, { threshold: [1] });
  counterObserver.observe(document.querySelector(".charity-count-bar"));
}

// DD: Old code ported over
function charity_ticker_driver(id, start, end, current = 0 , walk = 0){
  var stepSize = Math.ceil( (end - start) / minutesBetweenUpdates )

  if(current === 0) {
    current = start;
    walk = start;
  }
  walk = walk + stepSize

  // normal step
  if(current < end && walk <= end) {
    if(( walk - current ) > stepSize) {
      animateCounter( id, current, walk );
      current = walk
    }

    setTimeout(function(){
      charity_ticker_driver(id, start, end, current, walk);
    }, 60000); // 1 min
  }
  // last step
  else if(current < end && walk > end){
    animateCounter(id, current, end );
  }
}

function getCharityJSON() {
  if(requestCount > 10) return;
  console.log('Getting charity JSON')
  fetch('https://5daydeal.com/charity-counter')
    .then(function(response){ return response.text() })
    .then(function(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html,'text/html');
      charityJSON = JSON.parse(doc.getElementById('charity_counter_json').textContent)
      // console.log(charityJSON)
      charity_ticker_driver('meals', charityJSON.meals_donated_previous, charityJSON.meals_donated)
      charity_ticker_driver('education', charityJSON.education_sponsored_previous, charityJSON.education_sponsored)
      charity_ticker_driver('meals', charityJSON.total_donations_previous, charityJSON.total_donations)
      setTimeout( getCharityJSON, 600000) // 10 min
    })
  requestCount++;
}

window.addEventListener('load',function() {
  if(typeof IntersectionObserver === "undefined") {
    animateCounter('meals')
    animateCounter('education')
    animateCounter('everything')
  } else {
    startObserver()
  }
  getCharityJSON()
})
