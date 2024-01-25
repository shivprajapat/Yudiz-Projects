<?php
namespace Craftroots\Story\Controller\Adminhtml\Grid;

use Magento\Framework\App\Filesystem\DirectoryList;
use Craftroots\Story\Helper\Data;

class Save extends \Magento\Backend\App\Action
{
    var $extensionFactory;
    protected $fileSystem;
    protected $uploaderFactory;
    protected $helperData;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Craftroots\Story\Model\ExtensionFactory $extensionFactory,
        \Magento\Framework\Filesystem $fileSystem,
        \Magento\MediaStorage\Model\File\UploaderFactory $uploaderFactory,
        Data $helperData
    ) {
        parent::__construct($context);
        $this->extensionFactory = $extensionFactory;
        $this->fileSystem = $fileSystem;
        $this->uploaderFactory = $uploaderFactory;
        $this->helperData = $helperData;
    }

    public function execute()
    {
        $data = $this->getRequest()->getPostValue();
        $filedata = $this->getRequest()->getFiles('fileupload');
        $fileName = ($filedata && array_key_exists('name', $filedata)) ? $filedata['name'] : null;
        if (!$data) {
            $this->_redirect('story/grid/addrow');
            return;
        }
        try {
            $rowData = $this->extensionFactory->create();
            $rowData->setData($data);
            
            if (isset($data['entity_id'])) {            
                $data = (array)$this->getRequest()->getPost();
                    
                $id = $this->getRequest()->getParam("entity_id");
                if ($filedata['name']!="") {
                    $filePath = $this->helperData->getImageUploader();
                    $rowData->setFileupload($filePath);
                }
                else if (isset($data['fileupload']['delete']) && $data['fileupload']['delete'] == 1) {
                    echo "delete";
                    die();
                    // $rowData->setFileupload("NULL");
                }
                else{
                    $rowData->setFileupload($data['fileupload']['value']);
                }
                $rowData->setEntityId($data['entity_id']);
                $rowData->save();        
                $this->messageManager->addSuccessMessage(__("Story Content Data Updated Successfully."));
                if ($this->getRequest()->getParam('back')) {
                    $this->_redirect('*/*/addrow', ['id' => $rowData->getId(), '_current' => true]);
                    return;
                }
                else{
                    $this->_redirect('*/*/index');
                    return; 
                } 
            }
            
            else{
                $data = (array)$this->getRequest()->getPost();
                $filePath = $this->helperData->getImageUploader();
                $rowData->setFileupload($filePath);
                $rowData->save();
                $this->messageManager->addSuccess(__('Story Content Data has been Added successfully.'));
                if ($this->getRequest()->getParam('back')) {
                    $this->_redirect('*/*/addrow', ['id' => $rowData->getId(), '_current' => true]);
                    return;
                }
                else{
                    $this->_redirect('*/*/index');
                    return; 
                }
            }
            
        } catch (\Exception $e) {
            $this->messageManager->addError(__($e->getMessage()));
        }
        $this->_redirect('story/grid/index');
    }

    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Craftroots_Story::save');
    }
}