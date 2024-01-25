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

namespace Mageplaza\SizeChart\Block\Adminhtml\Rule\Edit\Tab;

use Magento\Backend\Block\Template\Context;
use Magento\Backend\Block\Widget\Form\Generic;
use Magento\Backend\Block\Widget\Tab\TabInterface;
use Magento\Framework\Data\Form;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Registry;
use Mageplaza\SizeChart\Model\Config\Source\DisplayType;

/**
 * Class Type
 * @package Mageplaza\SizeChart\Block\Adminhtml\Rule\Edit\Tab
 */
class Type extends Generic implements TabInterface
{
    /**
     * @var DisplayType
     */
    protected $_displayType;

    /**
     * Rule constructor.
     *
     * @param Context $context
     * @param Registry $registry
     * @param FormFactory $formFactory
     * @param DisplayType $displayType
     * @param array $data
     */
    public function __construct(
        Context $context,
        Registry $registry,
        FormFactory $formFactory,
        DisplayType $displayType,
        array $data = []
    ) {
        $this->_displayType = $displayType;

        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * @inheritdoc
     * @return Generic
     * @throws LocalizedException
     */
    protected function _prepareForm()
    {
        /** @var \Mageplaza\SizeChart\Model\Rule $rule */
        $rule = $this->_coreRegistry->registry('mageplaza_sizechart_rule');

        /** @var Form $form */
        $form = $this->_formFactory->create();

        $form->setHtmlIdPrefix('rule_');
        $form->setFieldNameSuffix('rule');

        $fieldset = $form->addFieldset('base_fieldset', [
            'legend' => __('How Size Chart will be shown'),
            'class' => 'fieldset-wide'
        ]);

        $fieldset->addField('display_type', 'multiselect', [
            'name' => 'display_type',
            'label' => __('How to display'),
            'title' => __('How to display'),
            'values' => $this->_displayType->toOptionArray()
        ]);
        if (!$rule->hasData('display_type')) {
            $rule->setDisplayType('popup');
        }

        $fieldset->addField('attribute_code', 'text', [
            'name' => 'attribute_code',
            'label' => __('Attribute Code'),
            'title' => __('Attribute Code'),
            'required' => true,
            'note' => __('The line "Size Chart" will be displayed next to this attribute code.<br>Eg: size,shoes_size,men_size,women_size,etc.'),
        ], 'display_type');

        $form->addValues($rule->getData());
        $this->setChild(
            'form_after',
            $this->getLayout()->createBlock('Magento\Backend\Block\Widget\Form\Element\Dependence')
                ->addFieldMap("rule_display_type", 'display_type')
                ->addFieldMap("rule_attribute_code", 'attribute_code')
                ->addFieldDependence('attribute_code', 'display_type', 'popup')
        );

        $this->setForm($form);

        return parent::_prepareForm();
    }

    /**
     * Prepare label for tab
     *
     * @return string
     */
    public function getTabLabel()
    {
        return __('How To Show');
    }

    /**
     * Prepare title for tab
     *
     * @return string
     */
    public function getTabTitle()
    {
        return $this->getTabLabel();
    }

    /**
     * Can show tab in tabs
     *
     * @return boolean
     */
    public function canShowTab()
    {
        return true;
    }

    /**
     * Tab is hidden
     *
     * @return boolean
     */
    public function isHidden()
    {
        return false;
    }
}
