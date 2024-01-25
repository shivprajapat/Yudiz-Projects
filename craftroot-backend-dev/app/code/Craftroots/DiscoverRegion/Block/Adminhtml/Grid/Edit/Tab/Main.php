<?php

namespace Craftroots\DiscoverRegion\Block\Adminhtml\Grid\Edit\Tab;

class Main extends \Magento\Backend\Block\Widget\Form\Generic

{
    protected $eavConfig;

    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Eav\Model\Config $eavConfig,
        \Magento\Framework\Data\FormFactory $formFactory,
        array $data = []
    ) {
        $this->eavConfig = $eavConfig;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    protected function _prepareForm()
    {
        $model = $this->_coreRegistry->registry('row_data');
        $form = $this->_formFactory->create();
        $regionData = $this->getOptionList();
        $regionAraays = [];
        foreach ($regionData as $regionCollection) {
            $regionId = $regionCollection['value'];
            $regionLabel = $regionCollection['label'];
            $regionAraays[$regionId] = $regionLabel;

        }
        $form->setHtmlIdPrefix('discover_');
        if ($model->getEntityId()) {
            $fieldset = $form->addFieldset(
                'base_fieldset',
                ['legend' => __('Edit Content'), 'class' => 'fieldset-wide']
            );
            $fieldset->addField('entity_id', 'hidden', ['name' => 'entity_id']);
        } else {
            $fieldset = $form->addFieldset(
                'base_fieldset',
                ['legend' => __('Add Content'), 'class' => 'fieldset-wide']
            );
        }

        $fieldset->addField(
            'title',
            'text',
            [
                'name' => 'title',
                'label' => __('Title'),
                'id' => 'title',
                'title' => __('Title'),
                'class' => 'required-entry',
                'required' => true,
            ]
        );
        $fieldset->addField(
            'region',
            'select',
            [
                'name' => 'region',
                'label' => __('Region'),
                'title' => __('Region'),
                'options' => $regionAraays,
                'required' => true,

            ]
        );
        $fieldset->addField(
            'fileupload',
            'image',
            [
                'name' => 'fileupload',
                'id' => 'fileupload',
                'label' => __('Upload File'),
                'title' => __('File'),
                'note' => 'Allow file type: Image',
                'required' => true,
            ]
        );

        $form->setValues($model->getData());
        $this->setForm($form);
        return parent::_prepareForm();
    }
    public function getOptionList()
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'region');
        return $attribute->getSource()->getAllOptions();
    }
}
