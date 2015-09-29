'use strict';

$(document).ready(function() {

// Nav toggle
$('.js-toggle-nav').on('touchstart click', function(e) {
    e.preventDefault();

    var $sitenav = $('.sitenav');

    if($sitenav.hasClass('active')) {
        $sitenav.removeClass('active');
    } else {
        $sitenav.addClass('active');
    }
});

    if ($('.main-gallery').length) {

        $('.main-gallery').flickity({
            // options
            cellAlign: 'center',
            contain: true
        });

    }

    // Product sort
    $(document).on('change', 'select[data-sort-redirect]', function() {
        var path = window.location.pathname + '?' + $(this).val(),
            baseUrl = window.location.protocol + '//' + window.location.host;
        window.location = baseUrl + path;
    });

    (function($) {
        $(document).on('click', '.js-thumblist a', function(e) {
            e.preventDefault();
            var $el = $(this);
            var target = $el.closest('.js-thumblist').data('target');
            var $target = $(target);
            var src = $el.attr('href');
            $el.parent().addClass('selected').siblings().removeClass('selected');
            $target.attr('src', src);
        });
    })(jQuery);

    $(document).on('click', '.js-addtocart', function(e) {

        e.preventDefault();

        $(this).sendRequest('shop:onAddToCart', {
            update: {
                '#mini-cart': 'shop-minicart',
                '#product-page': 'shop-product',
                // '#modal-minicart': 'modal-minicart'
            },
            onAfterUpdate: function() {
                $('#modal-minicart').removeClass('hide');
            }
        });
    });

    $('body').on('click', '.js-modalclose', function() {
        $('#modal-minicart').addClass('hide');
    });

    (function($, window, document, undefined) {

        var $doc = $(document);
        var $chk = $doc.find('.js-mirrordata');

        $chk.on('click', function() {

            if (!$(this).is(':checked')) {
                $(this).data('toggle-mirror', 'off').find('.fa-check').css('visibility', 'hidden');
                sessionStorage.toggleMirror = 'off';

                $('#shipping-info').find('[data-mirror]').each(function(j, element) {
                    $(element).removeClass('disabled');
                });

            } else {
                $(this).data('toggle-mirror', 'on').find('.fa').css('visibility', 'visible');
                sessionStorage.toggleMirror = 'on';
                mirrorAll();

                $('#shipping-info').find('[data-mirror]').each(function(j, element) {
                    $(element).addClass('disabled');
                });
            }
        });

        // mirror toggle button
        $(window).on('onAjaxAfterUpdate', function() {
            if ($chk.length && sessionStorage.toggleMirror == 'off') {
                $chk.data('toggle-mirror', 'off').find('.fa').css('visibility', 'hidden');
                $('#shipping-info').addClass('in');
            }
        });

        //mirror source and destination fields
        function mirrorFields($mirrorSource, $mirrorTarget, event) {
            $($mirrorSource).each(function(idx) {
                $(this).on(event, function() {
                    var mirrorVal = $(this).val();
                    if ($chk.is(':checked')) {
                        $($mirrorTarget + ':eq(' + idx + ')').val(mirrorVal);
                    }
                });
            });
        }

        //mirror all fields
        function mirrorAll() {
            $('#billing-info [data-mirror]').each(function(idx) {
                var mirrorVal = $(this).val();
                $('#shipping-info [data-mirror]:eq(' + idx + ')').val(mirrorVal);
            });
            //trigger change to update the state list
            $('#shipping_country[data-mirror]').trigger('change');
        }

        $(window).load(function() {

            if (sessionStorage.toggleMirror == 'on') {
                $chk.click();
            }

            mirrorFields('#billing-info [data-mirror]', '#shipping-info [data-mirror]', 'keyup keypress blur change');

        });

        //country select
        var tracker = false;

        $('#billing_country[data-mirror]').on('change', function() {
            if ($chk.is(':checked')) {
                tracker = true;
            }
        });

        //update shipping only once
        $(window).on('onAfterAjaxUpdate', function() {
            if (tracker == true) {
                $('#shipping_country[data-mirror]').change();
                tracker = false;
            }

            //force the shiping state to update if it's value is different ie. after a page refresh
            if ($('#shipping_state[data-mirror]').val() != $('#billing_state[data-mirror]').val()) {
                $('#shipping_state[data-mirror]').val($('#billing_state[data-mirror]').val());
            }
        });

    })(jQuery, window, document);

    $('#cart-content').on('keydown', 'input#coupon', function(ev) {
        if (ev.which === 13) {
            $(this).sendRequest('shop:cart', {
                update: {
                    '#cart-content': 'shop-cart-content',
                    '#mini-cart': 'shop-minicart'
                },
                extraFields: {
                    set_coupon_code: 1
                }
            });
        }
    });

    $('#cart-content').on('keydown', 'input.quantity', function(ev) {
        if (ev.which === 13) {
            $(this).sendRequest('shop:cart', {
                update: {
                    '#cart-content': 'shop-cart-content',
                    '#mini-cart': 'shop-minicart'
                }
            });
        }
    });

    $('#checkout-page').on('change', '#shipping-methods input', function() {
        $(this).sendRequest('shop:onCheckoutShippingMethod', {
            update: {
                '#checkout-totals': 'shop-checkout-totals',
                '#mini-cart': 'shop-minicart'
            }
        });
    });

    $(document).on('change', '#payment_method input', function() {
        $('#payment_form').html('<i class="fa fa-refresh fa-spin"/>');
        $(this).sendRequest('shop:onUpdatePaymentMethod', {
            update: {
                '#payment_form': 'shop-paymentform'
            }
        });
    });

});
