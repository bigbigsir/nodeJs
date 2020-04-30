'use strict';

(function (window, document) {
  const isSupportWebp = checkWebp()

  // 是否支持webp格式图片
  function checkWebp() {
    const canvas = document.createElement('canvas')
    if (canvas && canvas.toDataURL) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    } else {
      return false
    }
  }

  // 初始化方法
  function init(isProduction = false) {
    if (isProduction && isSupportWebp) {
      document.documentElement.className += ' support-webp'
    }
    delete window.init
    window.isProduction = isProduction
  }

  window.init = init
  window.isSupportWebp = isSupportWebp
})(window, document)
