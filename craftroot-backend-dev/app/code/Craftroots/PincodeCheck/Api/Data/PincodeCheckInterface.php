<?php

namespace Craftroots\PincodeCheck\Api\Data;

interface PincodeCheckInterface  
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case.
     */
    const ENTITY_ID = 'entity_id';
    const TOKEN = 'token';
    const TOKEN_DATE = 'token_date';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';


    public function getEntityId();

    public function setEntityId($entityId);


    public function getToken();

    public function setToken($token);

    
    public function getTokenDate();

    public function setTokenDate($tokenDate);


    public function getCreatedAt();

    public function setCreatedAt($createdAt);


    public function getUpdatedAt();

    public function setUpdatedAt($updatedAt);


}