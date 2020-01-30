'use strict';

(function (window) {
  const dynamicConfig = {
    apiUrl: 'https://fm.libo166.com', // 'https://m.k805.com',  // 接口网关地址
    wmsPath: '_l', // wms环境路径
    wmsServer: 'https://m.k801.com', // 默认wmsServer
    cdnServer: '', // 默认cdn
    cdnPath: '/cdn/A02FM', // 静态文件路径
    assistantUrl: {
      'http': 'http://m.k8004.com',
      'https': 'https://m.k8404.com'
    },
    traceGMEUrl: 'https://mbmgr-api.gci8.com',
    inPTGameDomain: 'https://m.k805.com'
  }
  if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = dynamicConfig
  }
  window.dynamicConfig = dynamicConfig
})(typeof window !== 'undefined' ? window : this)
