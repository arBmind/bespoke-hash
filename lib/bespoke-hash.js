module.exports = function() {
  return function(deck) {
    var
      activateSlide = function(index) {
        var indexToActivate = -1 < index && index < deck.slides.length ? index : 0;
        if (indexToActivate !== deck.slide()) {
          deck.slide(indexToActivate);
        }
      }, activateBullet = function(index) {
        if ('bullets' in deck) {
          var bulletToActivate = Math.max(0, Math.min(deck.bullets().length - 1, index));
          if (bulletToActivate !== deck.bullet()) {
            deck.bullet(bulletToActivate);
          }
        }
      },
      parseHash = function() {
        var hash = window.location.hash.slice(1),
          _idx,
          bullet = 0;

        if (hash) {
          if ((_idx = hash.lastIndexOf('.')) !== -1) {
            bullet = parseInt(hash.substr(_idx + 1), 10);
            hash = hash.substr(0, _idx);
          }
          var slideNumberOrName = parseInt(hash, 10);

          if (slideNumberOrName) {
            activateSlide(slideNumberOrName - 1);
            if (!isNaN(bullet)) activateBullet(bullet);
          } else {
            deck.slides.forEach(function(slide, i) {
              if (slide.getAttribute('data-bespoke-hash') === hash || slide.id === hash) {
                activateSlide(i);
                if (!isNaN(bullet)) activateBullet(bullet);
              }
            });
          }
        }
      },
      storeHash = function() {
        var
          slideIndex = deck.slide(),
          slide = deck.slides[slideIndex];

        var slideName = slide.getAttribute('data-bespoke-hash') || slide.id;
        var hash = slideName || (slideIndex + 1);
        if ('bullets' in deck && 0 != deck.bullets().length) hash += '.' + deck.bullet();
        window.location.hash = hash;
      };

    setTimeout(function() {
      parseHash();

      deck.on('activate', storeHash);
      deck.on('activateBullet', storeHash);

      window.addEventListener('hashchange', parseHash);
    }, 0);
  };
};
