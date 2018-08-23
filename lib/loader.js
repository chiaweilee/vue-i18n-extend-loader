'use strict'

var loaderUtils = require('loader-utils')
var fs = require('fs')
var path = require('path')

Object.defineProperty(exports, '__esModule', {
    value: true
})

var warning = function (content) {
    if (!content) return
    process.stdout.write(content)
}

var parse = function (content) {
    try {
        content = JSON.parse(content)
    } catch (err) {
        console.error(err)
    }
    return content
}

var forEach = function (objects, fn) {
    for (var name in objects) {
        fn(objects[name], name)
    }
}

var merge = function (source, addon, ignore, quite) {
    forEach(addon, function (value, key) {
        if (!quite && !!source[key] && value !== source[key]) {
            warning('\r\ndunplicate merged: ' + key + ' : ' + source[key].red + ' => ' + value + '}\r\n')
        }
        if (!!ignore && !addon[key] || !addon[key].length) {
            return
        }
        source[key] = addon[key]
    })
    return source
}

var isI18nLike = function (json) {
    function verify (json) {
        var result = true
        forEach(json, function (value) {
            if (typeof value !== 'object') {
                result = false
            }
        })
        return result
    }

    return typeof json === 'object' && verify(json)
}

var resolve = function (_) {
    return path.resolve(_)
}

var prod = process.env.NODE_ENV === 'production'

exports.default = function (content) {
    var message
    // resolve content
    content = typeof content === 'string' ? parse(content) : content
    // is i18n json like
    if (!isI18nLike(content)) {
        // error
        message = 'not a i18n-like json'
        this.emitError(message)
        this.callback(new Error(message))
        return
    }

    var read = function (targetJson) {
        // try read
        var orgin
        try {
            fs.accessSync(targetJson, fs.constants.R_OK | fs.constants.W_OK)
            orgin = parse(fs.readFileSync(targetJson, option.character || 'utf-8'))
        } catch (err) {
            // can not access to target
            orgin = {}
        }
        return orgin
    }

    if (prod) {
        // resolve target option
        var option = loaderUtils.getOptions(this)
        var target = resolve(option.target)
        var mirror = option.mirror

        // mkdir
        try {
            fs.accessSync(target, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
            // can not access to target
            // try mkdir
            fs.mkdirSync(target)
            try {
                fs.accessSync(target, fs.constants.R_OK | fs.constants.W_OK)
            } catch (err) {
                this.emitError(err)
                this.callback(err)
                return
            }
        }

        // forEach i18n key
        var mergeError = []
        forEach(content, function (langData, langKey) {
            // try read
            var targetJson = resolve(target + '/' + langKey + '.json')
            var orgin = read(targetJson)
            // merge and write
            try {
                orgin = merge(orgin, langData, option.ignoreEmpty, option.quite)
                fs.writeFileSync(targetJson, JSON.stringify(orgin), {encoding: option.character || 'utf-8'})
                if (typeof mirror === 'object' && !!mirror.target && mirror.source === langKey) {
                    // mirror
                    const mirrorJson = resolve(target + '/' + mirror.target + '.json')
                    fs.writeFileSync(mirrorJson, JSON.stringify(orgin), {encoding: option.character || 'utf-8'})
                }
            } catch (err) {
                mergeError.push(err)
            }
        })
        // error reporter
        if (mergeError.length > 0) {
            const _this = this
            forEach(mergeError, function (err) {
                _this.emitError(err)
                _this.callback(err)
            })
            return
        }

        // merge extend
        if (option.extend) {
            var extend = typeof option.extend === 'string' ? parse(option.extend) : option.extend
            forEach(extend, function (extendLangData, extendLangKey) {
                // try read
                var targetJson = resolve(target + '/' + extendLangKey + '.json')
                var orgin = read(targetJson)
                // merge and write
                try {
                    orgin = merge(orgin, extendLangData, option.ignoreEmpty, option.quite)
                    fs.writeFileSync(targetJson, JSON.stringify(orgin), {encoding: option.character || 'utf-8'})
                } catch (err) {
                    mergeError.push(err)
                }
            })
        }
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
        message = 'support webpack 2 later'
        this.emitError(message)
        this.callback(new Error(message))
    }
}

function generateCode (content) {

    var value = typeof content === 'string' ? parse(content) : content
    value = JSON.stringify(value).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029').replace(/\\/g, '\\\\')

    return prod ? 'function (Component) {\n\n}\n' : 'function (Component) {\n  Component.options.__i18n = Component.options.__i18n || []\n  Component.options.__i18n.push(\'' + value.replace(/\u0027/g, '\\u0027') + '\')\n  delete Component.options._Ctor\n}\n'
}
