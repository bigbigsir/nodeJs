'use strict';

(function (window, document, designWidth) {
  const isSupportWebp = checkWebp()
  const docEl = document.documentElement

  // 是否支持webp格式图片
  function checkWebp() {
    let canvas = document.createElement('canvas')
    if (canvas && canvas.toDataURL) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    } else {
      return false
    }
  }

  // 初始化方法
  function init(isProduction = false) {
    window.isProduction = isProduction
    if (isProduction && isSupportWebp) {
      docEl.className += ' support-webp'
    }
    delete window.init
  }

  // set 1rem = viewWidth / (designWidth / 100)
  function setRemUnit() {
    const dpr = window.devicePixelRatio || 1
    const viewWidth = docEl.clientWidth > 640 ? 640 : docEl.clientWidth
    const rem = viewWidth / (designWidth / 100)
    docEl.style.fontSize = rem + 'px'
    docEl.className = docEl.className.replace(/\s*hairlines/g, '')

    // detect 0.5px supports
    if (dpr >= 2) {
      let fakeBody = document.createElement('body')
      let testElement = document.createElement('div')
      testElement.style.border = '0.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.className += ' hairlines'
      }
      docEl.removeChild(fakeBody)
    }
  }

  setRemUnit()
  window.init = init
  window.isSupportWebp = isSupportWebp
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', (e) => {
    e.persisted && setRemUnit()
  })
})(window, document, 375)
