function globalCode() {
    this.code = ""
    this.getCode = function () {
        return this.code
    }
    this.setCode = function (code) {
        this.code = code
    }
}

module.exports = globalCode