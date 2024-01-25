<?php

declare (strict_types = 1);

namespace Craftroots\JoinUs\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

class GetRegion implements ResolverInterface
{
    protected $country;

    public function __construct(
        \Magento\Directory\Model\Country $country
    ) {
        $this->country = $country;
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

        if (!isset($args['country_id'])) {
            throw new GraphQlInputException(__('Country id should be specified'));
        }
        try {
            $regionArray = [];
            $regionCollection = $this->getRegionsOfCountry($args['country_id']);
            $i = 0;
            foreach ($regionCollection as $regionCollectionData) {
                $regionArray['data'][$i]['region_code'] = $regionCollectionData->getRegionId();
                $regionArray['data'][$i]['region_name'] = $regionCollectionData->getName();
                $i++;
            }

            return $regionArray;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }
    }
    public function getRegionsOfCountry($countryCode)
    {
        $regionCollection = $this->country->loadByCode($countryCode)->getRegions();
        return $regionCollection;
    }
}
