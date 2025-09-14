document.addEventListener('DOMContentLoaded', function () {
  try {
    // Ensure a skip link exists at the top of <body>
    if (!document.querySelector('.skip-to-content')) {
      var skip = document.createElement('a')
      skip.href = '#main'
      skip.className = 'skip-to-content'
      skip.textContent = 'Skip to main content'
      document.body.insertBefore(skip, document.body.firstChild)
    }

    // Find or set an element as the main content target
    var mainTarget = document.querySelector('#main, main, [role="main"]')
    if (!mainTarget) {
      mainTarget = document.querySelector(
        '.vs-blog-wrapper, .vs-hero__layout1, .vs-service__layout1, .vs-team__layout1, .vs-portfolio__layout1, .vs-testi__layout1, .vs-client__layout1, .space, .space-bottom'
      )
    }
    if (mainTarget && !mainTarget.id) {
      mainTarget.id = 'main'
    }

    // Make main target focusable for skip link
    var target = document.getElementById('main')
    if (target && !target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1')
    }

    // Enhance skip link behavior
    var skipLink = document.querySelector('.skip-to-content')
    if (skipLink) {
      skipLink.addEventListener('click', function (e) {
        var t = document.getElementById('main')
        if (t) {
          // Allow default jump then focus
          setTimeout(function () {
            t.focus({ preventScroll: true })
          }, 0)
        }
      })
    }

    // Set aria-current="page" on active nav links
    var anchors = document.querySelectorAll('nav a[href], .vs-mobile-menu a[href], .menu a[href], .header a[href]')
    var loc = window.location
    var path = loc.pathname.split('/').pop() || 'index.html'
    anchors.forEach(function (a) {
      try {
        var href = a.getAttribute('href')
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
        var apath = href.split('/').pop()
        if (apath === '' || apath === '/') apath = 'index.html'
        if (apath === path) {
          a.setAttribute('aria-current', 'page')
        }
      } catch (_) {}
    })
  } catch (e) {
    // fail silently
  }
})
