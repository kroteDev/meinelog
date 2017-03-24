// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require jquery-ui/widgets/datepicker
//= require jquery-ui/i18n/datepicker-pt-BR
//= require bootstrap-sprockets
//= require_tree .

$.datepicker.setDefaults({
	autoclose: true,
	clearBtn: true,
	dateFormat : 'yy-mm-dd',
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true,
	yearRange: "-60:+0"
	
	}, $.datepicker.regional[ "pt-BR" ]);
$(document).on('turbolinks:load', function() {
	$('#activity_day').datepicker();
});