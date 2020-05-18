class Logger {
    constructor(levels) {
        this.levels = levels; // ["db", "routers"]
    }

    log(level, message) {
        if (this.levels.includes(level)) {
            console.log(message);
        }
    }
}

module.exports = Logger;