import {parse} from 'postcss'

module.exports = function(source, reversed) {
  var isStringified = false

  try {
    source = JSON.parse(source)
    reversed = JSON.parse(reversed)
    isStringified = true
  }
  catch (e) {}

  const sourceAst = parse(source)
  const reversedAst = parse(reversed)
  const totalNodes = reversedAst.nodes.length

  let diff = ''

  for (let i = 0; i < totalNodes; i++) {
    let isAdded = false
    const sNode = sourceAst.nodes[i]
    const rNode = reversedAst.nodes[i]
    const sDcl = sNode.nodes
    const rDcl = rNode.nodes

    sDcl.forEach((dcl, index) => {
      if (dcl.toString() !== rDcl[index].toString()) {
        if (!isAdded) {
          diff += `${rNode.selector} {\n`
          isAdded = true
        }
        diff += `  ${rDcl[index].toString()};\n`
      }
    })

    if (isAdded) {
      diff += `}\n`
    }
  }

  if (isStringified) {
    diff = JSON.stringify(diff)
  }

  return diff
}
