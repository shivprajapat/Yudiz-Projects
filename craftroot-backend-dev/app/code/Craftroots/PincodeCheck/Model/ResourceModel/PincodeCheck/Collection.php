<?php


namespace Craftroots\PincodeCheck\Model\ResourceModel\PincodeCheck;

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
        $this->_init('Craftroots\PincodeCheck\Model\PincodeCheck', 'Craftroots\PincodeCheck\Model\ResourceModel\PincodeCheck');
    }
}