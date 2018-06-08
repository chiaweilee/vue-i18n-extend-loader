'use strict'

var loaderUtils = require("loader-utils");
var fs = require('fs')

var write = function (filename, content, merge) {
    var _data = merge || {}
    _data = _merge(content, _data)
    fs.writeFile(filename, JSON.stringify(_data), function () {})
}

var _forEach = function (objects, fn) {
    for (var name in objects) {
        fn(objects[name], name)
    }
}

var _merge = function (object, addon) {
    _forEach(object, function (value, key) {
        if (!!addon[key] && value !== addon[key]) {
            if (value !== addon[key]) {
                var warning = ['\r\n[Vue-i18n-outputloader]Dunplicate key of \'', key, '\' merged from \'', value, '\' to \'', addon[key], '\'.'].join('')
                console.log('\x1B[33m%s\x1b[0m:', warning)
            }
            object[key] = addon[key]
        }
    })
    return object
}

Object.defineProperty(exports, '__esModule', {
    value: true
})

var writeLang = function (dir, lang, content) {
    fs.mkdir(dir, function () {
        var _filename = [dir, '/', lang, '.json'].join('')
        // dir created
        fs.readFile(_filename, 'utf8', function (err, data) {
            if (err) {
                // file not found
                write(_filename, content)
            } else {
                // file found
                var _data
                try {
                    _data = JSON.parse(data)
                } catch (err) {
                    console.error(err)
                }
                write(_filename, content, _data)
            }
        })
    })
}


exports.default = function (content) {
    var options = loaderUtils.getOptions(this)
    var _root = this.options.context
    var _dir = options.dir || 'lang'
    var dir = [_root, '/', _dir].join('')
    var _content = typeof content === 'string' ? JSON.parse(content) : content
    _forEach(_content, function (c, lang) {
        writeLang(dir, lang, c)
    })

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
