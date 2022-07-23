const { astDef } = require('../types')
const Scope = require('./scope')
const generate = require('../generator')

module.exports = class NodePath {
    constructor(node, parent, parentPath, key, listKey) {
        this.node = node
        this.parent = parent
        this.parentPath = parentPath
        this.key = key
        this.listKey = listKey

        Object.keys(astDef).forEach(key => {
            if (key.startsWith('is')) {
                this[key] = astDef[key].bind(this.node)
            }
        })
    }

    get scope() {
        if (this.__scope) {
            return this.__scope
        }

        const isBlock = this.isBlock()
        const parentScope = this.parentPath && this.parentPath.scope
        return this.__scope = isBlock ? new Scope(parentScope, this) : parentScope
    }

    skip() {
        this.node.__shouldSkip = true
    }

    isBlock() {
        return astDef.visitorKeys.get(this.node.type).isBlock
    }

    replaceWith(node) {
        if (this.listKey !== undefined) {
            this.parent[this.key].splice(this.listKey, 1, node)
        } else {
            this.parent[this.key] = node
        }
    }

    remove() {
        if (this.listKey !== undefined) {
            this.parent[this.key].splice(this.listKey, 1)
        } else {
            this.parent[this.key] = null
        }
    }

    findParent(cb) {
        let curPath = this.parentPath
        while (curPath && !cb(curPath)) {
            curPath = curPath.parentPath
        }

        return curPath
    }

    find(cb) {
        let curPath = this
        while (curPath && !cb(curPath)) {
            curPath = curPath.parentPath
        }

        return curPath
    }

    traverse(visitors) {
        const traverse = require('./index')
        const defination = astDef.visitorKeys.get(this.node.type)

        if (defination.visitor) {
            defination.visitor.forEach(key => {
                const prop = this.node[key]

                if (Array.isArray(prop)) {
                    prop.forEach((childNode) => {
                        traverse(childNode, visitors, this.node, this)
                    })
                } else {
                    traverse(prop, visitors, this.node, this)
                }
            })
        }
    }

    toString() {
        return generate(this.node).code
    }
}