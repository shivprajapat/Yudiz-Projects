<?php
namespace Craftroots\DiscoverRegion\Model;

use Craftroots\DiscoverRegion\Api\Data\DiscoverInterface;

class Discover extends \Magento\Framework\Model\AbstractModel implements DiscoverInterface
{
    /**
     * CMS page cache tag.
     */
    const CACHE_TAG = 'craftroots_DiscoverRegion';

    /**
     * @var string
     */
    protected $_cacheTag = 'craftroots_DiscoverRegion';

    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'craftroots_DiscoverRegion';

    /**
     * Initialize resource model.
     */
    protected function _construct()
    {
        $this->_init(\Craftroots\DiscoverRegion\Model\ResourceModel\Discover::class);
    }

    /**
     * Get EntityId.
     *
     * @return int
     */
    public function getEntityId()
    {
        return $this->getData(self::ENTITY_ID);
    }

    /**
     * Set EntityId.
     */
    public function setEntityId($entityId)
    {
        return $this->setData(self::ENTITY_ID, $entityId);
    }

    /**
     * Get Title.
     *
     * @return varchar
     */
    public function getTitle()
    {
        return $this->getData(self::TITLE);
    }

    /**
     * Set Title.
     */
    public function setTitle($title)
    {
        return $this->setData(self::TITLE, $title);
    }

    public function getRegion()
    {
        return $this->getData(self::REGION);
    }
    public function setRegion($region)
    {
        return $this->setData(self::REGION, $region);
    }

    /**
     * Get CreatedAt.
     *
     * @return varchar
     */
    public function getCreatedAt()
    {
        return $this->getData(self::CREATED_AT);
    }

    /**
     * Set CreatedAt.
     */
    public function setCreatedAt($createdAt)
    {
        return $this->setData(self::CREATED_AT, $createdAt);
    }

    /**
     * Get UpdateTime.
     *
     * @return varchar
     */
    public function getUpdatedAt()
    {
        return $this->getData(self::UPDATED_AT);
    }

    /**
     * Set UpdateTime.
     */
    public function setUpdatedAt($updatedAt)
    {
        return $this->setData(self::UPDATED_AT, $updatedAt);
    }

    public function getFileupload()
    {
        return $this->getData(self::FILEUPLOAD);
    }

    public function setFileupload($fileupload)
    {
        return $this->setData(self::FILEUPLOAD, $fileupload);
    }

}
