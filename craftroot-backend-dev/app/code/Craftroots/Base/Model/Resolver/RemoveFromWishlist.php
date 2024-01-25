<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Customer\Model\ResourceModel\Address\CollectionFactory as AddressCollectionFactory;
use Magento\Directory\Model\CountryFactory;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Orders data reslover
 */
class RemoveFromWishlist implements ResolverInterface
{
    /**
     * @var \Magento\Customer\Model\ResourceModel\Address\CollectionFactory
     */
    private $addressCollectionFactory;

    /**
     * @param AddressCollectionFactory $addressCollectionFactory
     * @param CountryFactory $countryFactory
     */
    public function __construct(
        \Magento\Wishlist\Model\Wishlist $wishlist
    ) {
        $this->wishlist = $wishlist;
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
        $productName = "";

        if (!$context->getUserId()) {
            throw new GraphQlInputException(
                __("Customer is not authorized.")
            );
        }

        if (!isset($args['product_id'])) {
            throw new GraphQlInputException(__('Product id should be specified'));
        }

        $wish = $this->wishlist->loadByCustomerId($context->getUserId());
        $items = $wish->getItemCollection();

        /** @var \Magento\Wishlist\Model\Item $item */
        try {
            foreach ($items as $item) {
                if ($item->getProductId() == $args['product_id']) {
                    $productName = $item->getProductName();
                    $item->delete();
                    $wish->save();
                }
            }
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

        return ['success' => true, 'message' => $productName . ' removed from wishlist.'];
    }
}
