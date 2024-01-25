<?php

namespace Craftroots\Assistance\Model;

use Craftroots\Assistance\Api\Data\AssistanceInterface;

class Assistance extends \Magento\Framework\Model\AbstractModel implements AssistanceInterface
{
    /**
     * CMS page cache tag.
     */
    const CACHE_TAG = 'craftroots_assistance';

    /**
     * @var string
     */
    protected $_cacheTag = 'craftroots_assistance';

    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'craftroots_assistance';

    /**
     * Initialize resource model.
     */
    protected function _construct()
    {
        $this->_init('Craftroots\Assistance\Model\ResourceModel\Assistance');
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

    public function getName()
    {
        return $this->getData(self::NAME);
    }

    public function setName($name)
    {
        return $this->setData(self::NAME, $name);
    }

    public function getEmail()
    {
        return $this->getData(self::EMAIL);
    }

    public function setEmail($email)
    {
        return $this->setData(self::EMAIL, $email);
    }

    public function getTelephone()
    {
        return $this->getData(self::TELEPHONE);
    }

    public function setTelephone($telephone)
    {
        return $this->setData(self::TELEPHONE, $telephone);
    }

    public function getMessage()
    {
        return $this->getData(self::MESSAGE);
    }

    public function setMessage($message)
    {
        return $this->setData(self::MESSAGE, $message);
    }

    public function getCreatedAt()
    {
        return $this->getData(self::CREATED_AT);
    }

    public function setCreatedAt($createdAt)
    {
        return $this->setData(self::CREATED_AT, $createdAt);
    }

    public function getUpdatedAt()
    {
        return $this->getData(self::UPDATED_AT);
    }

    public function setUpdatedAt($updatedAt)
    {
        return $this->setData(self::UPDATED_AT, $updatedAt);
    }

}
