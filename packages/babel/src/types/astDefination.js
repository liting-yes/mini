const astDefinationMap = new Map()

astDefinationMap.set('Program', {
    visitor: ['body'],
    isBlock: true
})

astDefinationMap.set('VariableDeclaration', {
    visitor: ['declarations']
})

astDefinationMap.set('Identifier', {})

astDefinationMap.set('NumericLiteral', {})

astDefinationMap.set('FunctionDeclarations', {
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