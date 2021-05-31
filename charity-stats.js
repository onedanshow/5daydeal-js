var startedCounting = false,
    charityJSON = null,
    requestCount = 0

function runCounter() {
  startedCounting = true;
  $('[data-animate="count-up"]').each(function() {
    var $this = $(this),
      countTo = $this.text();

    // DD: Prevent popping animation
    $this.css('width',$this.width() + 12)

    $({ countNum: 0 }).animate({ countNum: countTo }, {
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
      runCounter();
      counterObserver.disconnect();
    }
  }, { threshold: [1] });
  counterObserver.observe(document.querySelector(".charity-count-bar"));
}

function getCharityJSON() {
  if(requestCount > 100) return;
  console.log('Getting charity JSON')
  fetch('https://www.5daydeal.com/charity-counter')
    .then(function(response){ return response.text() })
    .then(function(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html,'text/html');
      charityJSON = JSON.parse(doc.getElementById('charity_counter_json').textContent)
      console.log(charityJSON)
    })
  requestCount++;
  // setTimeout(getCharityJSON, 600000)
}

function increment

window.addEventListener('load',function() {
  if(typeof IntersectionObserver === "undefined") {
    runCounter()
  } else {
    startObserver()
  }
  getCharityJSON()
})
