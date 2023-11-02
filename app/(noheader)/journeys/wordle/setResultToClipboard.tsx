import { Result } from '../../../../libs/wordle'

export const setResultToClipboard = async (result?: Result | null) => {
  if (!result) return

  const text = `
${result.title}

${result.guesses.map((guess) => guess.result).join('\n')}

${window.location}
`.trim()

  const blob = new Blob([text], { type: 'text/plain' })
  const data = [new window.ClipboardItem({ 'text/plain': blob })]
  await navigator.clipboard.write(data)
}
