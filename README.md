# vue-i18n-loader2

[![Greenkeeper badge](https://badges.greenkeeper.io/chiaweilee/vue-i18n-loader2.svg)](https://greenkeeper.io/)

🌍 inspire by vue-i18n-loader

### issue TODO ⚠️

1. NOT SUPPORT `!`

due loader, e.g `vue-loader!vue-i18n-loader?{'a': 'a!'}`

### In dev mode

It works just like [@kazupon/vue-i18n-loader](https://github.com/kazupon/vue-i18n-loader)

### In prod mode

when you `run build`

- 'i18n' tag will be removed
- content in 'i18n' tag will be merge into target json file(s)
- support using 'extend' to cover content in 'i18n' tag
- support using 'extend' to translate content into different language
- then, try load your locale file with `vue-i18n`

# Install

> npm install vue-i18n-loader2 --save-dev

# Usage

- in Vue component

```vue
<i18>
{
    "zh-cn": {
        "Hello": "Hello"
    }
}
</i18>
```

- vue webpack config (vue-cli 2.9.x)

```javascript
vueLoaderConfig.loaders['i18n'] = [{
  loader: 'vue-i18n-loader2',
  options: {
    quite: false, // ignore different value merged warning
    target: 'src/lang', // extract target
    character: 'utf-8', // default: utf-8
    mirror: { // clone locale
        source: 'zh-cn',
        target: 'en'
    },
    extend: {
      'zh-cn': {
        'Hello': '你们好'  
      },
      en: {
        'Hello': 'Hello everyone'
      },
      jp: require('../src/lang-extend/jp-translate-from-others.json')
    }
  }
}]
```

### result

- zh-cn.json

```json
{"Hello": "你们好"}
```

- en.json

```json
{"Hello": "Hello everyone"}
```
