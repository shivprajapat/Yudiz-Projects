<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Psr\Log\LoggerInterface;

class AttributeRegion implements ResolverInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    protected $eavConfig;
    protected $_storeManager;

    public function __construct(

        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Eav\Model\Config $eavConfig,
        LoggerInterface $logger
    ) {

        $this->_storeManager = $storeManager;
        $this->eavConfig = $eavConfig;
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
            $regionData = $this->getOptionList();
            $regionAraays = [];
            $i = 0;
            foreach ($regionData as $regionCollection) {
                $regionAraays['data'][$i]['value'] = $regionCollection['value'];
                $regionAraays['data'][$i]['label'] = $regionCollection['label'];
                $i++;
            }
            $regionAraays['attributeCode'] = "region";
            return $regionAraays;
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
