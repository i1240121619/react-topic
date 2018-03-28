var webpack = require("webpack");
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");//抽离css模块
var HtmlWebpackPlugin = require('html-webpack-plugin');//生成html模块
var TransferWebpackPlugin = require('transfer-webpack-plugin');//复制文件夹到build目录模块
var CopyWebpackPlugin = require('copy-webpack-plugin');//复制文件到build目录模块

// 定义函数判断是否是在当前生产环境，这个很重要，开发环境和生产环境配置上有一些区别
var config = {
  entry:{
    'specialProject/specialEdit/specialEditApp': ['./src/app/specialEditApp.js'],
    'specialProject/special/specialApp': ['./src/app/specialApp.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
      loader: 'babel', // 加载模块 "babel" 是 "babel-loader" 的缩写
      query: {
        presets: ['es2015','react']
      }
    },{
      test: /\.(gif|jpg|png|woff|svg|eot|ttf).*$/,
      loader: 'url-loader?limit=90000&name=[path][name].[ext]'
    },{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader","css-loader")
    }]
  },
  devServer: {
    disableHostCheck: true
  },
  resolve: {
    extensions:['','.js','.json'],
    alias: {
      wxJsdk:  path.resolve(__dirname, "src/tool/wxJsdk"),
      tool:  path.resolve(__dirname, "src/tool/tool"),
      head:  path.resolve(__dirname, "src/tool/head"),
      common:  path.resolve(__dirname, "src/tool/common"),
      lazyload: path.resolve(__dirname, "src/lib/lazyload"),
    }
  },
  plugins: [
    new ExtractTextPlugin('[name].min.css'),
    new TransferWebpackPlugin([{from: 'specialhtml',to: './specialProject/specialhtml'}], path.resolve(__dirname,"src")),
    new CopyWebpackPlugin([
      {from: './src/images/favicon.ico',to: './' },
      {from: './src/constants/ypConfig.js',to: './' },
      {from: './src/images/icon_1.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/icon_2.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/icon_3.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/banner2.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/banner1.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/icon_4.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/banner3.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/default_banner.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/loading.gif',to: './specialProject/specialEdit/images'},
      {from: './src/images/error.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/jqueryminicolors.png',to: './specialProject/specialEdit/images'},
      {from: './src/images/default_banner.png',to: './specialProject/special/images'},
    ]),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      wxJsdk: 'wxJsdk',
      tool: 'tool',
      common: 'common',
      head: 'head',
    })

  ]
};
if(process.env.NODE_ENV === 'production') {
  //压缩js与css
  var uglifyJsPlugin=new webpack.optimize.UglifyJsPlugin({
    output: {
      comments: false,
    },
    compress: {
      warnings: false,
      drop_debugger: true,
      drop_console: true
    }
  });
  config.plugins.push(uglifyJsPlugin);
}//if

//模板定义与模板配置 FolderName：文件夹名称，title：模板标题
var templateArr=[
  {FolderName:'specialEdit',title:'',app:'specialProject/specialEdit/specialEditApp'},
  {FolderName:'special',title:'',app:'specialProject/special/specialApp'}
];

templateArr.map(
    (templateJson) =>{
      var htmlWebpackPlugin=new HtmlWebpackPlugin({
        title: templateJson.title,
        filename: 'specialProject/'+templateJson.FolderName+'/'+templateJson.FolderName+'.html',
        template: './src/template/'+templateJson.FolderName+'/'+templateJson.FolderName+'.ejs',
        inject:'body',
        hash:true,
        minify:{removeComments:true,collapseWhitespace:true},
        chunks:[templateJson.app],
      })
      config.plugins.push(htmlWebpackPlugin);
    }//map
)

module.exports = config;


