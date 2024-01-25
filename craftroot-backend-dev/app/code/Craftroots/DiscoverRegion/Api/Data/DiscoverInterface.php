<?php

namespace Craftroots\DiscoverRegion\Api\Data;

interface DiscoverInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case.
     */
    const ENTITY_ID = 'entity_id';
    const TITLE = 'title';
    const REGION = 'region';
    const FILEUPLOAD = 'fileupload';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

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

    public function getFileupload();

    public function setFileupload($fileupload);

    public function getRegion();

    public function setRegion($region);

}
