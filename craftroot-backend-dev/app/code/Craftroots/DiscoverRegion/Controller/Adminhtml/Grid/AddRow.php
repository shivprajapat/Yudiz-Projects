<?php

namespace Craftroots\DiscoverRegion\Controller\Adminhtml\Grid;

use Magento\Backend\App\Action;
use Magento\Framework\Controller\ResultFactory;

class AddRow extends Action
{
    private $coreRegistry;

    private $discoverFactory;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $coreRegistry,
        \Craftroots\DiscoverRegion\Model\DiscoverFactory $discoverFactory
    ) {
        parent::__construct($context);
        $this->coreRegistry = $coreRegistry;
        $this->discoverFactory = $discoverFactory;
    }

    public function execute()
    {
        $rowId = (int) $this->getRequest()->getParam('id');
        $rowData = $this->discoverFactory->create();
        if ($rowId) {
            $rowData = $rowData->load($rowId);
            $rowTitle = $rowData->getTitle();
            if (!$rowData->getEntityId()) {
                $this->messageManager->addError(__('content data no longer exist.'));
                $this->_redirect('discoverbyregion/grid/rowdata');
                return;
            }
        }

        $this->coreRegistry->register('row_data', $rowData);
        $resultPage = $this->resultFactory->create(ResultFactory::TYPE_PAGE);
        $title = $rowId ? __('Edit Content').$rowTitle : __('Add Content');
        $resultPage->getConfig()->getTitle()->prepend($title);
        return $resultPage;
    }

    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Craftroots_DiscoverRegion::add_row');
    }
}
