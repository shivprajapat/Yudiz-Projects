function ifelse (obj) {
  if (obj.ifArg) {
    return obj.ifReturn()
  } else {
    return obj.elseReturn()
  }
}

function onlyIf (obj) {
  if (obj.ifArg) {
    return obj.ifReturn()
  }
}

function smallIfElse (ifArg, ifReturn, elseReturn) {
  if (ifArg) {
    return ifReturn
  } else {
    return elseReturn
  }
}

function smallOnlyIf (ifArg, ifReturn) {
  if (ifArg) {
    return ifReturn
  }
}

export { ifelse, onlyIf, smallIfElse, smallOnlyIf }
