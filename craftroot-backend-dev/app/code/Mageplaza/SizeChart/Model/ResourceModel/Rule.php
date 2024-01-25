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

namespace Mageplaza\SizeChart\Model\ResourceModel;

use Magento\Framework\Model\AbstractModel;
use Magento\Rule\Model\ResourceModel\AbstractResource;

/**
 * Class Rule
 * @package Mageplaza\SizeChart\Model\ResourceModel
 */
class Rule extends AbstractResource
{
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('mageplaza_sizechart_rule', 'rule_id');
    }

    /**
     * @param AbstractModel $object
     *
     * @return $this
     */
    public function _beforeSave(AbstractModel $object)
    {
        if (is_array($object->getStoreIds())) {
            $object->setStoreIds(implode(',', $object->getStoreIds()));
        }

        if (is_array($object->getDisplayType())) {
            $object->setDisplayType(implode(',', $object->getDisplayType()));
        }

        return $this;
    }
}
