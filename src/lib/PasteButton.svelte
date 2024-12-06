<script lang="ts">
  import { updateFromMarkdown } from './utils'
  import { serializeError } from 'serialize-error'

  async function onPasteMarkdown(ev: MouseEvent) {
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
</script>

<span role="presentation" onclick={onPasteMarkdown}>粘贴 Markdown</span>
