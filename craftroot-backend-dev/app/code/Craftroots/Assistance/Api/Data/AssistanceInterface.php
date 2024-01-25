<?php

namespace Craftroots\Assistance\Api\Data;

interface AssistanceInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case.
     */
    const ENTITY_ID = 'entity_id';
    const NAME = 'name';
    const EMAIL = 'email';
    const TELEPHONE = 'telephone';
    const MESSAGE = 'message';
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

    public function getMessage();
    public function setMessage($message);

    public function getCreatedAt();

    public function setCreatedAt($createdAt);

    public function getUpdatedAt();
    public function setUpdatedAt($updatedAt);

}
