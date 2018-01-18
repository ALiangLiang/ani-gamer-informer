
module.exports = {
  name: '(非官方) 巴哈姆特動畫瘋 更新通知',
  version: '1.0.1',
  description: '登入巴哈姆特後，將想關注的動畫加入最愛，往後每當動畫更新，將會通知您。',
  author: 'ALiangLiang <me@aliangliang.top>',
  manifest_version: 2,
  icons: {
    16: 'icons/16.png',
    24: 'icons/24.png',
    32: 'icons/32.png',
    48: 'icons/48.png',
    128: 'icons/128.png'
  },
  permissions: [
    '<all_urls>',
    '*://*/*',
    'activeTab',
    'tabs',
    'cookies',
    'background',
    'contextMenus',
    'unlimitedStorage',
    'storage',
    'notifications',
    'identity',
    'identity.email',
    'notifications',
    'storage',
    '*://api.gamer.com.tw/*',
    'https://unpkg.com/*'
  ],
  browser_action: {
    default_title: 'title',
    default_popup: 'pages/popup.html'
  },
  background: {
    persistent: false,
    page: 'pages/background.html'
  },
  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
