# vue-i18n-extend-loader
🌍 inspire by vue-i18n-loader

### In dev mode

It works just like 'vue-i18n-loader'

### In prod mode

- 'i18n' tag will be removed
- content in 'i18n' tag will be merge into target json file(s)
- support using 'extend' to merge cover content in 'i18n' tag
- support using 'extend' to transfer content into different language

# Install

> npm install vue-i18n-extend-loader --save-dev

# Usage

- in Vue component

```vue
<i18>
{
    "zh-cn": {
        "你好": "你好"
    }
}
</i18>
```

- in webpack config

```javascript
vueLoaderConfig.loaders['i18n'] = [{
  loader: 'vue-i18n-extend-loader',
  options: {
    target: 'src/lang', // require
    character: 'utf-8', // default: utf-8
    extend: {
      'zh-cn': {
        '你好': '您好'  
      },
      en: {
        '你好': 'Hello'
      }
    }
  }
}]
```

### result

- zh-cn.json

```json
{"你好": "您好"}
```

- en.json

```json
{"你好": "Hello"}
```

* Import these json file to project with 'vue-i18n' or 'vue-i18n-async'

- vue-i18n-async https://github.com/chiaweilee/vue-i18n-async
