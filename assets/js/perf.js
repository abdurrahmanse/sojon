document.addEventListener('DOMContentLoaded', function () {
  try {
    var vh = window.innerHeight || document.documentElement.clientHeight

    document.querySelectorAll('img').forEach(function (img) {
      if (img.hasAttribute('fetchpriority') && img.getAttribute('fetchpriority') === 'high') return
      if (img.loading) return // browser supports lazy; skip explicit set

      var rect = img.getBoundingClientRect()
      var isAboveFold = rect.top < vh * 1.2
      if (!isAboveFold) {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy')
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async')
      }
    })
  } catch (e) {}
})
