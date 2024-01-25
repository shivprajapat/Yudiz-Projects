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
use Magento\Config\Model\Config\Source\Enabledisable;
use Magento\Config\Model\Config\Source\Yesno;
use Magento\Framework\Data\Form;
use Magento\Framework\Data\Form\Element\Renderer\RendererInterface;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Registry;
use Magento\Store\Model\System\Store;

/**
 * Class Rule
 * @package Mageplaza\SizeChart\Block\Adminhtml\Rule\Edit\Tab
 */
class Rule extends Generic implements TabInterface
{
    /**
     * @var Store
     */
    public $systemStore;

    /**
     * @var Enabledisable
     */
    protected $_enableDisable;

    /**
     * @var Yesno
     */
    protected $_yesNo;

    /**
     * Rule constructor.
     *
     * @param Context $context
     * @param Registry $registry
     * @param FormFactory $formFactory
     * @param Enabledisable $enableDisable
     * @param Yesno $yesNo
     * @param Store $systemStore
     * @param array $data
     */
    public function __construct(
        Context $context,
        Registry $registry,
        FormFactory $formFactory,
        Enabledisable $enableDisable,
        Yesno $yesNo,
        Store $systemStore,
        array $data = []
    ) {
        $this->_enableDisable = $enableDisable;
        $this->_yesNo = $yesNo;
        $this->systemStore = $systemStore;

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
            'legend' => __('Information'),
            'class' => 'fieldset-wide'
        ]);

        $fieldset->addField('name', 'text', [
            'name' => 'name',
            'label' => __('Name'),
            'title' => __('Name'),
            'required' => true
        ]);

        $fieldset->addField('rule_description', 'textarea', [
            'name' => 'rule_description',
            'label' => __('Description'),
            'title' => __('Description'),
        ]);

        $fieldset->addField('enabled', 'select', [
            'name' => 'enabled',
            'label' => __('Active'),
            'title' => __('Active'),
            'values' => $this->_yesNo->toOptionArray()
        ]);
        if (!$rule->hasData('enabled')) {
            $rule->setEnabled(1);
        }

        if (!$this->_storeManager->isSingleStoreMode()) {
            /** @var RendererInterface $rendererBlock */
            $rendererBlock = $this->getLayout()->createBlock('Magento\Backend\Block\Store\Switcher\Form\Renderer\Fieldset\Element');
            $fieldset->addField('store_ids', 'multiselect', [
                'name' => 'store_ids',
                'label' => __('Store Views'),
                'title' => __('Store Views'),
                'required' => true,
                'values' => $this->systemStore->getStoreValuesForForm(false, true)
            ])->setRenderer($rendererBlock);

            if (!$rule->hasData('store_ids')) {
                $rule->setStoreIds(0);
            }
        } else {
            $fieldset->addField('store_ids', 'hidden', [
                'name' => 'store_ids',
                'value' => $this->_storeManager->getStore()->getId()
            ]);
        }

        $fieldset->addField('priority', 'text', [
            'name' => 'priority',
            'label' => __("Priority"),
            'title' => __("Priority"),
            'required' => true,
            'class' => 'validate-digits-range digits-range-0-99',
            'value' => '99',
            'note' => __('Default is 99, and 0 is highest.'),
        ]);

        $form->addValues($rule->getData());
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
        return __('General Information');
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
