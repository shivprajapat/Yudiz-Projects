<?php

namespace Craftroots\JoinUs\Model;

use Craftroots\JoinUs\Api\Data\JoinUsInterface;

class JoinUs extends \Magento\Framework\Model\AbstractModel implements JoinUsInterface
{
    /**
     * CMS page cache tag.
     */
    const CACHE_TAG = 'craftroots_joinus';

    /**
     * @var string
     */
    protected $_cacheTag = 'craftroots_joinus';

    /**
     * Prefix of model events names.
     *
     * @var string
     */
    protected $_eventPrefix = 'craftroots_joinus';

    /**
     * Initialize resource model.
     */
    protected function _construct()
    {
        $this->_init('Craftroots\JoinUs\Model\ResourceModel\JoinUs');
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

    public function getCity()
    {
        return $this->getData(self::CITY);
    }

 
    public function setCity($city)
    {
        return $this->setData(self::CITY, $city);
    }

    public function getState()
    {
        return $this->getData(self::STATE);
    }

 
    public function setState($state)
    {
        return $this->setData(self::STATE, $state);
    }

   
    public function getImages()
    {
        return $this->getData(self::IMAGES);
    }

 
    public function setImages($images)
    {
        return $this->setData(self::IMAGES, $images);
    }

    public function getCountry()
    {
        return $this->getData(self::COUNTRY);
    }

    public function setCountry($country)
    {
        return $this->setData(self::COUNTRY, $country);
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