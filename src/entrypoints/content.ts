export default defineContentScript({
  matches: ['https://member.bilibili.com/read/editor/**'],
  async main() {
    await injectScript('/inject.js')
  },
})
