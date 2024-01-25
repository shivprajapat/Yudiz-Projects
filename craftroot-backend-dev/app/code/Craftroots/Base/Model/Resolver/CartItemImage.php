<?php

declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Quote\Model\Quote\Item;

/**
 * @inheritdoc
 */
class CartItemImage implements ResolverInterface
{
    protected $imageHelper;
    protected $productRepository;

    public function __construct(
        \Magento\Catalog\Helper\Image $imageHelper,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository

    ) {
        $this->imageHelper = $imageHelper;
        $this->productRepository = $productRepository;
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        if (!isset($value['model'])) {
            throw new LocalizedException(__('"model" value should be specified'));
        }
        /** @var Item $cartItem */

        $cartItem = $value['model'];
        $image_url = $this->getItemImage($cartItem->getSku());
        return $image_url;
    }

    /**
     * @param int $id
     * @return string
     */
    public function getItemImage($sku)
    {
        try {
            $_product = $this->productRepository->get($sku);
        } catch (NoSuchEntityException $e) {
            return '';
        }
        $imageUrl = $this->imageHelper->init($_product, 'cart_page_product_thumbnail')
            ->setImageFile($_product->getThumbnail()) // image,small_image,thumbnail
            ->keepAspectRatio(true)
        // ->resize(110, 130)
            ->getUrl();
        return $imageUrl;
    }
}
