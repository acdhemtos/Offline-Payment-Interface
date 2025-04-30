function parseInput(input) {
    const result = {
        matchType: 0,
        data: {
            username: null,
            amount: null,
            name: null
        }
    };

    const lines = input.trim().split('\n').map(line => line.trim()).filter(line => line !== '$');
    if (lines.length < 1 || lines.length > 3) return result;

    const usernameRegex = /^[a-z][a-z0-9]{7,14}$/;
    const amountRegex = /^[1-9][0-9]*$/;
    const nameRegex = /^[a-z ]{1,60}$/;

    const [username, amount, name] = lines;

    if (lines.length >0 && usernameRegex.test(username)) {
        result.matchType = 1;
        result.data.username = username;
        if (lines.length >1 && usernameRegex.test(username) && amountRegex.test(amount)) {
            result.matchType = 2;
            result.data.amount = amount;
            if (lines.length > 2 && nameRegex.test(name) && name === name.trim()) {
                result.matchType = 3;
                result.data.name = name;
            }
        }
    }

    return result;
}
export default parseInput;