import Browser from 'webextension-polyfill'
import scriptUrl from './index.tsx?script&module'

const $script = document.createElement('script')
$script.src = Browser.runtime.getURL(scriptUrl)
$script.type = 'module'
document.head.prepend($script)
