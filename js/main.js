var filter_base_url;

$('document').ready(function() {
	
	$('body').on('click', '.showTable', function () {
        if ($(this).attr('data-table')) {
            var _scroll = $(this).data('scroll');
            var _table = $('#'+$(this).attr('data-table'));
			_table.toggleClass('show');
			
			if (_table.html() == '') {
				$.ajax({
					url: $(this).data('url'),
					type: 'get',
					success: function(response) {
						_table.html(response);
					}
				})				
			}

			if (_scroll == '1') {
				$('html, body').animate({
					scrollTop: ($("#blockVehicleTable").offset().top - 100)
				}, 200);
			}
			
        }
    });	
	
	$('body').on('click', '.js-link', function(){
		window.location = $(this).attr('url');
	})
	
	$('body').on('click', '.js-link-ajax', function(){
		var _url = $.trim($(this).attr('url'));
		if (_url == '') {
			return;
		}
		
		$.ajax({
			url: _url,
			type: 'get',
			success: function(response) {
				$('#vehicleTable').html(response);
			}
		})
		
	})
	
	$('body').on('click', '.js-add-to-basket', function(){
		var _self = $(this);
		
		$.ajax({
			url: '/ajax/basket-add?id=' + _self.data('id'),
			type: 'get',
			success: function(response) {
				window.location = '/order-page';
			}
		})
		
	})
	
	$('#subscription-form').submit(function(e){
		e.preventDefault();
		var form = $(this);
		$.ajax({
			url: '/site/subscription',
			dataType: 'json',
			data: form.serialize(),
			type: 'post',
			success: function(response) {
				$('.form-error', form).hide();
				if (response.success == 1) {
					$('#subscription-success').show().html(response.message).fadeOut(5000);
					form.trigger('reset');
				} else {
					errs = '';
					$.each(response.errors, function(k,v) {
						errs += v + "<br/>";
						$('#error-subscription-'+k).text(v).css('display','block');
					})
				}
			}
		})
	})

	$('.js-select-per-page').change(function(e){
		$.ajax({
			url: '/ajax/set-per-page?per_page='+$(this).val(),
			dataType: 'text',
			type: 'post',
			success: function(response) {
				f_url = decodeURI($('#form-filter').serialize());
				var url = filter_base_url;
				if (f_url != '') {
					url = url + '?' + f_url;
				}
				
				window.location = url;
			}
		})
	})

	$('.js-checkbox-filter').change(function(e){
		var _filters = $('#form-filter').serialize();
		window.location = filter_base_url + '?' + decodeURI(_filters);
	})

	$('.category__slider').slick({
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		dots:true,
		arrows:true
	  });
	  $('.slider').slick({
		infinite: true,
		autoscroll:true,
		slidesToShow: 1,
		slidesToScroll: 1,
		dots:false,
		arrows:false
	  });

	  $('[class^="#tabs-"]').click(function(){
	  $('[id^="tabs-"]').toggleClass('active');
	  $('.tabs_caption li').toggleClass('active');

	  });

})

function submitFormContact() {
	form = $('#form-contact');
	
	$.ajax({
		url: window.location,
		dataType: 'json',
		data: form.serialize(),
		type: 'post',
		success: function(response) {
			$('.error', form).hide();
			$('.js-form-info', form).hide();
			
			if (response.success == 1) {
				$('#form-contact-success').html(response.message).show().fadeOut(5000);
				form.trigger('reset');
			
			} else if (response.success == -1) {
				$('#form-contact-warning').html(response.error).show();
				form.trigger('reset');
			} else {
				$.each(response.errors, function(k,v) {
					field = $('#contactform-'+k);
					error = field.next();
					error.text(v).show();
				})
			}
 		}
	})
}

function submitFormOrder() {
	form = $('#form-order');
	
	$.ajax({
		url: window.location,
		dataType: 'json',
		data: form.serialize(),
		type: 'post',
		success: function(response) {
			$('.error', form).hide();
			$('.js-form-info', form).hide();
			$('.form-error', form).hide();
			
			if (response.success == 1) {
				$('#form-order-success').html(response.message).show().fadeOut(5000);
				form.trigger('reset');
			
			} else if (response.success == -1) {
				$('#form-order-warning').html(response.error).show();
				form.trigger('reset');
			} else {
				$.each(response.errors, function(k,v) {
					field = $('#order-'+k);
					error = field.next();
					error.text(v).show();
				})
			}
 		}
	})
}
