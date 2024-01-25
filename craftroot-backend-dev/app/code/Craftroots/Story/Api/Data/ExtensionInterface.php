<?php

namespace Craftroots\Story\Api\Data;

interface ExtensionInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case.
     */
    const ENTITY_ID = 'entity_id';
    const TITLE = 'title';
    const NAME = 'name';
    const OCCUPATION = 'occupation';
    const DESCRIPTION = 'description';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    const STATUS = 'status';
    const FILEUPLOAD = 'fileupload';
    const TYPE = 'type';

    /**
     * Get Entity Id.
     *
     * @return int
     */
    public function getEntityId();

    /**
     * Set Entity Id.
     */
    public function setEntityId($entityId);

    /**
     * Get Title.
     *
     * @return varchar
     */
    public function getTitle();

    /**
     * Set Title.
     */
    public function setTitle($title);

    public function getName();

    public function setName($name);

    public function getOccupation();

    public function setOccupation($occupation);

    /**
     * Get Description.
     *
     * @return varchar
     */
    public function getDescription();

    /**
     * Set Description.
     */
    public function setDescription($description);

    /**
     * Get UpdatedAt.
     *
     * @return int
     */
    public function getUpdatedAt();

    /**
     * Set UpdatedAt.
     */
    public function setUpdatedAt($updatedAt);

    /**
     * Get CreatedAt.
     *
     * @return varchar
     */
    public function getCreatedAt();

    /**
     * Set CreatedAt.
     */
    public function setCreatedAt($createdAt);

    /**
     * Get Status.
     *
     * @return varchar
     */
    public function getStatus();

    /**
     * Set Status.
     */
    public function setStatus($status);

    public function getFileupload();

    public function setFileupload($fileupload);

    public function getType();
    public function setType($type);

}
