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

namespace Mageplaza\SizeChart\Api\Data;

/**
 * Interface RuleInterface
 * @package Mageplaza\SizeChart\Api\Data
 */
interface RuleInterface
{
    /**
     * Constants defined for keys of array, makes typos less likely
     */
    const RULE_ID               = 'rule_id';
    const NAME                  = 'name';
    const RULE_CONTENT          = 'rule_content';
    const TEMPLATE_STYLES       = 'template_styles';
    const STORE_IDS             = 'store_ids';
    const DISPLAY_TYPE          = 'display_type';
    const ENABLED               = 'enabled';
    const CONDITIONS_SERIALIZED = 'conditions_serialized';
    const ATTRIBUTE_CODE        = 'attribute_code';
    const DEMO_TEMPLATES        = 'demo_templates';
    const PRIORITY              = 'priority';
    const UPDATED_AT            = 'updated_at';
    const CREATED_AT            = 'created_at';
    const RULE_DESCRIPTION      = 'rule_description';

    /**
     * @return string
     */
    public function getRuleId();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setRuleId($value);

    /**
     * @return string
     */
    public function getName();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setName($value);

    /**
     * @return string
     */
    public function getRuleContent();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setRuleContent($value);

    /**
     * @return string
     */
    public function getTemplateStyles();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setTemplateStyles($value);

    /**
     * @return string
     */
    public function getStoreIds();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setStoreIds($value);

    /**
     * @return string
     */
    public function getDisplayType();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setDisplayType($value);

    /**
     * @return int
     */
    public function getEnabled();

    /**
     * @param bool $value
     *
     * @return $this
     */
    public function setEnabled($value);

    /**
     * @return string
     */
    public function getConditionsSerialized();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setConditionsSerialized($value);

    /**
     * @return string
     */
    public function getAttributeCode();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setAttributeCode($value);

    /**
     * @return string
     */
    public function getDemoTemplates();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setDemoTemplates($value);

    /**
     * @return string
     */
    public function getPriority();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setPriority($value);

    /**
     * @return string
     */
    public function getUpdatedAt();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setUpdatedAt($value);

    /**
     * @return string
     */
    public function getCreatedAt();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setCreatedAt($value);

    /**
     * @return string
     */
    public function getRuleDescription();

    /**
     * @param string $value
     *
     * @return $this
     */
    public function setRuleDescription($value);
}
