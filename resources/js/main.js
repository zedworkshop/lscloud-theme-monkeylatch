"use strict";$(document).ready(function(){$(document).on("change","select[data-sort-redirect]",function(){var t=window.location.pathname+"?"+$(this).val(),n=window.location.protocol+"//"+window.location.host;window.location=n+t}),function(t){t(document).on("click",".js-thumblist a",function(n){n.preventDefault();var e=t(this),o=e.closest(".js-thumblist").data("target"),i=t(o),c=e.attr("href");e.parent().addClass("selected").siblings().removeClass("selected"),i.attr("src",c)})}(jQuery),$(document).on("click",".js-addtocart",function(t){t.preventDefault(),$(this).sendRequest("shop:onAddToCart",{update:{"#mini-cart":"shop-minicart","#product-page":"shop-product"},onAfterUpdate:function(){$("#modal-minicart").removeClass("hide")}})}),$("body").on("click",".js-modalclose",function(){$("#modal-minicart").addClass("hide")}),function(t,n,e,o){function i(t){if(t.attr("name")){var n=t.val(),e=t.attr("name").match(p);if(e){e=e[1];var o=new RegExp(e,"g"),i=s.filter(function(){return this.name.match(o)});i.val(n),"billing_country"===t[0].id&&i.trigger("change")}}}var c=t(n),a=t(e),d=t("#billing-info").find(":input:not([type=hidden])"),s=t("#shipping-info").find(":input:not([type=hidden])"),r=t(e).find(".js-mirrordata"),p=/\[(.*?)\]/;c.on("onAfterAjaxUpdate",function(){d=t("#billing-info").find(":input:not([type=hidden])"),s=t("#shipping-info").find(":input:not([type=hidden])"),s.prop("disabled",r.is(":checked"))}),a.on("change",r,function(){return s.prop("disabled",r.is(":checked")),r.is(":checked")?(s.each(function(){i(t(this))}),!1):void 0}),s.prop("disabled",r.is(":checked"))}(jQuery,window,document),$("#cart-content").on("keydown","input#coupon",function(t){13===t.which&&$(this).sendRequest("shop:cart",{update:{"#cart-content":"shop-cart-content","#mini-cart":"shop-minicart"},extraFields:{set_coupon_code:1}})}),$("#cart-content").on("keydown","input.quantity",function(t){13===t.which&&$(this).sendRequest("shop:cart",{update:{"#cart-content":"shop-cart-content","#mini-cart":"shop-minicart"}})}),$("#checkout-page").on("change","#shipping-methods input",function(){$(this).sendRequest("shop:onCheckoutShippingMethod",{update:{"#checkout-totals":"shop-checkout-totals","#mini-cart":"shop-minicart"}})}),$(document).on("change","#payment_method input",function(){$("#payment_form").html('<i class="fa fa-refresh fa-spin"/>'),$(this).sendRequest("shop:onUpdatePaymentMethod",{update:{"#payment_form":"shop-paymentform"}})})});