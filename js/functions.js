(function($) {
	$.validate = function($formEl) {
		var elVal = $formEl.val().trim(),
			valFunctions = $formEl.data('validation-functions').split(';'),
			valParamsString = $formEl.data('validation-params'),
			valParams = typeof valParamsString !== 'undefined' ? valParamsString.split(';') : {},
			valMessagesString = $formEl.data('validation-message'),
			valMessages = typeof valMessagesString !== 'undefined' ? valMessagesString.split(';') : '',
			valResults = [];

		if (!valFunctions) return;

		valFunctions.forEach((valFunc, idx) => {
			var params = (!valParams[idx]) ? {} : $.parseJSON(valParams[idx]);

			if (valFunc.includes('!')) {
				valFunc = valFunc.replace('!', '');
				isInvalid = !validator[valFunc](elVal, params);
			} else {
				isInvalid = validator[valFunc](elVal, params);
			}

			if (isInvalid) {
				valResults.push({
					isValid: false,
					message: valMessages[idx] 
				});
			} else {
				valResults.push({
					isValid: true,
				});
			}
		});

		return valResults;
	}

	let count = 1;
	$.formPost = function() {
		var dfd = $.Deferred();
		const success = !!(count++ % 2);

		setTimeout(() => {
			if (!success) return dfd.reject({success});

			return dfd.resolve({success});
		}, 1000);

		return dfd.promise();
	}

	$.scrollPageTo = function(div,offsetTop,callback){

		if(typeof offsetTop != 'undefined')
			topPos = parseInt(div.offset().top + offsetTop);
		else
			topPos = parseInt(div.offset().top - 140);

		$("html, body").animate({scrollTop:topPos}, 500,function(){
			if(typeof callback != 'undefined')
				callback.call()
		});
	};
}) (jQuery);

$(function() {
	$('#down').click(function() {
		$.scrollPageTo($('#about'));
	});

	$('form').submit(function(e) {
		e.preventDefault();

		var errors = 0,
			$inputs = $('.input');

		$inputs.each(function() {
			var $this = $(this);

			$.each($.validate($this), function(idx, result) {
				$this.removeClass('invalid');

				if (!result.isValid) {
					$this.addClass('invalid');
					alertify.error(result.message);
					errors++;
				} 
			});
		});

		if (errors) 
			return;

		$('body').append('<div class="overlay"></div>');
		$.formPost()
			.done(function(result) {
				console.log(result)
				alertify.success('Form successfully submitted!');
				$inputs.val('');
			})
			.fail(function(result) {
				console.log(result)
				alertify.error('Something went wrong. Please try again later.');
			})
			.always(function() {
				$('.overlay').remove();
			});
	});
});