<?php
namespace Craftroots\DiscoverRegion\Model\ResourceModel\Discover;

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
            \Craftroots\DiscoverRegion\Model\Discover::class,
            \Craftroots\DiscoverRegion\Model\ResourceModel\Discover::class,
        );
        
        parent::_construct();
    }
}