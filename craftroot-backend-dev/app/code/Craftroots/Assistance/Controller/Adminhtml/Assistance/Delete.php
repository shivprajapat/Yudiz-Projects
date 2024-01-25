<?php
namespace Craftroots\Assistance\Controller\Adminhtml\Assistance;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;

class Delete extends Action
{
    public $assistanceFactory;

    public function __construct(
        Action\Context $context,
        \Craftroots\Assistance\Model\Assistance $assistanceFactory
    ) {
        $this->assistanceFactory = $assistanceFactory;
        parent::__construct($context);
    }

    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Craftroots_Assistance::assistance_delete');
    }
    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();
        $id = $this->getRequest()->getParam('id');
        if ($id) {
            try {
                $model = $this->_objectManager->create('Craftroots\Assistance\Model\Assistance');
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