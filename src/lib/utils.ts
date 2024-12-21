import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { toHtml } from 'hast-util-to-html'
import { select } from 'unist-util-select'
import type { Heading, Root } from 'mdast'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import { toHast } from 'mdast-util-to-hast'
import type Quill from 'quill'
import { toString } from 'mdast-util-to-string'
import markdownToQuillDelta from 'markdown-to-quill-delta'

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

function updateContent(root: Root) {
  // console.log('updateContent', root)
  const quill = (document.querySelector('.rql-editor') as any).__quill as Quill
  if (!quill) {
    throw new Error('未找到 quill 实例')
  }
  quill.setContents(
    markdownToQuillDelta(root, {
      handle: ({ node, ops }) => {
        if (node.type === 'thematicBreak') {
          ops.push(
            {
              attributes: {
                class: 'cut-off',
              },
              insert: {
                'cut-off': {
                  type: '0',
                  url: 'https://i0.hdslb.com/bfs/article/0117cbba35e51b0bce5f8c2f6a838e8a087e8ee7.png',
                },
              },
            },
            {
              insert: '\n',
            },
          )
          return true
        }
      },
    }),
  )
}

export function updateFromMarkdown(content: string) {
  const root = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  })
  const heading = select('heading[depth="1"]', root) as Heading
  if (heading) {
    updateTitle(toString(heading))
  }
  root.children = root.children.filter((it) => it !== heading)
  updateContent(root)
}
