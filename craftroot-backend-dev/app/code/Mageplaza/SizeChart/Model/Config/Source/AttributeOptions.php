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

use Magento\Eav\Model\Entity\Attribute\Source\AbstractSource;
use Magento\Eav\Model\ResourceModel\Entity\Attribute\OptionFactory;
use Magento\Framework\App\Request\Http;
use Magento\Framework\DB\Ddl\Table;
use Mageplaza\SizeChart\Model\ResourceModel\Rule\Collection as RuleCollection;

/**
 * Class AttributeOptions
 * @package Mageplaza\SizeChart\Model\Config\Source
 */
class AttributeOptions extends AbstractSource
{
    /**
     * Get disabled size chart attribute option value
     */
    const SIZE_CHART_ATTRIBUTE_DISABLED = 0;
    /**
     * Get default size chart attribute option value
     */
    const SIZE_CHART_ATTRIBUTE_PARENT_CATEGORY = -1;

    /**
     * @var Http
     */
    protected $_request;

    /**
     * @var OptionFactory
     */
    protected $_ruleCollectionFactory;

    /**
     * AttributeOptions constructor.
     *
     * @param Http $request
     * @param RuleCollection $collection
     */
    public function __construct(
        Http $request,
        RuleCollection $collection
    ) {
        $this->_request = $request;
        $this->_ruleCollectionFactory = $collection;
    }

    /**
     * Get all options
     *
     * @return array
     */
    public function getAllOptions()
    {
        $ruleCollection = $this->_ruleCollectionFactory->getData();
        $actionName = $this->_request->getFullActionName();
        $labelRule = ($actionName === 'catalog_category_edit') ? __('Inherit from Rule') : __('Inherit from Category/Rule');

        $this->_options = [
            ['label' => $labelRule, 'value' => self::SIZE_CHART_ATTRIBUTE_PARENT_CATEGORY],
            ['label' => __('No'), 'value' => self::SIZE_CHART_ATTRIBUTE_DISABLED],
        ];
        foreach ($ruleCollection as $rule) {
            $this->_options[] = [
                'label' => __($rule['name']),
                'value' => $rule['rule_id'],
            ];
        }

        return $this->_options;
    }

    /**
     * Get a text for option value
     *
     * @param string|integer $value
     *
     * @return string|bool
     */
    public function getOptionValue($value)
    {
        foreach ($this->getAllOptions() as $option) {
            if ($option['value'] === $value) {
                return $option['label'];
            }
        }

        return false;
    }

    /**
     * Retrieve flat column definition
     *
     * @return array
     */
    public function getFlatColumns()
    {
        $attributeCode = $this->getAttribute()->getAttributeCode();

        return [
            $attributeCode => [
                'unsigned' => false,
                'default' => null,
                'extra' => null,
                'type' => Table::TYPE_INTEGER,
                'nullable' => true,
                'comment' => __('Size Chart Attribute %1 column', $attributeCode),
            ],
        ];
    }
}
