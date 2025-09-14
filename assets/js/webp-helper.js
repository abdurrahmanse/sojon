document.addEventListener('DOMContentLoaded', function () {
  // Detect WebP support
  function supportsWebP(callback) {
    var img = new Image()
    img.onload = function () {
      callback(img.width === 1)
    }
    img.onerror = function () {
      callback(false)
    }
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACQAgCdASoCAAIALmk0mk0iIhEAAP7/8AA='
  }

  function trySwapToWebP(url, onYes, onNo) {
    try {
      var webpUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      if (webpUrl === url) {
        onNo && onNo()
        return
      }
      var probe = new Image()
      probe.onload = function () {
        onYes(webpUrl)
      }
      probe.onerror = function () {
        onNo && onNo()
      }
      probe.src = webpUrl
    } catch (_) {
      onNo && onNo()
    }
  }

  supportsWebP(function (ok) {
    if (!ok) return

    // Swap <img> sources if a .webp exists
    var imgs = document.querySelectorAll('img[src]')
    imgs.forEach(function (img) {
      var src = img.getAttribute('src')
      if (!src || /\.webp$/i.test(src)) return
      trySwapToWebP(src, function (wp) {
        img.setAttribute('src', wp)
      })
    })

    // Swap data-bg-src attributes used by theme before main.js applies them
    var bgNodes = document.querySelectorAll('[data-bg-src]')
    bgNodes.forEach(function (el) {
      var bg = el.getAttribute('data-bg-src')
      if (!bg || /\.webp$/i.test(bg)) return
      trySwapToWebP(bg, function (wp) {
        el.setAttribute('data-bg-src', wp)
      })
    })
  })
})
