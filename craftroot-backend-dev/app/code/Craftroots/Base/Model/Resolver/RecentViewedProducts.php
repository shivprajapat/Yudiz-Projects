<?php
/**
 * Landofcoder
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Landofcoder.com license that is
 * available through the world-wide-web at this URL:
 * https://landofcoder.com/terms
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category   Landofcoder
 * @package    Lof_RecentViewedGraphQl
 * @copyright  Copyright (c) 2022 Landofcoder (https://www.landofcoder.com/)
 * @license    https://landofcoder.com/terms
 */

namespace Craftroots\Base\Model\Resolver;

use Magento\CatalogGraphQl\Model\Resolver\Products\Query\ProductQueryInterface;
use Magento\CustomerGraphQl\Model\Customer\GetCustomer;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlAuthorizationException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

class RecentViewedProducts implements ResolverInterface
{

    /**
     * @var GetCustomer
     */
    private $getCustomer;

    /**
     * @var \Magento\Reports\Block\Product\Viewed
     */
    protected $recentlyViewed;

    /**
     * @var ProductQueryInterface
     */
    private $searchQuery;

    /**
     * @param \Magento\Reports\Block\Product\Viewed $recentlyViewed
     * @param GetCustomer $getCustomer
     * @param ProductQueryInterface $searchQuery
     */
    public function __construct(
        \Magento\Reports\Block\Product\Viewed $recentlyViewed,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Framework\Pricing\Helper\Data $pricingHelper,
        \Magento\Store\Model\StoreManagerInterface $storemanager,
        \Craftroots\Base\Helper\Data $customHelper,
        \Magento\Swatches\Helper\Data $swatchHelper,
        GetCustomer $getCustomer,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute $eavAttribute,
        ProductQueryInterface $searchQuery
    ) {
        $this->recentlyViewed = $recentlyViewed;
        $this->getCustomer = $getCustomer;
        $this->searchQuery = $searchQuery;
        $this->productRepository = $productRepository;
        $this->pricingHelper = $pricingHelper;
        $this->customHelper = $customHelper;
        $this->swatchHelper = $swatchHelper;
        $this->_storeManager = $storemanager;
        $this->_eavAttribute = $eavAttribute;
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
            $storeId = (int) $context->getExtensionAttributes()->getStore()->getId();
            /** @var ContextInterface $context */
            if (!$context->getExtensionAttributes()->getIsCustomer()) {
                throw new GraphQlAuthorizationException(__('The current customer isn\'t authorized.'));
            }
            $pageSize = isset($args['pageSize']) ? (int) $args['pageSize'] : 5;
            $currentPage = isset($args['currentPage']) ? $args['currentPage'] : 1;

            $customer = $this->getCustomer->execute($context);
            $collection = $this->recentlyViewed->getItemsCollection();
            $collection->setCustomerId($customer->getId());
            //echo $collection->getSelect();die(" sss");
            $collection->addFieldToFilter("item_store_id", $storeId);
            $collection->setPageSize($pageSize);
            $collection->setCurPage($currentPage);
            $recent_product = $collection->load();
            $recentData = [];
            foreach ($recent_product as $i => $recent) {
                $recentModel = $recent->load($recent->getId());
                $image = $this->customHelper->getImageUrl($recentModel, 'product_thumbnail_image');
                $price = $this->pricingHelper->currency($recentModel->getPrice(), true, false);
                $description = $recentModel->getDescription() ? substr($recentModel->getDescription(), 0, 30) : '<p>&nbsp;</p>';
                $description = $description . " ...";
                $store = $this->_storeManager->getStore();
                $configurable_product = $recentModel->getTypeId();
                $regularPrice = '';
                $specialPrice = '';
                if ($configurable_product == "configurable") {
                    $basePrice = $recentModel->getPriceInfo()->getPrice('regular_price');
                    $regularPrice = $basePrice->getMinRegularAmount()->getValue();
                    $specialPrice = $recentModel->getFinalPrice();
                    $recentProductConfigchild = [];
                    $recent_childrens = $recent->getTypeInstance()->getUsedProducts($recent);
                    if ($recent_childrens) {
                        foreach ($recent_childrens as $recent_childs) {
                            $recentChildStockStatus = '';
                            $recentChildProductStock = $this->customHelper->getStockItem($recent_childs->getId());
                            $recentChildSku = $recent_childs->getSku();
                            $salebleQty = $this->customHelper->getProductSalableQty($recentChildSku);
                            if ($recentChildProductStock->getIsInStock() == 1 && $salebleQty[0]['qty'] > 0) {
                                $recentChildStockStatus = 'IN_STOCK';
                            } else {
                                $recentChildStockStatus = 'OUT_OF_STOCK';
                            }
                            $parentSku = $recentModel->getSku();
                            $AttributeByChild = $this->customHelper->getChildSuperAttribute($parentSku, $recentChildSku);
                            $product_child_id = $recent_childs->getId();
                            $product_child_img = $this->productRepository->getById($product_child_id);
                            $recentproductChildImageUrl = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $product_child_img->getImage();
                            $recentProductConfigchild[] =
                                [
                                "childId" => $recent_childs->getId(),
                                "childName" => $recent_childs->getName(),
                                "childSku" => $recent_childs->getSku(),
                                "childImage" => $recentproductChildImageUrl,
                                "childstockstatus" => $recentChildStockStatus,
                                "configurable_options" => $AttributeByChild,

                            ];
                        }
                    }

                }
                $recentData['data'][$i]['model'] = $recentModel;
                $recentData['data'][$i]['id'] = $recentModel->getId();
                $recentData['data'][$i]['name'] = $recentModel->getName();
                $recentData['data'][$i]['price'] = $price;
                $recentData['data'][$i]['final_price'] = $this->pricingHelper
                    ->currency($recentModel->getFinalPrice(), true, false);
                $recentData['data'][$i]['sku'] = $recentModel->getSku();
                $recentData['data'][$i]['image'] = $image;
                $recentData['data'][$i]['description'] = $description;
                $recentData['data'][$i]['urlkey'] = $recentModel->getUrlKey() . '.html';
                $recentData['data'][$i]['type'] = $recentModel->getTypeId();
                $recentData['data'][$i]['regularPrice'] = $regularPrice;
                $recentData['data'][$i]['currentPage'] = $currentPage;
                $recentData['data'][$i]['pageSize'] = $pageSize;

                if ($this->customHelper->getProductStockStatus($recentModel)) {
                    $recentData['data'][$i]['stock_status_data'] = $this->customHelper->getProductStockStatus($recentModel);
                }

                if ($recentModel->getTypeId() == "configurable") {
                    $recentData['data'][$i]['child'] = $recentProductConfigchild;
                }

                if ($recentModel->getTypeId() == "simple" && $recentModel->getHasOptions()) {
                    $recentData['data'][$i]['type'] = "simple_custom";
                }
                $i++;
            }
            $recentData['pageSize'] = $pageSize;
            $recentData['currentPage'] = $currentPage;
            return $recentData;

        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }
    }

}
