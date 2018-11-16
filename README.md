# vue-i18n-loader2
🌍 inspire by vue-i18n-loader

### Important ⚠️

*issue TODO*

* not support `!`

due loader, e.g `vue-loader!vue-i18n-loader?{'a': 'a!'}`

Below not work.

```json
{"Hello": "你们好!"}
```

* you may need build twice

due webpack work async, you lang file may loaded into project at first time.

the first time you build, all locale in components will be extracted and merged, but not loaded into webpack fully.

the second time you build, it's all ok.

### In dev mode

It works just like 'vue-i18n-loader'

### In prod mode

- 'i18n' tag will be removed
- content in 'i18n' tag will be merge into target json file(s)
- support using 'extend' to cover content in 'i18n' tag
- support using 'extend' to translate content into different language

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

- in webpack config

```javascript
vueLoaderConfig.loaders['i18n'] = [{
  loader: 'vue-i18n-extend-loader',
  options: {
    target: 'src/lang', // require
    character: 'utf-8', // default: utf-8
    extend: {
      'zh-cn': {
        'Hello': '你们好'  
      },
      en: {
        'Hello': 'Hello everyone'
      }
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

* Import these json file to project with 'vue-i18n' or 'vue-i18n-async'

- vue-i18n-async https://github.com/chiaweilee/vue-i18n-async
