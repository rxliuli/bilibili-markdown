/* @refresh reload */
import { render } from 'solid-js/web'
import { wait } from '@liuli-util/async'
import { JSX, createSignal, onMount } from 'solid-js'
import './index.css'
import { Quill } from 'quill'
import {
  toMarkdown,
  Root,
  hastToHtml,
  mdToHast,
  fromMarkdown,
  select,
  Heading,
  toString,
  flatMap,
} from '@liuli-util/markdown-util'
import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'

function html2md(html: string): string {
  const hast = fromHtml(html, { fragment: true })
  const mdast = toMdast(hast as any)
  return toMarkdown(mdast as Root)
}

function updateTitle(title: string) {
  // 获取 textarea 元素
  const textarea = document.querySelector(
    '.bre-title-input textarea',
  ) as HTMLTextAreaElement

  // 设置新的值
  textarea.value = title

  // 创建一个新的 'input' 事件
  const event = new Event('input', {
    bubbles: true,
    cancelable: true,
  })

  // 触发事件
  textarea.dispatchEvent(event)
}

function updateContent(html: string) {
  const quill = (document.querySelector('.rql-editor') as any).__quill as Quill
  if (!quill) {
    throw new Error('未找到 quill 实例')
  }
  quill.clipboard.dangerouslyPasteHTML(html)
}

function updateFromMarkdown(content: string) {
  const root = fromMarkdown(content)
  const heading = select('heading', root) as Heading
  if (heading.depth !== 1) {
    updateContent(hastToHtml(mdToHast(root) as any))
    return
  }
  updateTitle(toString(heading))
  flatMap(root, (it) => {
    return it === heading ? [] : [it]
  })
  updateContent(hastToHtml(mdToHast(root) as any))
}

function MarkdownEditor() {
  const [content, setContent] = createSignal(
    html2md(document.querySelector('.rql-editor')?.innerHTML ?? ''),
  )
  function onChange(value: string) {
    setContent(value)
    updateContent(hastToHtml(mdToHast(fromMarkdown(value)) as any))
  }
  return (
    <textarea
      value={content()}
      onChange={(ev) => onChange(ev.target.value)}
      class="fixed inset-0 w-full h-full absolute"
    ></textarea>
  )
}

function EditorButton() {
  const [isMarkdown, setIsMarkdown] = createSignal(false)

  function toggleIsMarkdown() {
    const $editorBox = document.querySelector(
      '.b-read-editor__content',
    ) as HTMLElement
    $editorBox.style.position = 'relative'
    const editorId = 'markdown-editor-root'
    if (isMarkdown()) {
      // 删除一个悬浮的 markdown 编辑器
      debugger
      document.getElementById(editorId)?.remove()
      setIsMarkdown(false)
      return
    }
    const $markdownEditorRoot = document.createElement('div')
    $markdownEditorRoot.id = editorId
    // 创建一个悬浮的 markdown 编辑器
    render(MarkdownEditor, $markdownEditorRoot)
    $editorBox.appendChild($markdownEditorRoot)
    setIsMarkdown(true)
  }

  return (
    <>
      <span onClick={toggleIsMarkdown}>
        {isMarkdown() ? 'markdown' : '富文本'}
        <br />
        切换
      </span>
    </>
  )
}

function PasteButton() {
  async function onPasteMarkdown(ev: MouseEvent) {
    const text = await navigator.clipboard.readText()
    if (!text) {
      return
    }
    updateFromMarkdown(text)
  }
  return <button onClick={onPasteMarkdown}>粘贴 Markdown</button>
}

// console.log('hello from content script')
await wait(() => !!document.querySelector('.web-editor__sidebar'))
const editorBtnId = 'markdown-editor-button'
// console.log('find sidebar', document.querySelector('.web-editor__sidebar'))
if (document.getElementById(editorBtnId)) {
  // console.log('already injected')
  document.getElementById(editorBtnId)?.remove()
}
const $sidebar = document.querySelector('.web-editor__sidebar') as HTMLElement

function addButton(component: () => JSX.Element) {
  const $editor = document.createElement('div')
  $editor.classList.add('toolbtn')
  $editor.id = editorBtnId
  render(component, $editor!)
  $sidebar.appendChild($editor)
}

addButton(PasteButton)  
// addButton(EditorButton)
