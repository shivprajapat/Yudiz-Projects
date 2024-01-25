<?php
namespace Craftroots\Story\Block\Adminhtml\Grid\Edit;

class Tabs extends \Magento\Backend\Block\Widget\Tabs
{
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Json\EncoderInterface $jsonEncoder,
        \Magento\Backend\Model\Auth\Session $authSession,
        \Magento\Framework\Registry $coreRegistry,
        array $data = []
    ) {
        $this->_coreRegistry = $coreRegistry;
        parent::__construct($context, $jsonEncoder, $authSession, $data);
    }

    protected function _construct()
    {
        parent::_construct();
        $this->setId('story_tabs');
        $this->setDestElementId('edit_form');
        $this->setTitle(__('Story Content Data'));
    }

    protected function _prepareLayout()
    {
        $this->addTab(
            'main',
            [
                'label' => __('Story Content Details'),
                'content' => $this->getLayout()->createBlock(
                    'Craftroots\Story\Block\Adminhtml\Grid\Edit\Tab\Main'
                )->toHtml(),
                'active' => true
            ]
        );

        return parent::_prepareLayout();
    }
}