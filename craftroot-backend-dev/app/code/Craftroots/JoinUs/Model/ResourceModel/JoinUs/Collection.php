<?php


namespace  Craftroots\JoinUs\Model\ResourceModel\JoinUs;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * @var string
     */
    protected $_idFieldName = 'entity_id';
    /**
     * Define resource model.
     */
    protected function _construct()
    {
        $this->_init(' Craftroots\JoinUs\Model\JoinUs', ' Craftroots\JoinUs\Model\ResourceModel\JoinUs');
    }
}