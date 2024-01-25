<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\JoinUs\Model\Resolver;

use Magento\Directory\Model\CountryFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Psr\Log\LoggerInterface;

/**
 * Orders data reslover
 */
class GetCountry implements ResolverInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    public $countryFactory;

    protected $_countryCollectionFactory;

    public function __construct(
        \Magento\Directory\Model\ResourceModel\Country\CollectionFactory $countryCollectionFactory,
        CountryFactory $countryFactory,
        LoggerInterface $logger
    ) {
        $this->logger = $logger;
        $this->_countryCollectionFactory = $countryCollectionFactory;
        $this->countryFactory = $countryFactory;
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
            $countryDataArray = [];
            $i = 0;
            $collection = $this->_countryCollectionFactory->create()->loadByStore();
            foreach ($collection as $countryCollectionData) {
                $countryId = $countryCollectionData->getCountryId();
                $countryName = $this->getCountryName($countryId);
                $countryDataArray['data'][$i]['country_code'] = $countryId;
                $countryDataArray['data'][$i]['country_name'] = $countryName;
                $i++;
            }
            return $countryDataArray;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }
    public function getCountryName($countryId)
    {
        $countryName = '';
        $country = $this->countryFactory->create()->loadByCode($countryId);
        if ($country) {
            $countryName = $country->getName();
        }
        return $countryName;
    }
}
