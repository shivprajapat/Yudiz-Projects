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
use Magento\Cms\Model\Wysiwyg\Config;
use Magento\Framework\Data\Form;
use Magento\Framework\Data\FormFactory;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Registry;
use Mageplaza\SizeChart\Model\Config\Source\DemoTemplate;

/**
 * Class Template
 * @package Mageplaza\SizeChart\Block\Adminhtml\Rule\Edit\Tab
 */
class Template extends Generic implements TabInterface
{
    /**
     * Wysiwyg config
     *
     * @var Config
     */
    public $wysiwygConfig;

    /**
     * @var DemoTemplate
     */
    protected $_demoTemplates;

    /**
     * Rule constructor.
     *
     * @param Context $context
     * @param Registry $registry
     * @param FormFactory $formFactory
     * @param Config $wysiwygConfig
     * @param DemoTemplate $demoTemplate
     * @param array $data
     */
    public function __construct(
        Context $context,
        Registry $registry,
        FormFactory $formFactory,
        Config $wysiwygConfig,
        DemoTemplate $demoTemplate,
        array $data = []
    ) {
        $this->wysiwygConfig = $wysiwygConfig;
        $this->_demoTemplates = $demoTemplate;

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
            'legend' => __('Size Chart Template'),
            'class' => 'fieldset-wide'
        ]);

        $fieldset->addField('rule_content', 'editor', [
            'name' => 'rule_content',
            'label' => __('Template HTML'),
            'title' => __('Template HTML'),
            'required' => true,
            'config' => $this->wysiwygConfig->getConfig([
                'add_variables' => false,
                'add_widgets' => false,
                'add_directives' => true
            ])
        ]);

        $fieldset->addField('template_styles', 'textarea', [
            'name' => 'template_styles',
            'label' => __('Template CSS'),
            'title' => __('Template CSS')
        ]);

        $fieldset->addField('demo_templates', 'select', [
            'name' => 'demo_templates',
            'label' => __('Templates'),
            'title' => __('Templates'),
            'values' => $this->_demoTemplates->toOptionArray()
        ])->setAfterElementHtml('<button type="button" id="sc_load_sample_template"><span>' . __('Load') . '</span></button>');

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
        return __('What To Show');
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
