<?php


namespace Craftroots\Assistance\Model\ResourceModel\Assistance;

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
        $this->_init('Craftroots\Assistance\Model\Assistance', 'Craftroots\Assistance\Model\ResourceModel\Assistance');
    }
}