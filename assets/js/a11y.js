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

    // Provide accessible names for icon-only links/buttons
    var actionable = document.querySelectorAll('a[href], button')
    actionable.forEach(function (el) {
      try {
        var name = (el.textContent || '').trim()
        var hasName = name.length > 0 || el.getAttribute('aria-label') || el.getAttribute('title')
        if (!hasName) {
          if (el.tagName === 'A') {
            var href = el.getAttribute('href') || ''
            if (href && href !== '#' && !href.startsWith('javascript:')) {
              var label = el.getAttribute('data-label') || el.getAttribute('title')
              if (!label) {
                try {
                  var urlPart = href.split('#')[0].split('?')[0].split('/').pop() || href
                  label = urlPart.replace(/[-_]/g, ' ').replace(/\.[a-zA-Z0-9]+$/, '')
                } catch (e) {
                  label = 'Link'
                }
              }
              el.setAttribute('aria-label', label)
            } else {
              el.setAttribute('aria-label', 'Link')
            }
          } else if (el.tagName === 'BUTTON') {
            var blabel = el.getAttribute('data-label') || el.getAttribute('title') || 'Button'
            el.setAttribute('aria-label', blabel)
          }
        }
      } catch (_) {}
    })

    // Label selects without an associated <label>
    var selects = document.querySelectorAll('select')
    selects.forEach(function (sel) {
      try {
        var id = sel.getAttribute('id')
        var hasLabel = false
        if (id) {
          var lab = document.querySelector('label[for="' + id + '"]')
          hasLabel = !!lab
        }
        var hasAria = sel.hasAttribute('aria-label') || sel.hasAttribute('aria-labelledby')
        if (!hasLabel && !hasAria) {
          var aria = sel.getAttribute('name') || (sel.options[0] ? sel.options[0].text : 'Select')
          sel.setAttribute('aria-label', aria)
        }
      } catch (_) {}
    })

    // Label inputs and textareas using placeholder or name when no label exists
    var controls = document.querySelectorAll('input, textarea')
    controls.forEach(function (ctrl) {
      try {
        // Ignore inputs with type hidden or submit/reset/button
        var type = (ctrl.getAttribute('type') || '').toLowerCase()
        if (['hidden', 'submit', 'reset', 'button', 'image'].indexOf(type) !== -1) return

        var id = ctrl.getAttribute('id')
        var hasLabel = false
        if (id) {
          var lab = document.querySelector('label[for="' + id + '"]')
          hasLabel = !!lab
        }
        var hasAria = ctrl.hasAttribute('aria-label') || ctrl.hasAttribute('aria-labelledby')
        if (!hasLabel && !hasAria) {
          var label = ctrl.getAttribute('placeholder') || ctrl.getAttribute('name') || 'Input field'
          ctrl.setAttribute('aria-label', label)
        }
      } catch (_) {}
    })
  } catch (e) {
    // fail silently
  }
})
