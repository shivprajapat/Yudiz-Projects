<?php
namespace Craftroots\Story\Model\ResourceModel\Extension;

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
        $this->_init(
            \Craftroots\Story\Model\Extension::class,
            \Craftroots\Story\Model\ResourceModel\Extension::class,
        );
        
        parent::_construct();
    }
}