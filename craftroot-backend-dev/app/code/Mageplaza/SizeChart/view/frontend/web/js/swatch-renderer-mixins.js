/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_SizeChart
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

define([
    'jquery',
    'underscore',
    'Mageplaza_Core/js/jquery.magnific-popup.min'
], function ($, _) {
    'use strict';

    window.Variables = {
        initSizeChartLink: function (selector) {
            /** render mp size chart popup link */
            if ($('.mp-sizechart-popup-link').length === 0){
                $(selector).append
                ('<div class="mp-sizechart-popup-link">' +
                    '<a href="#open-popup"">' + sizeChartData.label + '<img src="' + sizeChartData.iconUrl + '" alt="chart-icon" /></a>' +
                    '</div>' +
                    '<div class="clearfix"></div> ' +
                    '<div id="open-popup" class="white-popup mfp-hide"> ' +
                    '<header>Size Chart</header>' +
                    '<div id="mp-size-chart-wrapper">' + sizeChartData.ruleContentHtml + '' +
                    '</div>' +
                    '</div>'
                );
                $(selector).css({"position":"relative"});
            }
            /** init popup link */
            $('.mp-sizechart-popup-link a').magnificPopup({
                type: 'inline',
                midClick: true
            });
        }
    };
    return function (widget) {
        $.widget('mage.SwatchRenderer', widget, {
            _RenderControls: function () {
                this._super();
                if ($('.product-info-main').length && typeof sizeChartData !== "undefined") {
                    var swatchContainer = $('.product-info-main .swatch-opt').find('[data-attribute-code="' + sizeChartData.attributeCode + '"]');
                    if (swatchContainer.length && sizeChartData.displayType.indexOf('popup') >= 0) {
                        Variables.initSizeChartLink(swatchContainer);
                    }
                }
            }
        });

        return $.mage.SwatchRenderer;
    };
});