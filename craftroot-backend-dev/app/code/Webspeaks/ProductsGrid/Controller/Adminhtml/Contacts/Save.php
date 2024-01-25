<?php

namespace Webspeaks\ProductsGrid\Controller\Adminhtml\Contacts;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Filesystem;

class Save extends \Magento\Backend\App\Action

{
    /**
     * @var \Magento\Backend\Helper\Js
     */
    protected $_jsHelper;

    /**
     * @var \Webspeaks\ProductsGrid\Model\ResourceModel\Contact\CollectionFactory
     */
    protected $_contactCollectionFactory;
    protected $_mediaDirectory;
    protected $_fileUploaderFactory;
    protected $filesystem;

    /**
     * \Magento\Backend\Helper\Js $jsHelper
     * @param Action\Context $context
     */
    public function __construct(
        Context $context,
        \Magento\Framework\Filesystem $filesystem,
        \Magento\MediaStorage\Model\File\UploaderFactory $fileUploaderFactory,
        \Magento\Framework\Filesystem\Driver\File $file,
        \Magento\Backend\Helper\Js $jsHelper,
        \Webspeaks\ProductsGrid\Model\ResourceModel\Contact\CollectionFactory $contactCollectionFactory
    ) {
        $this->_jsHelper = $jsHelper;
        $this->_contactCollectionFactory = $contactCollectionFactory;
        $this->_mediaDirectory = $filesystem->getDirectoryWrite(\Magento\Framework\App\Filesystem\DirectoryList::MEDIA);
        $this->_fileUploaderFactory = $fileUploaderFactory;
        $this->filesystem = $filesystem;
        $this->_file = $file;

        parent::__construct($context);
    }

    /**
     * {@inheritdoc}
     */
    protected function _isAllowed()
    {
        return true;
    }

    /**
     * Save action
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {

        /** @var \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
        $resultRedirect = $this->resultRedirectFactory->create();
        if ($this->getRequest()->getPostValue()) {

            /** @var \Webspeaks\ProductsGrid\Model\Contact $model */
            $model = $this->_objectManager->create('Webspeaks\ProductsGrid\Model\Contact');
            $data = $this->getRequest()->getPostValue();
            $id = $this->getRequest()->getParam('contact_id');
            $assignproducts = $this->getRequest()->getParam('products');

            if ($assignproducts == '') {
                if ($id == '') {
                    $this->messageManager->addError(__('please assign the products'));
                    return $this->_redirect('*/*/edit');
                }
            }

            if (isset($_FILES['main_banner']['name']) && $_FILES['main_banner']['name'] != '') {
                if ($_FILES["main_banner"]["size"] < 2000000) {
                    try {

                        //echo "hi";die;
                        $target = $this->_mediaDirectory->getAbsolutePath('instagram/images/');
                        $targetOne = 'instagram/images/';
                        /** @var $uploader \Magento\MediaStorage\Model\File\Uploader */
                        $uploader = $this->_fileUploaderFactory->create(['fileId' => 'main_banner']);
                        /** Allowed extension types */
                        $uploader->setAllowedExtensions(['jpg', 'jpeg', 'png']);
                        /** rename file name if already exists */
                        $uploader->setAllowRenameFiles(true);
                        $uploader->validateFile();
                        /** upload file in folder "mycustomfolder" */
                        $result = $uploader->save($target);
                        $imagePath = $targetOne . $result['file'];
                        $data['main_banner'] = $imagePath;
                    } catch (ValidationException $e) {
                        // throw new LocalizedException(__('Upload valid profile image. Only JPG, JPEG, PNG and WEBP are allowed'));
                        $this->messageManager->addError(__('Upload valid image. Only JPG, JPEG and PNG are allowed'));
                        return $this->_redirect('*/*/edit');
                    }
                } else {
                    $this->messageManager->addError(__('please upload less than 2MB images'));
                    return $this->_redirect('*/*/edit');
                }
            } else if ($id != '' && isset($data['main_banner']) && $_FILES['main_banner']['name'] == '') {
                $imgValue = implode("", $data['main_banner']);
                $data['main_banner'] = $imgValue;
                $model->setData($data);
                $model->save();
                $this->saveProducts($model, $data);
                $this->messageManager->addSuccess(__('Data successfully saved.'));
                return $this->_redirect('*/*/index');
            } else {
                $this->messageManager->addError(__('Image is Required, Please choose the image'));
                return $this->_redirect('*/*/edit');
            }
            if (isset($data['main_banner']['value'])) {
                $data['main_banner'] = $data['main_banner']['value'];
            }
            if ($id) {
                $model->load($id);
            }
            $model->setData($data);

            try {
                $model->save();
                $this->saveProducts($model, $data);

                $this->messageManager->addSuccess(__('You saved this data.'));
                $this->_objectManager->get('Magento\Backend\Model\Session')->setFormData(false);
                if ($this->getRequest()->getParam('back')) {
                    return $resultRedirect->setPath('*/*/edit', ['contact_id' => $model->getId(), '_current' => true]);
                }
                return $resultRedirect->setPath('*/*/');
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\RuntimeException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addException($e, __('Something went wrong while saving the contact.'));
            }

            $this->_getSession()->setFormData($data);
            return $resultRedirect->setPath('*/*/edit', ['contact_id' => $this->getRequest()->getParam('contact_id')]);
        }
        return $resultRedirect->setPath('*/*/');
    }

    public function saveProducts($model, $post)
    {
        // Attach the attachments to contact
        if (isset($post['products'])) {
            $productIds = $this->_jsHelper->decodeGridSerializedInput($post['products']);
            try {
                $oldProducts = (array) $model->getProducts($model);
                $newProducts = (array) $productIds;

                $this->_resources = \Magento\Framework\App\ObjectManager::getInstance()->get('Magento\Framework\App\ResourceConnection');
                $connection = $this->_resources->getConnection();

                $table = $this->_resources->getTableName(\Webspeaks\ProductsGrid\Model\ResourceModel\Contact::TBL_ATT_PRODUCT);
                $insert = array_diff($newProducts, $oldProducts);
                $delete = array_diff($oldProducts, $newProducts);

                if ($delete) {
                    $where = ['contact_id = ?' => (int) $model->getId(), 'product_id IN (?)' => $delete];
                    $connection->delete($table, $where);
                }

                if ($insert) {
                    $data = [];
                    foreach ($insert as $product_id) {
                        $data[] = ['contact_id' => (int) $model->getId(), 'product_id' => (int) $product_id];
                    }
                    $connection->insertMultiple($table, $data);
                }
            } catch (Exception $e) {
                $this->messageManager->addException($e, __('Something went wrong while saving the contact.'));
            }
        }

    }
}
