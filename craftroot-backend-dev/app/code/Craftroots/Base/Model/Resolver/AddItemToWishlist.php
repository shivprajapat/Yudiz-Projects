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
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Orders data reslover
 */
class AddItemToWishlist implements ResolverInterface
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
        \Magento\Wishlist\Model\WishlistFactory $wishlistRepository,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository
    ) {
        $this->_wishlistRepository = $wishlistRepository;
        $this->_productRepository = $productRepository;
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

        try {
            $product = $this->_productRepository->getById($args['product_id']);
        } catch (NoSuchEntityException $e) {
            return ['success' => false, 'message' => $e];
        }

        $wishlist = $this->_wishlistRepository->create()->loadByCustomerId($context->getUserId(), true);
        $wishlist->addNewItem($product);
        $wishlist->save();

        return ['success' => true, 'message' => $product->getName() . ' added to wishlist.'];
    }
}
