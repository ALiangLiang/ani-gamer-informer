async function get (url) {
  let res
  try {
    res = await fetch(url, {
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  } catch (err) {
    throw err
  }

  if (res.error) {
    throw new Error(res.error)
  }

  if (!res.ok) {
    const body = await res.json()
    throw new Error(body.error)
  }

  return res.json()
}

// 剛開始關閉 browserAction 按鈕。
chrome.runtime.onInstalled.addListener(() => {
  chrome.browserAction.disable()
})

let loginTabId = null

// 更新動畫清單。
const sync = () => chrome.storage.sync.get('lastRecord', async (data) => {
  let lastRecord = []
  if (data.lastRecord) {
    lastRecord = data.lastRecord
  }

  // 從動畫瘋取得動畫列表。
  let res
  try {
    res = await get('https://api.gamer.com.tw/mobile_app/anime/v1/favorite.php')
    if (res.code === 0) {
      // 如果已經開過登入頁面，但仍無登入。
      if (loginTabId) {
        return
      }

      const tab = await new Promise((resolve) => chrome.tabs.create({url: 'https://user.gamer.com.tw/login.php'}, resolve))
      loginTabId = tab.id || true
      return console.error(res.message)
    }
  } catch (err) {
    return console.error(err)
  }

  // 過濾出有更新的動畫。
  const updatedAnimes = res.filter((ani) => {
    const matchedAni = lastRecord.find((e) => e.acg_sn === ani.acg_sn)
    // 代表動畫有更新。
    if (matchedAni && matchedAni.info !== ani.info) {
      // 建立通知。
      chrome.notifications.create({
        type: 'basic',
        iconUrl: ani.cover,
        title: '巴哈姆特動畫瘋，有更新。',
        message: ani.info
      })
      // 更新 badge 數字。
      chrome.browserAction.getBadgeText({}, (badgeText) => {
        if (!badgeText) {
          badgeText = '0'
        }

        const badgeNumber = Number(badgeText) + 1
        badgeText = String(badgeNumber)

        chrome.browserAction.setBadgeBackgroundColor({color: 'red'})
        chrome.browserAction.setBadgeText({text: badgeText})
        chrome.browserAction.enable()
      })

      return matchedAni
    }
  })

  // 將這次的動畫清單存起來。
  await new Promise((resolve) => chrome.storage.sync.set({ updatedAnimes }, resolve))
  chrome.storage.sync.set({
    lastRecord: res
  })
})

sync()
setInterval(sync, 5 * 60 * 1000)
