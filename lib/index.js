'use strict'

var loaderUtils = require("loader-utils");
var fs = require('fs')

Object.defineProperty(exports, '__esModule', {
    value: true
})

var warning = function (content) {
    console.log('\x1B[33m%s\x1b[0m:', ['\r\n[Vue-i18n-outputloader]', content].join(''))
}

var _parse = function (content) {
    var _content
    try {
        _content = JSON.parse(content)
    } catch (err) {
        warning(err)
        warning(content)
        _content = {}
    }
    return _content
}

var write = function (filename, content) {
    fs.writeFile(filename, JSON.stringify(content), function () {})
}

var _forEach = function (objects, fn) {
    for (var name in objects) {
        fn(objects[name], name)
    }
}

var writeLang = function (dir, lang, content) {
    fs.mkdir(dir, function () {
        var _dir = [dir, '/', lang].join('')
        fs.mkdir(_dir, function () {
            var filename = [_dir, '/', Math.random() * 10000000000, '.json'].join('')
            write(filename, content)
        })
    })
}

exports.default = function (content) {
    var options = loaderUtils.getOptions(this)
    var _root = this.options.context
    var _dir = options.dir || 'lang'
    var dir = [_root, '/', _dir].join('')
    var _content = typeof content === 'string' ? JSON.parse(content) : content
    if (options.build === true) {
        _forEach(_content, function (c, lang) {
            writeLang(dir, lang, c)
        })
    }

    if (this.version && this.version >= 2) {
        try {
            this.cacheable && this.cacheable()
            this.callback(null, 'module.exports = ' + generateCode(content))
        } catch (err) {
            this.emitError(err.message)
            this.callback(err)
        }
    } else {
        var message = 'support webpack 2 later'
        this.emitError(message)
        this.callback(new Error(message))
    }
}

function generateCode (content) {
    var code = ''

    var value = typeof content === 'string' ? JSON.parse(content) : content
    value = JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/\\/g, '\\\\')

    code += 'function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push(\'' + value.replace(/\u0027/g, '\\u0027') + '\')\n  delete Component.options._Ctor\n}\n'
    return code
}
