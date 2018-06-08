'use strict'

var fs = require('fs')
var _merge = require('lodash/merge')
var _forEach = require('lodash/forEach')

Object.defineProperty(exports, '__esModule', {
  value: true
})

var writeLang = function (dir, lang, content) {
  fs.mkdir(dir, function () {
    var _filename = [dir, '/', lang, '.json'].join('')
    var write = function (data) {
      var _data = data || {}
      _data = _merge(content, _data)
      fs.writeFile(_filename, JSON.stringify(_data), function () {})
    }
    // dir created
    fs.readFile(_filename, 'utf8', function (err, data) {
      if (err) {
        // file not found
        write()
      } else {
        // file found
        var _data
        try {
          _data = JSON.parse(data)
        } catch (err) {
          console.error(err)
        }
        write(_data)
      }
    })
  })
}


exports.default = function (content) {
  var _root = this.options.context
  var _dir = 'lang'
  var dir = [_root, '/', _dir].join('')
  var _content = typeof content === 'string' ? JSON.parse(content) : content
  _forEach(_content, function (c, lang) {
    console.log(c)
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
