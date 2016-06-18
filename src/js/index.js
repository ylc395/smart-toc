import { isMasterFrame } from './helpers/iframe'
import createTOC from './toc'
import extract from './helpers/extract'
import { toast } from './helpers/util'

if (isMasterFrame(window)) {

  let article, headings, toc
  const start = function() {
    [article, headings] = extract()
    if (article && headings && headings.length) {
      toc = createTOC(article, headings)
    } else {
      toast('No article/headings are detected.')
    }
  }

  start()
  setInterval(() => {
    if (toc && toc.isShow() && !document.body.contains(article)) {
      toc.dispose()
      toc = null
      start()
    }
  }, 3000)
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      try {
        if (toc) {
          toc[request]()
        } else {
          start()
        }
      } catch (e) {
        console.error(e)
      }
      sendResponse(true)
    }
  )
}
