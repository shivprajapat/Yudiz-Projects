import { merge } from 'lodash'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import Backdrop from './Backdrop'
import IconButton from './IconButton'

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(Card(theme), Input(theme), Button(theme), Backdrop(theme), IconButton(theme))
}
