import { wait } from '@liuli-util/async'
import { mount } from 'svelte'
import PasteButton from '$lib/PasteButton.svelte'
import { pasteMarkdown } from '$lib/utils'

function addToolbarButton() {
  const toolbar = document.querySelector('.bre-toolbar') as HTMLElement
  const button = document.createElement('div')
  button.title = '粘贴 Markdown'
  button.className = 'tlbr-btn'
  button.innerHTML = `<div class="tlbr-btn__icon">
    <svg class="svg-icon" style="width: 24px;height: 24px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M96 672v-341.333333h85.333333l128 128 128-128h85.333334v341.333333h-85.333334v-220.586667l-128 128-128-128v220.586667h-85.333333m597.333333-341.333333h128v170.666666h106.666667l-170.666667 192-170.666666-192h106.666666z" fill="#42A5F5" /></svg>
  </div>`
  toolbar.insertBefore(button, toolbar.children[0])

  toolbar.addEventListener('click', pasteMarkdown)
}

function addFloatButton() {
  const $sidebar = document.querySelector('.web-editor__sidebar') as HTMLElement
  const editor = document.createElement('div')
  editor.classList.add('toolbtn')
  editor.id = 'markdown-editor-button'
  mount(PasteButton, {
    target: editor,
  })
  $sidebar.appendChild(editor)
}

export default defineUnlistedScript(async () => {
  await wait(() => !!document.querySelector('.web-editor__sidebar'))
  if (document.getElementById('markdown-editor-button')) {
    return
  }

  addFloatButton()
  addToolbarButton()
})
