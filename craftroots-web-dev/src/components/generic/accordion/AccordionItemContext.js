import { createContext } from 'react'

const context = createContext({
  itemKey: '',
})
context.displayName = 'AccordionItemContext'

export default context
