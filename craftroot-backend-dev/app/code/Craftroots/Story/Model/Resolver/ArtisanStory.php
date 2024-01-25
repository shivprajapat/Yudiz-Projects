<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Story\Model\Resolver;

use Craftroots\Story\Model\ResourceModel\Extension\CollectionFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Psr\Log\LoggerInterface;

class ArtisanStory implements ResolverInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public $collection;
    protected $_storeManager;

    public function __construct(
        CollectionFactory $collectionFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        LoggerInterface $logger
    ) {
        $this->collection = $collectionFactory;
        $this->_storeManager = $storeManager;
        $this->logger = $logger;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {

        try {
            $artisanData = [];
            $i = 0;
            $mediaUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            $collections = $this->collection->create();
            $collections->addFieldToFilter('status', '1');
            foreach ($collections as $data) {
                $artisanData['data'][$i]['title'] = $data->getTitle();
                $artisanData['data'][$i]['name'] = $data->getName();
                $artisanData['data'][$i]['description'] = $data->getDescription();
                $artisanData['data'][$i]['occupation'] = $data->getOccupation();
                $artisanData['data'][$i]['profile'] = $mediaUrl . $data->getFileUpload();
                $i++;
            }
            return $artisanData;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }
    }
}
