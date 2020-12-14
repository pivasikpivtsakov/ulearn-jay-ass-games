document.querySelector('#equals-btn').onclick = (e) => {
    let inoutput = document.querySelector('#inoutput')
    let query = inoutput.value
    let isFirst = true
    let firstString = []
    let secondString = []
    let operand = ''
    let first = NaN
    let second = NaN
    let result = NaN
    for (const char of query) {
        if (!isNaN(char)) {
            if (isFirst) {
                firstString.push(char)
            } else {
                secondString.push(char)
            }
        } else {
            operand = char
            isFirst = false
        }
    }
    first = parseInt(firstString.join(''))
    second = parseInt(secondString.join(''))
    switch (operand) {
        case '+':
            result = first + second
            break
        case '-':
            result = first - second
            break
        case '*':
            result = first * second
            break
        case '/':
            result = first / second
            break
        default:
            break
    }
    inoutput.value = result
}