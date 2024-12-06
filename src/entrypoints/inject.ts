import { wait } from '@liuli-util/async'
import { mount } from 'svelte'
import PasteButton from '$lib/PasteButton.svelte'

export default defineUnlistedScript(async () => {
  console.log('inject.js')
  await wait(() => !!document.querySelector('.web-editor__sidebar'))
  const editorBtnId = 
  'markdown-editor-button'
  // console.log('find sidebar', document.querySelector('.web-editor__sidebar'))
  if (document.getElementById(editorBtnId)) {
    // console.log('already injected')
    document.getElementById(editorBtnId)?.remove()
  }
  const $sidebar = document.querySelector('.web-editor__sidebar') as HTMLElement

  function addButton(component: typeof PasteButton) {
    const editor = document.createElement('div')
    editor.classList.add('toolbtn')
    editor.id = editorBtnId
    mount(component, {
      target: editor,
    })
    $sidebar.appendChild(editor)
  }

  addButton(PasteButton)
})
