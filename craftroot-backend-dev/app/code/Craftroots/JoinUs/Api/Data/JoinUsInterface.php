<?php

namespace Craftroots\JoinUs\Api\Data;

interface JoinUsInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case.
     */
    const ENTITY_ID = 'entity_id';
    const NAME = 'name';
    const EMAIL = 'email';
    const TELEPHONE = 'telephone';
    const CITY = 'city';
    const STATE = 'state';
    const IMAGES = 'images';
    const COUNTRY = 'country';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    /**
     * Get EntityId.
     *
     * @return int
     */
    public function getEntityId();

    /**
     * Set EntityId.
     */
    public function setEntityId($entityId);

    public function getName();

    public function setName($name);

    public function getEmail();

    public function setEmail($email);

    public function getTelephone();
    public function setTelephone($telephone);

    public function getCity();
    public function setCity($city);

    public function getState();
    public function setState($state);

    public function getImages();
    public function setImages($images);

    public function getCountry();
    public function setCountry($country);

    public function getCreatedAt();

    public function setCreatedAt($createdAt);

    public function getUpdatedAt();
    public function setUpdatedAt($updatedAt);

}
