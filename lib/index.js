'use strict'

var loaderUtils = require("loader-utils");
var fs = require('fs')
var path = require('path')

Object.defineProperty(exports, '__esModule', {
    value: true
})

var warning = function (content) {
    console.log('\x1B[33m%s\x1b[0m:', ['\r\n[Vue-i18n-fileoutputer]', content].join(''))
}

var parse = function (content) {
    try {
        content = JSON.parse(content)
    } catch (err) {
        warning(err)
        warning(content)
        content = {}
    }
    return content
}

var forEach = function (objects, fn) {
    for (var name in objects) {
        fn(objects[name], name)
    }
}

var merge = function (source, addon) {
    forEach(addon, function (value, key) {
        if (!!source[key] && value !== source[key]) {
            warning('Dunplicate key of \'', key, '\' merged from \'', source[key], '\' to \'', value, '\'.')
        }
        source[key] = addon[key]
    })
    return source
}

exports.default = function (content) {
    var options = loaderUtils.getOptions(this)
    var dir = path.resolve(options.dir)
    var prod = options.prod
    var component = this.resource.replace(path.resolve(''), '').replace(/\//gi, '.')
    var json = typeof content === 'string' ? parse(content) : content
    if (!!prod) {
        fs.mkdir(dir, function () {
            forEach(json, function (data, lang) {
                fs.writeFile(dir + '/tmp/' + lang + '.' + component + '.json', JSON.stringify(data), function () {
                })
            })
        })
    }

    if (this.version && this.version >= 2) {
        try {
            this.cacheable && this.cacheable()
            this.callback(null, 'module.exports = ' + generateCode(content, prod))
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

function generateCode(content, prod) {

    var value = typeof content === 'string' ? parse(content) : content
    value = JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/\\/g, '\\\\')

    return !!prod ? 'function (Component) {\n\n}\n' : 'function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push(\'' + value.replace(/\u0027/g, '\\u0027') + '\')\n  delete Component.options._Ctor\n}\n'
}
