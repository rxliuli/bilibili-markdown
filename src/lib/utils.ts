import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toHtml } from 'hast-util-to-html'
import { select } from 'unist-util-select'
import type { Heading } from 'mdast'
import { toHast } from 'mdast-util-to-hast'
import type Quill from 'quill'
import { toString } from 'mdast-util-to-string'

export function html2md(html: string): string {
  const hast = fromHtml(html, { fragment: true })
  const mdast = toMdast(hast)
  return toMarkdown(mdast)
}

export function md2html(md: string): string {
  const hast = fromMarkdown(md)
  const html = toHtml(hast as any)
  return html
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
  console.log('updateContent', html)
  const quill = (document.querySelector('.rql-editor') as any).__quill as Quill
  if (!quill) {
    throw new Error('未找到 quill 实例')
  }
  quill.clipboard.dangerouslyPasteHTML(html)
}

export function updateFromMarkdown(content: string) {
  const root = fromMarkdown(content)
  const heading = select('heading[depth="1"]', root) as Heading
  if (heading) {
    updateTitle(toString(heading))
  }
  root.children = root.children.filter((it) => it !== heading)
  updateContent(toHtml(toHast(root) as any))
}
