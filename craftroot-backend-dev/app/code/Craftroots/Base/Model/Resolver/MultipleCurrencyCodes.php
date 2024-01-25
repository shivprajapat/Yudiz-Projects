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

class MultipleCurrencyCodes implements ResolverInterface
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
            $currency = $args['currentCurrencyCode']; // set currency code which you want to set
            if ($currency) {
                $this->_storeManager->getStore()->setCurrentCurrencyCode($currency);
                return [
                    'success' => true,
                    'message' => "currency changed successfully",
                ];
            }

        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }
    }

}
