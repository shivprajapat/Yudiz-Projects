<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Craftroots\Base\Model\Resolver\ShippingAddress;

use Magento\Framework\Api\ExtensibleDataObjectConverter;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Quote\Api\Data\ShippingMethodInterface;
use Magento\Quote\Model\Cart\ShippingMethodConverter;
use Magento\Quote\Model\Quote\TotalsCollector;

/**
 * @inheritdoc
 */
class AvailableShippingMethods implements ResolverInterface
{
    /**
     * @var ExtensibleDataObjectConverter
     */
    private $dataObjectConverter;

    /**
     * @var ShippingMethodConverter
     */
    private $shippingMethodConverter;

    /**
     * @var TotalsCollector
     */
    private $totalsCollector;

    /**
     * @param ExtensibleDataObjectConverter $dataObjectConverter
     * @param ShippingMethodConverter $shippingMethodConverter
     * @param TotalsCollector $totalsCollector
     */
    public function __construct(
        ExtensibleDataObjectConverter $dataObjectConverter,
        ShippingMethodConverter $shippingMethodConverter,
        TotalsCollector $totalsCollector
    ) {
        $this->dataObjectConverter = $dataObjectConverter;
        $this->shippingMethodConverter = $shippingMethodConverter;
        $this->totalsCollector = $totalsCollector;
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        $writer = new \Zend_Log_Writer_Stream(BP . '/var/log/shippingrate.log');
        $logger = new \Zend_Log();
        $logger->addWriter($writer);
        
        if (!isset($value['model'])) {
            throw new LocalizedException(__('"model" values should be specified'));
        }
        $address = clone $value['model'];
        $address->setLimitCarrier(null);

        // Allow shipping rates by setting country id for new addresses
        if (!$address->getCountryId() && $address->getCountryCode()) {
            $address->setCountryId($address->getCountryCode());
        }
        $logger->info('address');
        $logger->info(json_encode($address->getData()));
        $address->setCollectShippingRates(true);
        $cart = $address->getQuote();
        $this->totalsCollector->collectAddressTotals($cart, $address);
        $methods = [];
        $_rates = $cart->getShippingAddress()->getShippingRatesCollection();
        $logger->info('_rates');
        $logger->info(json_encode($_rates->getData()));
        
        foreach ($_rates as $rate) {
            $logger->info('rate');
            $logger->info(json_encode($rate->getData()));
            $methodData = $this->dataObjectConverter->toFlatArray(
            $this->shippingMethodConverter->modelToDataObject($rate, $cart->getQuoteCurrencyCode()),
            [],
            ShippingMethodInterface::class
            );
            $logger->info('methodData');
            $logger->info(json_encode($methodData));
            $methods[$methodData['method_code']] = $this->processMoneyTypeData(
                $methodData,
                $cart->getQuoteCurrencyCode()
            );
        }
        // $shippingRates = $address->getGroupedAllShippingRates();
        // $logger->info('shippingRates');
        // $logger->info(json_encode($shippingRates));
        // foreach ($shippingRates as $carrierRates) {
        //     foreach ($carrierRates as $rate) {
        //             $logger->info('rate');
        //             $logger->info(json_encode($rate->getData()));
        //             $methodData = $this->dataObjectConverter->toFlatArray(
        //             $this->shippingMethodConverter->modelToDataObject($rate, $cart->getQuoteCurrencyCode()),
        //             [],
        //             ShippingMethodInterface::class
        //             );
        //             $logger->info('methodData');
        //             $logger->info(json_encode($methodData));
        //             $methods[] = $this->processMoneyTypeData(
        //                 $methodData,
        //                 $cart->getQuoteCurrencyCode()
        //             );
        //     }
        // }

    $free = [];

    foreach ($methods as $methods_value) {
        if ($methods_value['carrier_code'] == 'freeshipping' && $methods_value['method_code'] == 'freeshipping') {
            $free[] = $methods_value;
        }
    }

    if ($free) {
        return $free;
    }
        return $methods;
    }

    /**
     * Process money type data
     *
     * @param array $data
     * @param string $quoteCurrencyCode
     * @return array
     */
    private function processMoneyTypeData(array $data, string $quoteCurrencyCode): array
    {
        if (isset($data['amount'])) {
            $data['amount'] = ['value' => $data['amount'], 'currency' => $quoteCurrencyCode];
        }

        /** @deprecated The field should not be used on the storefront */
        $data['base_amount'] = null;

        if (isset($data['price_excl_tax'])) {
            $data['price_excl_tax'] = ['value' => $data['price_excl_tax'], 'currency' => $quoteCurrencyCode];
        }

        if (isset($data['price_incl_tax'])) {
            $data['price_incl_tax'] = ['value' => $data['price_incl_tax'], 'currency' => $quoteCurrencyCode];
        }
        return $data;
    }
}
