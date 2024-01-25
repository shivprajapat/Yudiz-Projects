<?php
namespace Craftroots\DiscoverRegion\Block\Adminhtml\Grid;

class AddRow extends \Magento\Backend\Block\Widget\Form\Container
{
    protected $_coreRegistry = null;

    public function __construct(
        \Magento\Backend\Block\Widget\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    protected function _construct()
    {
        $this->_objectId = 'row_id';
        $this->_blockGroup = 'Craftroots_DiscoverRegion';
        $this->_controller = 'adminhtml_grid';
        parent::_construct();
        if ($this->_isAllowedAction('Craftroots_DiscoverRegion::add_row')) {        	
            $this->buttonList->update('save', 'label', __('Save Content'));
        } else {
            $this->buttonList->remove('save');
        }      
        $this->buttonList->remove('reset');
        $id = $this->getRequest()->getParam('id');
        if(isset($id)){
            $this->addButton(
                'delete',
                [
                    'label' => __('Delete'),
                    'onclick' => 'deleteConfirm(' . json_encode(__('Are you sure you want to do this?'))
                    . ','
                    . json_encode($this->getDeleteUrl()
                )
                    . ')',
                    'class' => 'scalable delete',
                    'level' => -1
                ]
            );
            $this->addButton(
                'saveandcontinue',
                [
                    'label' => __('Save and Continue Edit'),
                    'class' => 'save',
                    'data_attribute' => [
                        'mage-init' => ['button' => ['event' => 'saveAndContinueEdit', 'target' => '#edit_form'],
                        ],
                    ],
                    'sort_order' => 80,
                ]
            );
        }
        
        $this->addButton(
            'reset',
            [
                'label' => __('Reset'),
                'class' => 'reset',
                'on_click' => 'location.reload();',
                'sort_order' => 30,
            ]
        );

        
    }

    public function getHeaderText()
    {
        return __('Add Content');
    }

    protected function _isAllowedAction($resourceId)
    {
        return $this->_authorization->isAllowed($resourceId);
    }

    public function getFormActionUrl()
    {
        if ($this->hasFormActionUrl()) {
            return $this->getData('form_action_url');
        }

        return $this->getUrl('*/*/save');
    }
    public function getDeleteUrl()
    {
        return $this->getUrl('discoverbyregion/grid/delete', ['_current' => true, 'back' => 'edit', 'active_tab' => '{{tab_id}}']); 
    }
    protected function _getSaveAndContinueUrl() {
        return $this->getUrl('discoverbyregion/grid/save', ['_current' => true, 'back' => 'edit', 'active_tab' => '{{tab_id}}']);
    }
}
