<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Orders data reslover
 */
class MoreInfoProducts implements ResolverInterface
{
    /**
     * @var \Magento\Sales\Api\OrderRepositoryInterface
     */
    protected $orderRepository;

    /**
     * @var \Magento\Framework\Api\SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var \Magento\Framework\Pricing\PriceCurrencyInterface
     */
    protected $priceCurrency;

    private $productRepository;

    /**
     * @param \Magento\Sales\Api\OrderRepositoryInterface       $orderRepository
     * @param \Magento\Framework\Api\SearchCriteriaBuilder      $searchCriteriaBuilder
     * @param \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency
     */
    public function __construct(
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Framework\Pricing\Helper\Data $pricingHelper
    ) {
        $this->productRepository = $productRepository;
        $this->pricingHelper = $pricingHelper;
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

        if (!isset($args['sku'])) {
            throw new GraphQlInputException(__('Sku should be specified'));
        }
        $product = $this->productRepository->get($args['sku']);
        $data = [];
        $excludeAttr = [];
        $attributes = $product->getAttributes();
        foreach ($attributes as $attribute) {
            if ($this->isVisibleOnFrontend($attribute, $excludeAttr)) {
                $value = $attribute->getFrontend()->getValue($product);

                if ($value instanceof Phrase) {
                    $value = (string) $value;
                } elseif ($attribute->getFrontendInput() == 'price' && is_string($value)) {
                    $value = $this->priceCurrency->convertAndFormat($value);
                }

                if (is_string($value) && strlen(trim($value))) {
                    $data[] = [
                        'label' => $attribute->getStoreLabel(),
                        'value' => $value,
                        'attribute_code' => $attribute->getAttributeCode(),
                    ];
                }
            }
        }

        return ['data' => $data];
    }

    /**
     * Determine if we should display the attribute on the front-end
     *
     * @param \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute
     * @param array $excludeAttr
     * @return bool
     * @since 103.0.0
     */
    protected function isVisibleOnFrontend(
        \Magento\Eav\Model\Entity\Attribute\AbstractAttribute $attribute,
        array $excludeAttr
    ) {
        return ($attribute->getIsVisibleOnFront() && !in_array($attribute->getAttributeCode(), $excludeAttr));
    }
}
