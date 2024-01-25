<?php
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Orders data reslover
 */
class RelatedProducts implements ResolverInterface
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

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */

    private $productRepository;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute
     */
    protected $_eavAttribute;

    /**
     * @param \Magento\Sales\Api\OrderRepositoryInterface       $orderRepository
     * @param \Magento\Framework\Api\SearchCriteriaBuilder      $searchCriteriaBuilder
     * @param \Magento\Framework\Pricing\PriceCurrencyInterface $priceCurrency
     */
    public function __construct(
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Framework\Pricing\Helper\Data $pricingHelper,
        \Magento\Store\Model\StoreManagerInterface $storemanager,
        \Craftroots\Base\Helper\Data $customHelper,
        \Magento\Swatches\Helper\Data $swatchHelper,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute $eavAttribute
    ) {
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
        if (!isset($args['sku'])) {
            throw new GraphQlInputException(__('Sku should be specified'));
        }
        try {
            $products = $this->productRepository->get($args['sku']);
            $related_product = $products->getRelatedProductCollection()->addAttributeToFilter('status', array('eq' => \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED));
            $relatedData = [];
            $stock_status = null;

            foreach ($related_product as $i => $related) {
                $relatedModel = $related->load($related->getId());
                $image = $this->customHelper->getImageUrl($relatedModel, 'product_thumbnail_image');
                $price = $this->pricingHelper->currency($relatedModel->getPrice(), true, false);
                $description = $relatedModel->getDescription() ? substr($relatedModel->getDescription(), 0, 30) : '<p>&nbsp;</p>';
                $description = $description . " ...";
                $store = $this->_storeManager->getStore();
                $configurable_product = $relatedModel->getTypeId();
                $regularPrice = '';
                $specialPrice = '';
                if ($configurable_product == "configurable") {
                    $basePrice = $relatedModel->getPriceInfo()->getPrice('regular_price');
                    $regularPrice = $basePrice->getMinRegularAmount()->getValue();
                    $specialPrice = $relatedModel->getFinalPrice();
                    $relatedProductConfigchild = [];
                    $related_childrens = $related->getTypeInstance()->getUsedProducts($related);
                    if ($related_childrens) {
                        foreach ($related_childrens as $related_childs) {
                            $relatedChildStockStatus = '';
                            $relatedChildProductStock = $this->customHelper->getStockItem($related_childs->getId());
                            $relatedChildSku = $related_childs->getSku();
                            $salebleQty = $this->customHelper->getProductSalableQty($relatedChildSku);
                            if ($relatedChildProductStock->getIsInStock() == 1 && $salebleQty[0]['qty'] > 0) {
                                $relatedChildStockStatus = 'IN_STOCK';
                            } else {
                                $relatedChildStockStatus = 'OUT_OF_STOCK';
                            }
                            $parentSku = $relatedModel->getSku();
                            $AttributeByChild = $this->customHelper->getChildSuperAttribute($parentSku, $relatedChildSku);
                            $product_child_id = $related_childs->getId();
                            $product_child_img = $this->productRepository->getById($product_child_id);
                            $relatedproductChildImageUrl = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $product_child_img->getImage();
                            $relatedProductConfigchild[] =
                                [
                                "childId" => $related_childs->getId(),
                                "childName" => $related_childs->getName(),
                                "childSku" => $related_childs->getSku(),
                                "childImage" => $relatedproductChildImageUrl,
                                "childstockstatus" => $relatedChildStockStatus,
                                "configurable_options" => $AttributeByChild,

                            ];
                        }
                    }

                }
                $relatedData['data'][$i]['model'] = $relatedModel;
                $relatedData['data'][$i]['id'] = $relatedModel->getId();
                $relatedData['data'][$i]['name'] = $relatedModel->getName();
                $relatedData['data'][$i]['price'] = $price;
                $relatedData['data'][$i]['final_price'] = $this->pricingHelper
                    ->currency($relatedModel->getFinalPrice(), true, false);
                $relatedData['data'][$i]['sku'] = $relatedModel->getSku();
                $relatedData['data'][$i]['image'] = $image;
                $relatedData['data'][$i]['description'] = $description;
                $relatedData['data'][$i]['urlkey'] = $relatedModel->getUrlKey();
                $relatedData['data'][$i]['type'] = $relatedModel->getTypeId();
                $relatedData['data'][$i]['regularPrice'] = $regularPrice;
                $relatedData['data'][$i]['specialPrice'] = $specialPrice;

                if ($this->customHelper->getProductStockStatus($relatedModel)) {
                    $relatedData['data'][$i]['stock_status_data'] = $this->customHelper->getProductStockStatus($relatedModel);
                }

                if ($relatedModel->getTypeId() == "configurable") {
                    $relatedData['data'][$i]['child'] = $relatedProductConfigchild;
                }

                if ($relatedModel->getTypeId() == "simple" && $relatedModel->getHasOptions()) {
                    $relatedData['data'][$i]['type'] = "simple_custom";
                }
                $i++;
            }
            return $relatedData;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }

}
