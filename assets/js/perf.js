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

      // Reduce CLS: set width/height if missing and natural sizes are known
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        var setDims = function () {
          try {
            var w = img.naturalWidth
            var h = img.naturalHeight
            if (w > 0 && h > 0) {
              if (!img.hasAttribute('width')) img.setAttribute('width', w)
              if (!img.hasAttribute('height')) img.setAttribute('height', h)
            }
          } catch (_) {}
        }
        if (img.complete) setDims()
        else img.addEventListener('load', setDims, { once: true })
      }
    })

    // Promote first large hero image near top for LCP if not already
    var heroImg = document.querySelector('.vs-hero__item img, .vs-hero__item2 img')
    if (heroImg && !heroImg.hasAttribute('fetchpriority')) {
      heroImg.setAttribute('fetchpriority', 'high')
      heroImg.setAttribute('decoding', 'async')
    }
  } catch (e) {}
})

// Allow bfcache: ensure unload handlers do not block caching
window.addEventListener('load', function () {
  try {
    // Clear legacy unload handlers that can prevent BFCache
    window.onunload = null
    window.addEventListener('pagehide', function () {}, { passive: true })
  } catch (e) {}
})
