<?php
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

namespace Mageplaza\SizeChart\Model\Config\Source;

use Magento\Framework\Option\ArrayInterface;

/**
 * Class DemoTemplate
 * @package Mageplaza\SizeChart\Model\Config\Source
 */
class DemoTemplate implements ArrayInterface
{
    const TEMPLATE1 = 'men-top';
    const TEMPLATE2 = 'men-bottom';
    const TEMPLATE3 = 'women-top';
    const TEMPLATE4 = 'women-bottom';
    const TEMPLATE5 = 'men-shoes';
    const TEMPLATE6 = 'women-shoes';

    /**
     * @return array
     */
    public function toOptionArray()
    {
        $options = [];
        foreach ($this->toArray() as $value => $label) {
            $options[] = compact('value', 'label');
        }

        return $options;
    }

    /**
     * Get options in "key-value" format
     *
     * @return array
     */
    public function toArray()
    {
        return [
            self::TEMPLATE1 => __('Men Top'),
            self::TEMPLATE2 => __('Men Bottom'),
            self::TEMPLATE3 => __('Women Top'),
            self::TEMPLATE4 => __('Women Bottom'),
            self::TEMPLATE5 => __('Men Shoes'),
            self::TEMPLATE6 => __('Women Shoes')
        ];
    }
}
