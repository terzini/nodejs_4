function getCsvParserOptions() {
    return {
        delimiter: "", // auto-detect
        newline: "", // auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: true,
        trimHeader: true,
        skipEmptyLines: true,
        dynamicTyping: true
    }
}

exports.getCsvParserOptions = getCsvParserOptions;