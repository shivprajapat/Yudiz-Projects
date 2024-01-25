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

namespace Mageplaza\SizeChart\Model;

use Magento\CatalogRule\Model\Rule\Condition\Combine;
use Magento\Framework\App\ObjectManager;
use Magento\Rule\Model\AbstractModel;
use Magento\Rule\Model\Action\Collection;
use Mageplaza\SizeChart\Api\Data\RuleInterface;

/**
 * Class Rule
 * @package Mageplaza\SizeChart\Model
 */
class Rule extends AbstractModel implements RuleInterface
{
    /**
     * Cache tag
     *
     * @var string
     */
    const CACHE_TAG = 'mageplaza_sizechart_rule';

    /**
     * Cache tag
     *
     * @var string
     */
    protected $_cacheTag = 'mageplaza_sizechart_rule';

    /**
     * Event prefix
     *
     * @var string
     */
    protected $_eventPrefix = 'mageplaza_sizechart_rule';

    /**
     * @var string
     */
    protected $_idFieldName = 'rule_id';

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Mageplaza\SizeChart\Model\ResourceModel\Rule');
    }

    /**
     * @return array
     */
    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * Get rule condition combine model instance
     *
     * @return \Magento\Rule\Model\Condition\Combine
     */
    public function getConditionsInstance()
    {
        return $this->getActionsInstance();
    }

    /**
     * @return Combine|Collection
     */
    public function getActionsInstance()
    {
        return ObjectManager::getInstance()->create(Combine::class);
    }

    /**
     * {@inheritDoc}
     */
    public function getRuleId()
    {
        return $this->_getData(self::RULE_ID);
    }

    /**
     * {@inheritDoc}
     */
    public function setRuleId($value)
    {
        return $this->setData(self::RULE_ID, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return $this->_getData(self::NAME);
    }

    /**
     * {@inheritDoc}
     */
    public function setName($value)
    {
        return $this->setData(self::NAME, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getRuleContent()
    {
        return $this->_getData(self::RULE_CONTENT);
    }

    /**
     * {@inheritDoc}
     */
    public function setRuleContent($value)
    {
        return $this->setData(self::RULE_CONTENT, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getTemplateStyles()
    {
        return $this->_getData(self::TEMPLATE_STYLES);
    }

    /**
     * {@inheritDoc}
     */
    public function setTemplateStyles($value)
    {
        return $this->setData(self::TEMPLATE_STYLES, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getStoreIds()
    {
        return $this->_getData(self::STORE_IDS);
    }

    /**
     * {@inheritDoc}
     */
    public function setStoreIds($value)
    {
        return $this->setData(self::STORE_IDS, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getDisplayType()
    {
        return $this->_getData(self::DISPLAY_TYPE);
    }

    /**
     * {@inheritDoc}
     */
    public function setDisplayType($value)
    {
        return $this->setData(self::DISPLAY_TYPE, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getEnabled()
    {
        return $this->_getData(self::ENABLED);
    }

    /**
     * {@inheritDoc}
     */
    public function setEnabled($value)
    {
        return $this->setData(self::ENABLED, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getConditionsSerialized()
    {
        return $this->_getData(self::CONDITIONS_SERIALIZED);
    }

    /**
     * {@inheritDoc}
     */
    public function setConditionsSerialized($value)
    {
        return $this->setData(self::CONDITIONS_SERIALIZED, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getAttributeCode()
    {
        return $this->_getData(self::ATTRIBUTE_CODE);
    }

    /**
     * {@inheritDoc}
     */
    public function setAttributeCode($value)
    {
        return $this->setData(self::ATTRIBUTE_CODE, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getDemoTemplates()
    {
        return $this->_getData(self::DEMO_TEMPLATES);
    }

    /**
     * {@inheritDoc}
     */
    public function setDemoTemplates($value)
    {
        return $this->setData(self::DEMO_TEMPLATES, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getPriority()
    {
        return $this->_getData(self::PRIORITY);
    }

    /**
     * {@inheritDoc}
     */
    public function setPriority($value)
    {
        return $this->setData(self::PRIORITY, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getUpdatedAt()
    {
        return $this->_getData(self::UPDATED_AT);
    }

    /**
     * {@inheritDoc}
     */
    public function setUpdatedAt($value)
    {
        return $this->setData(self::UPDATED_AT, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getCreatedAt()
    {
        return $this->_getData(self::CREATED_AT);
    }

    /**
     * {@inheritDoc}
     */
    public function setCreatedAt($value)
    {
        return $this->setData(self::CREATED_AT, $value);
    }

    /**
     * {@inheritDoc}
     */
    public function getRuleDescription()
    {
        return $this->_getData(self::RULE_DESCRIPTION);
    }

    /**
     * {@inheritDoc}
     */
    public function setRuleDescription($value)
    {
        return $this->setData(self::RULE_DESCRIPTION, $value);
    }
}
