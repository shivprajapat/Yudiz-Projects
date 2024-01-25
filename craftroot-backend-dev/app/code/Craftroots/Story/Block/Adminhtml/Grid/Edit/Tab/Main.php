<?php

namespace Craftroots\Story\Block\Adminhtml\Grid\Edit\Tab;

class Main extends \Magento\Backend\Block\Widget\Form\Generic
{
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        array $data = []
    ) {
        parent::__construct($context, $registry, $formFactory, $data);
    }

    protected function _prepareForm()
    {
        $model = $this->_coreRegistry->registry('row_data');
        $form = $this->_formFactory->create();

        $form->setHtmlIdPrefix('story_');
        if ($model->getEntityId()) {
            $fieldset = $form->addFieldset(
                'base_fieldset',
                ['legend' => __('Edit Story Content'), 'class' => 'fieldset-wide']
            );
            $fieldset->addField('entity_id', 'hidden', ['name' => 'entity_id']);
        } else {
            $fieldset = $form->addFieldset(
                'base_fieldset',
                ['legend' => __('Add Story Content'), 'class' => 'fieldset-wide']
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
            'name',
            'text',
            [
                'name' => 'name',
                'label' => __('Artisan Name'),
                'id' => 'name',
                'title' => __('Artisan Name'),
                'class' => 'required-entry',
                'required' => true,
            ]
        );
        $fieldset->addField(
            'occupation',
            'text',
            [
                'name' => 'occupation',
                'label' => __('Artisan Occupation'),
                'id' => 'occupation',
                'title' => __('Artisan Occupation'),
                'class' => 'required-entry',
                'required' => true,
            ]
        );

        $fieldset->addField(
            'description',
            'textarea',
            [
                'name' => 'description',
                'label' => __('Description'),
                'id' => 'description',
                'title' => __('Description'),
                'class' => 'required-entry',
                'required' => true,
            ]
        );


        $fieldset->addField(
            'status',
            'select',
            [
                'name' => 'status',
                'label' => __('Status'),
                'id' => 'status',
                'title' => __('Status'),
                'options' => [0 => __('Disabled'), 1 => __('Enabled')],
                'class' => 'status',
                'required' => true,
            ]
        );

        $typeOfContent = $fieldset->addField(
            'type',
            'select',
            [
                'name' => 'type',
                'label' => __('Type Of Content'),
                'id' => 'type',
                'title' => __('Type Of Content'),
                'options' => [0 => __('Video'), 1 => __('Image')],
                'class' => 'type',
                'required' => true,
            ]
        );
        $fileupload = $fieldset->addField(
            'fileupload',
            'image',
            [
                'name' => 'fileupload',
                'id' => 'fileupload',
                'label' => __('Upload File'),
                'title' => __('File'),
                'note' => 'Allow file type: Image, Video',
                'required'  => true,
            ]
        );
   

        $form->setValues($model->getData());
        $this->setForm($form);
        return parent::_prepareForm();
    }
}
?>