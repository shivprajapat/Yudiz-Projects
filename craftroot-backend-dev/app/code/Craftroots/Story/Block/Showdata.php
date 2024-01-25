<?php

namespace Craftroots\Story\Block;

use Magento\Framework\View\Element\Template;
use Magento\Backend\Block\Template\Context;
use Craftroots\Story\Model\ResourceModel\Extension\CollectionFactory;

class Showdata extends Template
{
    public $collection;

    public function __construct(
        Context $context, 
        CollectionFactory $collectionFactory,
        array $data = []
    ){
        $this->collection = $collectionFactory;
        parent::__construct($context, $data);
    }
    public function getCollection()
    {
        $collections = $this->collection->create();
        $collections->addFieldToFilter('status', '1');
        $collections->getSelect()->order('position','ASC'); 
        return $collections;
    }
}