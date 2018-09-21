// default settings. fis3 release

// Global start
fis.match('*.{js,css}', {
  useHash: true
});

fis.match('::image', {
  useHash: true
});

fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

fis.match('*.{less,sass}', {    
  parser: fis.plugin('less'),   // fis-parser-less 插件进行解析 
  rExt: '.css',  // .less 文件后缀构建后被改成 .css 文件
  isCssLike: true
});
// Global end

// default media is `dev`
fis.media('dev')
  .match('*', {
    useHash: false,
    optimizer: null
  });

// extends GLOBAL config
fis.media('production');

//发布时，忽略项目中的这些文件
fis.set('project.ignore', ['.git/**', 'fis-conf.js', 'package.json','README.md']);
