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
    'Mageplaza_SizeChart/js/swatch-renderer-mixins',
    'Mageplaza_Core/js/jquery.magnific-popup.min'
], function ($) {

    if ($('.product-info-main').length) {
        /** normal configure options */
        var optionsContainer = $('.product-info-main #product-options-wrapper').find('[name="super_attribute[' + sizeChartData.attributeId + ']"]');
        if (optionsContainer.length && sizeChartData.displayType.indexOf('popup') >= 0) {
            Variables.initSizeChartLink(optionsContainer.parent());
        }
    }
});