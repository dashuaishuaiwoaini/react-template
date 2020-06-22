import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function App (props) {
  const doc = window.document
  const node = doc.createElement('div')
  doc.body.appendChild(node)

  useEffect(() => {
    return () => window.document.body.removeChild(node)
  }, [])

  return createPortal(
    props.children, // 塞进传送门的JSX
    node // 传送门的另一端DOM node
  )
}

export default App
