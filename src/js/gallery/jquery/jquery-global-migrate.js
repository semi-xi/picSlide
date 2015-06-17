seajs.use("gallery/jquery-plugin/jquery-migrate", function($) {
	if (!window.jQuery) window.jQuery = $;
	if (!window.$) window.$ = $;
});