<?php

namespace Craftroots\PincodeCheck\Model;

use Craftroots\PincodeCheck\Api\Data\PincodeCheckInterface;

class PincodeCheck extends \Magento\Framework\Model\AbstractModel implements PincodeCheckInterface
{
    /**
     * CMS page cache tag.
     */
    const CACHE_TAG = 'shiprocket_token';

    /**
     * @var string
     */
    protected $_cacheTag = 'shiprocket_token';

    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'shiprocket_token';

    /**
     * Initialize resource model.
     */
    protected function _construct()
    {
        $this->_init('Craftroots\PincodeCheck\Model\ResourceModel\PincodeCheck');
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


    public function getToken()
    {
        return $this->getData(self::TOKEN);
    }

 
    public function setToken($token)
    {
        return $this->setData(self::TOKEN, $token);
    }

    public function getTokenDate()
    {
        return $this->getData(self::TOKEN_DATE);
    }

 
    public function setTokenDate($tokenDate)
    {
        return $this->setData(self::TOKEN_DATE, $tokenDate);
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