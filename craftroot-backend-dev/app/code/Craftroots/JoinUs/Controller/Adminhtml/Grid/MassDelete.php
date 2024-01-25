<?php
namespace Craftroots\JoinUs\Controller\Adminhtml\Grid;

use Magento\Framework\Controller\ResultFactory;
use Magento\Backend\App\Action\Context;
use Magento\Ui\Component\MassAction\Filter;
use Craftroots\JoinUs\Model\ResourceModel\JoinUs\CollectionFactory;
use Craftroots\JoinUs\Model\JoinUs;

class MassDelete extends \Magento\Backend\App\Action
{
    protected $filter;
    protected $collectionFactory;
    protected $jobmodel;

    public function __construct(Context $context,
        Filter $filter,
        CollectionFactory $collectionFactory,
        JoinUs $jobmodel
    ) {
        $this->filter = $filter;
        $this->collectionFactory = $collectionFactory;
        $this->jobmodel = $jobmodel;
        parent::__construct($context);
    }

    public function execute()
    {
        $jobData = $this->collectionFactory->create();

        foreach ($jobData as $value) {
            $templateId[]=$value['entity_id'];
        }
        $parameterData = $this->getRequest()->getParams('entity_id');
        $selectedAppsid = $this->getRequest()->getParams('entity_id');
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
        $delete = 0;
        $model=[];
        foreach ($collection as $item) {
            $this->deleteById($item->getEntityId());
            $delete++;
        }
        $this->messageManager->addSuccess(__('A total of %1 Story Content have been deleted.', $delete));
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        return $resultRedirect->setPath('*/*/index');
    }
    
    public function deleteById($id){
        $item = $this->jobmodel->load($id);
        $item->delete();
        return;
    }
}
