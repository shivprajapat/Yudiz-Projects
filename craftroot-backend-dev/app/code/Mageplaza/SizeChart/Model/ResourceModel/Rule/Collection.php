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

namespace Mageplaza\SizeChart\Model\ResourceModel\Rule;

use Magento\Rule\Model\ResourceModel\Rule\Collection\AbstractCollection;

/**
 * Class Collection
 * @package Mageplaza\SizeChart\Model\ResourceModel\Rule
 */
class Collection extends AbstractCollection
{
    protected $_idFieldName = 'rule_id';

    /**
     * Define model & resource model
     */
    protected function _construct()
    {
        $this->_init('Mageplaza\SizeChart\Model\Rule', 'Mageplaza\SizeChart\Model\ResourceModel\Rule');
    }
}
