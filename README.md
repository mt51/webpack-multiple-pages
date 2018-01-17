# webpack 打包vue多页面应用

### quickstart

``` bash
#clone registry
git clone git@192.168.10.92:liuziyang/vue-multiple.git

cd vue-multiple

# install dependencies
npm install

# serve with hot reload at localhost:8000
npm run dev

# build for production with minification
npm run build

```

### use

##### 项目结构

项目结构类似 `vue` 单页应用配置

src： 项目源文件

src/components : 通用组件

src/views/** : 页面文件

src/views/** /index.js: 页面的入口文件

src/views/** /app.vue : 使用单文件组件时的根组件

打包时会针对 src/views 目录下的子文件夹生成对应的页面，页面名称与文件夹名称相同。

##### 单文件组件

项目中可以使用单文件组件，需要在每个文件夹下提供根组件组件

示例： 

``` js

// ~src/views/index/app.vue

<template>
  <div class="index"></div>
</template>

export default {
  beforeCreate () {
    document.title = 'vue 多页面应用开发'
  },
}

```

注意： 由于使用的html模板文件统一是项目根目录下的index.html,所以对应的title应该在每个页面的根组件中使用 `document.title` 来修改。


``` js
// 入口文件
// ~src/views/index/index.js

import Vue from 'vue'
import App from './app.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})


```

注意：入口文件名称统一使用了index.js