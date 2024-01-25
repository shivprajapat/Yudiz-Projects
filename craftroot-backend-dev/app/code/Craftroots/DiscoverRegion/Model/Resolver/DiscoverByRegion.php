<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\DiscoverRegion\Model\Resolver;

use Craftroots\DiscoverRegion\Model\ResourceModel\Discover\CollectionFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Psr\Log\LoggerInterface;

class DiscoverByRegion implements ResolverInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public $collection;
    protected $_storeManager;
    protected $eavConfig;
    public function __construct(
        CollectionFactory $collectionFactory,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\Config $eavConfig,
        LoggerInterface $logger
    ) {
        $this->collection = $collectionFactory;
        $this->eavConfig = $eavConfig;
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
            $discoverData = [];
            $i = 0;
            $mediaUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            $collections = $this->collection->create();
            foreach ($collections as $data) {
                $regionData = $this->getOptionList();
                foreach ($regionData as $regionCollection) {
                    $regionId = $regionCollection['value'];
                    if ($regionId == $data->getRegion()) {
                        $regionLabel = $regionCollection['label'];
                    }
                }
                $discoverData['data'][$i]['title'] = $data->getTitle();
                $discoverData['data'][$i]['attributes'] = $regionLabel;
                $discoverData['data'][$i]['profile'] = $mediaUrl . $data->getFileUpload();
                $i++;
            }
            $discoverData['attributeCode'] = "region";
            return $discoverData;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }
    public function getOptionList()
    {
        $attribute = $this->eavConfig->getAttribute('catalog_product', 'region');
        return $attribute->getSource()->getAllOptions();
    }
}
