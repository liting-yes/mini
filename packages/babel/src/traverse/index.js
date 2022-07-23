const { visitorKeys } = require('../types').astDef
const NodePath = require('./nodePath')

module.exports = function traverse(node, visitors, parent, parentPath, key, listKey) {
    const defination = visitorKeys.get(node.type)
    let visitorFns = visitors[node.type] || {}

    if (typeof visitorFns === 'function') {
        visitorFns = {
            enter: visitorFns
        }
    }

    const path = new NodePath(node, parent, parentPath, key, listKey)
    visitorFns.enter && visitorFns.enter(path)

    if (node.__shouldSkip) {
        delete node.__shouldSkip
        return
    }
    if (defination.visitor) {
        defination.visitor.forEach(key => {
            const prop = node[key]
            if (Array.isArray(prop)) {
                prop.forEach((childNode, index) => {
                    traverse(childNode, visitors, node, path, key, index)
                })
            } else {
                traverse(prop, visitors, node, path, key)
            }
        })
    }

    visitorFns.exit && visitorFns.exit(path)
}