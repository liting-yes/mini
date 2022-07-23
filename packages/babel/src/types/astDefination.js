const astDefinationMap = new Map()

astDefinationMap.set('Program', {
    visitor: ['body'],
    isBlock: true
})

astDefinationMap.set('VariableDeclaration', {
    visitor: ['declarations']
})

astDefinationMap.set('VariableDeclarator', {
    visitor: ['id', 'init']
})

astDefinationMap.set('Identifier', {})

astDefinationMap.set('NumericLiteral', {})

astDefinationMap.set('FunctionDeclaration', {
    visitor: ['id', 'params', 'body'],
    isBlock: true
})

astDefinationMap.set('BlockStatement', {
    visitor: ['body']
})

astDefinationMap.set('ReturnStatement', {
    visitor: ['argument']
})

astDefinationMap.set('BinaryExpression', {
    visitor: ['left', 'right']
})

astDefinationMap.set('ExpressionStatement', {
    visitor: ['expression']
})

astDefinationMap.set('CallExpression', {
    visitor: ['callee', 'arguments']
})

const validations = {}

for (let name of astDefinationMap.keys()) {
    validations['is' + name] = function (node) {
        return node.type === name
    }
}

module.exports = {
    visitorKeys: astDefinationMap,
    ...validations
}