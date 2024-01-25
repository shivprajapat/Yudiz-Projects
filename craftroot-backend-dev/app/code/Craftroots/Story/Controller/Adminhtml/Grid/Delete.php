<?php
namespace Craftroots\Story\Controller\Adminhtml\Grid;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;

class Delete extends Action
{
    public $extensionfactory;

    public function __construct(
        Action\Context $context,
        \Craftroots\Story\Model\Extension $extensionfactory
    ) {
        $this->extensionfactory = $extensionfactory;
        parent::__construct($context);
    }

    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Craftroots_Story::grid_delete');
    }
    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();
        $id = $this->getRequest()->getParam('id');
        if ($id) {
            try {
                $model = $this->_objectManager->create('Craftroots\Story\Model\Extension');
                $model->load($id);
                $model->delete();
                $this->messageManager->addSuccess(__('You deleted the item.'));
                return $resultRedirect->setPath('*/*/');
                return;
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addError(
                    __('We can\'t delete item right now. Please review the log and try again.')
                );
                // $this->_objectManager->get('Psr\Log\LoggerInterface')->critical($e);
                return $resultRedirect->setPath('*/*/edit', ['id' => $id]);
                return;
            }
        }
        $this->messageManager->addError(__('We can\'t find a item to delete.'));
        return $resultRedirect->setPath('*/*/');
    }
}