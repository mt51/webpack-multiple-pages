## vue 多页面项目配置
一直是使用vue官方提供的脚手架工具来做开发单页应用，突发奇想的想做一个多页应用的打包配置，顺便了解一下webpack的使用。花了几天时间搞定之后才发现了这篇文章[《进阶| Vue 2.x + Webpack 3.x + Nodejs 多页面项目框架（上篇）》](http://mp.weixin.qq.com/s/SDsvzL2uqUSxHgeVhiyF2g)。但还是要记录一下自己搭建的过程。代码地址：[https://github.com/lzy1043/webpack-multiple-pages](https://github.com/lzy1043/webpack-multiple-pages)。

### 代码结构

build目录下是webpack的配置文件
src/components目录下是通用的组件
src/views下是应用的页面

![图片描述][1]

打包前多页面的目录结构：

![图片描述][2]

打包之后的生成的项目结构：

![图片描述][3]



代码里面的ESlint和babel的配置是直接使用的vue-cli中的配置。

### 配置多入口

#### 1.多页面目录结构

多页应用就代表着需要有多个入口，webpack的entry支持多入口，使用entry的对象语法对每个页面设置入口。类似下面这种写法：

``` js
entry: {
  home: "./home.js",
  about: "./about.js",
  contact: "./contact.js"
}
```
但是我们这里需要使用node的fs模块来取得所有需要进行配置的页面。

可以看到这里有四个页面index,home,about和news，然后每一个页面中都有一个模板文件，一个入口js文件，其实这里的html模板文件都可以使用同一个，后面会做一些修改。每个目录下还应该有一个根vue组件。比如index目录下的app.vue。


#### 2.获取views目录下的多页面，生成入口配置

config/index.js ：生成多页面的入口配置

首先，读取多页面目录，找出其中需要配置入口的页面

``` js
// 设置基础目录
const baseDir = path.resolve(__dirname, '../src/views')

// excludeDir 是用来配置忽略哪些文件夹，不生成入口文件，这里由于index打包后的目录有些特殊需要单独设置
const excludeDir = ['index']

// 取到所有页面，目录名称
const viewArr = fs.readdirSync(baseDir).filter(dir => {
 return excludeDir.indexOf(dir) === -1 && fs.statSync(baseDir + '/' + dir).isDirectory()
})

```

首页的入口配置： 

``` js 
let entriesConfig = [{
  entryName: 'index',
  entry: path.resolve(baseDir, 'index/index.js'),
  filename: 'index.html',
  template: path.resolve(baseDir, 'index.html')
}]
```

然后对取出的页面做遍历生成入口名称，入口配置，模板名称，模板路径

``` js
viewArr.forEach(dir => {
  // 入口文件
  const enrtyFile = dir + '.js'
  // 模板文件名称，
  const filename = dir + '/' + dir + '.html'
  entriesConfig.push({
    //入口名称
    entryName: dir,
    //入口文件
    entry: path.resolve(baseDir, dir, enrtyFile),
    // 打包生成的模板名称，如果filename包含路径信息会创建对应的路径
    //比如about这个页面左后打包的结果是： /dist/about/about.html
    filename: filename,
    //html模板的路径
    template: path.resolve(baseDir, filename)
  })
})
```
最后将入口的配置
``` js
module.exports = entriesConfig
```
这样多页面的入口配置就完成了，下面就需要配置webpack开发环境的打包环境的配置了。

#### 3.配置开发环境和打包环境
首先是做了一个基础的配置，包括入口和module，module.rules这一块使用的也是vue-cli生成的项目所有的配置，不做过多的赘述，直接看代码。
``` js
// webpack.base.conf.js
const path = require('path')
const entriesConfig = require('../config')
let entries = {}

entriesConfig.forEach(item => {
  entries[item.entryName] = item.entry
})

module.exports = {
  entry: entries,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

```
 其次，开发环境下主要是需要配置一个热更新的部分，这部分也是参考了vue-cli中的配置， 使用express + webpack-dev-middleware + webpack-hot-middleware。使用的方法webpack中讲的也很清楚，大家可以自己看一下，我把链接贴在这：
* [Using webpack-dev-middleware](https://webpack.js.org/guides/development/#using-webpack-dev-middleware)

* [webpack-dev-middleware文档](https://github.com/webpack/webpack-dev-middleware)

* [webpack-hot-middleware文档](https://github.com/glenjamin/webpack-hot-middleware)


最后就是打包的配置，在打包的匹配值中需要注意的一点就是需要根据生成的入口文件中的filename和template自动生成对应的页面，可以使用html-webpack-plugin来生成。其余的配置都和vue的单页应用类似。


``` js
//部分代码
entriesConfig.forEach(item => {
  const option = {
    filename: item.filename,
    template: item.template,
    chunks: ['vendor', item.entryName]
  }
  webpackConfig.plugins.push(new HtmlWebpackPlugin(option))
})
```

差不多就是这些。

### 使用
1. 使用单文件组件

在每个页面文件夹下新增一个.vue的根组件，然后在入口文件中导入根组件，然后实例化Vue对象挂载等。

2.不使用单文件组件
直接在入口文件中实例化Vue对象。



代码地址：[https://github.com/lzy1043/webpack-multiple-pages](https://github.com/lzy1043/webpack-multiple-pages)。


  [1]: https://sfault-image.b0.upaiyun.com/377/728/3777288807-5a4271a2edeae_articlex
  [2]: https://sfault-image.b0.upaiyun.com/103/180/1031808829-5a5cc24bddd5a_articlex
  [3]: https://sfault-image.b0.upaiyun.com/313/956/3139561987-5a5cc2d148c60_articlex