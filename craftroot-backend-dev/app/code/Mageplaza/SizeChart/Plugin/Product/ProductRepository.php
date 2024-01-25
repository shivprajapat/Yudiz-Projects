<?php
/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_SizeChart
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

namespace Mageplaza\SizeChart\Plugin\Product;

use Exception;
use Magento\Catalog\Api\Data\ProductSearchResultsInterface;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Model\Product;
use Magento\Cms\Model\Template\FilterProvider;
use Magento\Framework\Api\SearchResults;
use Mageplaza\SizeChart\Helper\Data as HelperData;

/**
 * Class ProductRepository
 * @package Mageplaza\SizeChart\Plugin
 */
class ProductRepository
{
    /**
     * @var HelperData
     */
    protected $helperData;

    /**
     * @var FilterProvider
     */
    protected $filterProvider;

    /**
     * ProductRepository constructor.
     *
     * @param HelperData $helperData
     * @param FilterProvider $filterProvider
     */
    public function __construct(
        HelperData $helperData,
        FilterProvider $filterProvider
    ) {
        $this->helperData = $helperData;
        $this->filterProvider = $filterProvider;
    }

    /**
     * @param ProductRepositoryInterface $subject
     * @param Product $result
     *
     * @return Product
     * @SuppressWarnings("Unused")
     * @throws Exception
     */
    public function afterGet(
        ProductRepositoryInterface $subject,
        $result
    ) {
        if (!$this->helperData->isEnabled()) {
            return $result;
        }

        $this->validateProduct($result);

        return $result;
    }

    /**
     * @param ProductRepositoryInterface $subject
     * @param SearchResults $searchCriteria
     *
     * @return ProductSearchResultsInterface|SearchResults
     * @throws Exception
     * @SuppressWarnings("Unused")
     */
    public function afterGetList(
        ProductRepositoryInterface $subject,
        SearchResults $searchCriteria
    ) {
        if (!$this->helperData->isEnabled()) {
            return $searchCriteria;
        }

        /** @var Product $entity */
        foreach ($searchCriteria->getItems() as &$entity) {
            $this->validateProduct($entity);
        }

        return $searchCriteria;
    }

    /**
     * @param Product $product
     *
     * @throws Exception
     */
    public function validateProduct($product)
    {
        $ruleCollection = $this->helperData->getRuleCollection();

        foreach ($ruleCollection as $rule) {
            if ($rule->getConditions()->validate($product)) {
                $productExtension = $product->getExtensionAttributes();
                $rule->setRuleContent($this->filterProvider->getBlockFilter()->filter($rule->getRuleContent()));
                $productExtension->setMpSizechart($rule);
                $product->setExtensionAttributes($productExtension);
                break;
            }
        }
    }
}
