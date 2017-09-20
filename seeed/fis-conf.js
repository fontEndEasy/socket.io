fis.match('*.{js,css,png}', {
	useHash: true
});
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});
fis.match('*', {
	deploy: fis.plugin('http-push', {
		receiver: 'http://ui.phpstudy.cris:8082/receiver.php',
		to: 'D:/wamp/www/seeed'
	})
});