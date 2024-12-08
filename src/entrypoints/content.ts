export default defineContentScript({
  matches: ['https://member.bilibili.com/read/editor/**'],
  allFrames: true,
  async main() {
    await injectScript('/inject.js')
  },
})
