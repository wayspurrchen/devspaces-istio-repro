// "functionality" used loosely

export const entry = (fail, ...args) => {
    return func2(fail, ...args);
};

const func2 = (fail, ...args) => {
    return func3(fail, ...args);
};
const func3 = (fail, ...args) => {
    if (fail === true) {
        throw new Error('Bad choices!');
    } else if (typeof fail === 'number') {
        var d = Math.random();
        if (d <= fail) {
            throw new Error('Bad luck!');
        }
    }
    return func4(...args);
};
const func4 = (...args) => {
    return func5(...args);
};
const func5 = (...args) => {
    return {
        "result": true,
        "arguments": args
    };
};
