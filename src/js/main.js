'use strict';

$(document).ready(function() {

    // $('.main-gallery').flickity({
    //     // options
    //     cellAlign: 'center',
    //     contain: true
    // });

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

        var $win = $(window);
        var $doc = $(document);

        var $source = $('#billing-info');
        var $sourceEls = $source.find(':input:not([type=hidden])');
        var $target = $('#shipping-info');
        var $targetEls = $target.find(':input:not([type=hidden])');
        var $chk = $doc.find('.js-mirrordata');

        var events = 'keyup blur change';

        // Update vars.
        $win.on('onAfterAjaxUpdate', function() {
            $source = $('#billing-info');
            $sourceEls = $source.find(':input:not([type=hidden])');
            $target = $('#shipping-info');
            $targetEls.prop('disabled', $chk.is(':checked'));
        });

        $doc.on(events, '#billing-info [data-input]', function() {
            if ($chk.is(':checked')) {
                mirrorField($(this));
            }
        });

        $doc.on('change', $chk, function() {
            $targetEls.prop('disabled', $chk.is(':checked'));
            if ($chk.is(':checked')) {
                $sourceEls.each(function() {
                    mirrorField($(this));
                });
                return false;
            }
        });

        $targetEls.prop('disabled', $chk.is(':checked'));

        function mirrorField($el) {
            var input = $el.data('input');
            var val, $targetEl;

            if (!input) {
                return;
            }

            val = $el.val();
            $targetEl = $('#shipping-info').find('[data-input="' + input + '"]');

            $targetEl.val(val);

            if (input === 'billing_country') {
                $targetEl.trigger('change');
            }
        }

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
