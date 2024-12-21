import { fromMarkdown } from 'mdast-util-from-markdown'
import { select } from 'unist-util-select'
import type { Heading, Root } from 'mdast'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { gfm } from 'micromark-extension-gfm'
import type Quill from 'quill'
import { toString } from 'mdast-util-to-string'
import markdownToQuillDelta from 'markdown-to-quill-delta'
import type { Handle } from 'markdown-to-quill-delta'
import { serializeError } from 'serialize-error'

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

const thematicBreak: Handle = ({ node, ops }) => {
  if (node.type !== 'thematicBreak') {
    return
  }
  ops.push({
    attributes: {
      class: 'cut-off',
    },
    insert: {
      'cut-off': {
        type: '0',
        url: 'https://i0.hdslb.com/bfs/article/0117cbba35e51b0bce5f8c2f6a838e8a087e8ee7.png',
      },
    },
  })
  return true
}

function updateContent(root: Root) {
  const quill = (document.querySelector('.rql-editor') as any).__quill as Quill
  if (!quill) {
    throw new Error('未找到 quill 实例')
  }
  quill.setContents(
    markdownToQuillDelta(root, {
      handle: thematicBreak,
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

export async function pasteMarkdown() {
  try {
    const text = await navigator.clipboard.readText()
    if (!text) {
      return
    }
    updateFromMarkdown(text)
  } catch (err) {
    alert('粘贴失败 ' + serializeError(err).message)
  }
}
