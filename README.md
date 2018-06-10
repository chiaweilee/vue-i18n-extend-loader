# vue-i18n-outputloader
Output i18n message into file from <i18n> for Vue-I18n

# Install
> npm install vue-i18n-outputloader --save-dev

# Usage
- in webpack config
```javascript
if (process.env.NODE_ENV !== 'production') {
  vueLoaderConfig.loaders['i18n'] = [{
    loader: 'vue-i18ndev-outputloader',
    options: {
      dir: 'myLangDir', // dir name to output
      build: process.env.NODE_ENV === 'production' // build lang, bool
    }
  }]
}
```
