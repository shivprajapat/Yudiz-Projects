<?php
namespace Craftroots\Story\Controller\Adminhtml\Grid;

use Magento\Framework\Controller\ResultFactory;
use Magento\Backend\App\Action\Context;
use Magento\Ui\Component\MassAction\Filter;
use Craftroots\Story\Model\ResourceModel\Extension\CollectionFactory;
use Craftroots\Story\Model\Extension;

class MassStatus extends \Magento\Backend\App\Action
{
    protected $filter;
    protected $collectionFactory;
    protected $gridmodel;

    public function __construct(Context $context,
        Filter $filter,
        CollectionFactory $collectionFactory,
        Extension $gridmodel
    ) {
        $this->filter = $filter;
        $this->collectionFactory = $collectionFactory;
        $this->gridmodel = $gridmodel;
        parent::__construct($context);
    }

    public function execute()
    {
        $jobData = $this->collectionFactory->create();

        foreach ($jobData as $value) {
            $templateId[]=$value['entity_id'];
        }
        $parameterData = $this->getRequest()->getParams('status');
        $selectedAppsid = $this->getRequest()->getParams('status');
        if (array_key_exists("selected", $parameterData)) {
            $selectedAppsid = $parameterData['selected'];
        }
        if (array_key_exists("excluded", $parameterData)) {
            if ($parameterData['excluded'] == 'false') {
                $selectedAppsid = $templateId;
            } else {
                $selectedAppsid = array_diff($templateId, $parameterData['excluded']);
            }
        }
        $collection = $this->collectionFactory->create();
        $collection->addFieldToFilter('entity_id', ['in'=>$selectedAppsid]);
        $status = 0;
        $model=[];
        foreach ($collection as $item) {
            $this->setStatus($item->getEntityId(),$this->getRequest()->getParam('status'));
            $status++;
        }
        $this->messageManager->addSuccess(__('A total of %1 Story Content were updated.', $status));
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        return $resultRedirect->setPath('*/*/');
    }

    public function setStatus($id, $Param){
        $item = $this->gridmodel->load($id);
        $item->setStatus($Param)->save();
        return;
    }
}
