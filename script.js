const quotes = ['집에 가고 싶다']

let words = []
let wordIndex = 0
let startTime = Date.now()

const quoteElement = document.getElementById('quote')
const messageElement = document.getElementById('message')
const typedValueElement = document.getElementById('typed-value')
const startButton = document.getElementById('start')
const dialog = document.querySelector('dialog')
const dialogCloseButton = dialog.querySelector('button')

startButton.focus()

function setNextWord() {
  const spanWords = words.map(function (word, index) {
    return wordIndex === index ? `<mark>${word}</mark>` : `<span>${word}</span>`
  })
  quoteElement.innerHTML = spanWords.join('')
  messageElement.innerText = ''
  typedValueElement.value = ''
}

startButton.addEventListener('click', (event) => {
  const quoteIndex = Math.floor(Math.random() * quotes.length)
  const quote = quotes[quoteIndex]
  words = quote.split(' ')
  wordIndex = 0

  setNextWord()

  typedValueElement.disabled = false
  event.target.disabled = true
  typedValueElement.focus()
  startTime = new Date().getTime()
})

typedValueElement.addEventListener('input', (event) => {
  const currentWord = words[wordIndex]
  const typedValue = typedValueElement.value

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    const elapsedTime = new Date().getTime() - startTime

    printMessage(elapsedTime)
    return
  }
  if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    typedValueElement.value = ''
    wordIndex++
    setNextWord()
    return
  }

  typedValueElement['aria-invalid'] = !currentWord.startsWith(typedValue)
})

function printMessage(elapsedTime) {
  const bestTime = parseInt(localStorage.getItem('bestTime'))

  if (!bestTime || elapsedTime < bestTime) {
    localStorage.setItem('bestTime', elapsedTime)
    const message = `CONGRATULATIONS! You finished in ${
      elapsedTime / 1000
    } seconds. NEW RECORD!`
    messageElement.innerText = message
    return
  }

  const message = `CONGRATULATIONS! You finished in ${
    elapsedTime / 1000
  } seconds. ${bestTime ? `Your best time is ${bestTime / 1000} seconds.` : ''}`

  messageElement.innerText = message

  dialog.showModal()
}

dialogCloseButton.addEventListener('click', () => {
  dialog.close()
  typedValueElement.disabled = true
  typedValueElement.value = ''
  startButton.disabled = false
  startButton.focus()
})
