<?php
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * @inheritdoc
 */
class LatestProducts implements ResolverInterface
{

    /**
     * @var SendFriendHelper
     */
    private $sendFriendHelper;

    /**
     * @var SendEmail
     */
    private $sendEmail;

    /**
     * @var \Magento\Eav\Model\ResourceModel\Entity\Attribute
     */
    protected $_eavAttribute;
    protected $stockRegistryInterface;

    /**
     * @param SendEmail $sendEmail
     * @param SendFriendHelper $sendFriendHelper
     */
    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $productCollectionFactory,
        \Magento\Framework\Pricing\Helper\Data $pricingHelper,
        \Magento\CatalogInventory\Api\StockRegistryInterface $stockRegistryInterface,
        \Craftroots\Base\Helper\Data $customHelper,
        \Magento\Store\Model\StoreManagerInterface $storemanager,
        \Magento\Catalog\Api\ProductRepositoryInterface $productrepository,
        \Magento\Eav\Model\ResourceModel\Entity\Attribute $eavAttribute,
        \Magento\Swatches\Helper\Data $swatchHelper
    ) {
        $this->_scopeConfig = $scopeConfig;
        $this->_productCollectionFactory = $productCollectionFactory;
        $this->pricingHelper = $pricingHelper;
        $this->customHelper = $customHelper;
        $this->productrepository = $productrepository;
        $this->swatchHelper = $swatchHelper;
        $this->pricingHelper = $pricingHelper;
        $this->_storeManager = $storemanager;
        $this->_eavAttribute = $eavAttribute;
        $this->stockRegistryInterface = $stockRegistryInterface;
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        try {
            $collection = $this->_productCollectionFactory->create()
                ->addAttributeToSelect('*')
                ->addAttributeToSort('entity_id', 'desc')
                ->addAttributeToFilter('status', \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED)
                ->addAttributeToFilter('visibility', \Magento\Catalog\Model\Product\Visibility::VISIBILITY_BOTH)
                ->joinTable('cataloginventory_stock_item', 'product_id=entity_id', ['stock_status' => 'is_in_stock'])
                ->addAttributeToSelect('stock_status')
                ->addFieldToFilter('stock_status', ['eq' => 1]);

            $offset = isset($args['current_page']) ? $args['current_page'] : 0;
            $curr_page = 1;
            $limit = isset($args['limit']) ? $args['limit'] : 5;
            if ($offset != 'null' && $offset != '') {
                $curr_page = $offset;
            }
            $offset = ($curr_page - 1) * $limit;
            $collection->getSelect()->limit($limit, $offset);

            $products = [];
            $i = 0;
            foreach ($collection as $product) {
                $store = $this->_storeManager->getStore();
                $image = $this->customHelper->getImageUrl($product, 'product_thumbnail_image');
                if (!$image) {
                    $image = $this->_scopeConfig->getValue('catalog/placeholder/image_placeholder');
                }
                if (!$image) {
                    continue;
                }
                foreach ($product->getCategoryIds() as $category_id) {
                    $products['data'][$i]['categoryId'] = $category_id;
                }
                $productsconfigchild = [];
                $configurable_product = $product->getTypeId();
                $regularPrice = '';
                $specialPrice = '';
                if ($configurable_product == "configurable") {
                    $basePrice = $product->getPriceInfo()->getPrice('regular_price');
                    $regularPrice = $basePrice->getMinRegularAmount()->getValue();
                    $specialPrice = $product->getFinalPrice();
                    $_childrens = $product->getTypeInstance()->getUsedProducts($product);
                    if ($_childrens) {
                        foreach ($_childrens as $childs) {
                            $childStockStatus = '';
                            $childProductStock = $this->stockRegistryInterface->getStockItem($childs->getId());
                            $childSku = $childs->getSku();
                            $salebleQty = $this->customHelper->getProductSalableQty($childSku);
                            if ($childProductStock->getIsInStock() == 1 && $salebleQty[0]['qty'] > 0) {
                                $childStockStatus = 'IN_STOCK';
                            } else {
                                $childStockStatus = 'OUT_OF_STOCK';
                            }
                            $parentSku = $product->getSku();
                            $AttributeByChild = $this->customHelper->getChildSuperAttribute($parentSku, $childSku);
                            $product_child_id = $childs->getId();
                            $product_child_img = $this->productrepository->getById($product_child_id);
                            $productChildImageUrl = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $product_child_img->getImage();
                            $productsconfigchild[] =
                                [
                                "childId" => $childs->getId(),
                                "childName" => $childs->getName(),
                                "childSku" => $childs->getSku(),
                                "childImage" => $productChildImageUrl,
                                "childPrice" => $childs->getPrice(),
                                "childstockstatus" => $childStockStatus,
                                "configurable_options" => $AttributeByChild,
                            ];
                        }
                    }

                }

                if ($this->customHelper->getProductStockStatus($product)) {
                    $products['data'][$i]['stock_status_data'] = $this->customHelper->getProductStockStatus($product);
                }

                $price = $this->pricingHelper->currency($product->getData('price'), true, false);
                $description = $product->getShortDescription() ?? '<p>&nbsp;</p>';
                $products['data'][$i]['model'] = $product;
                $products['data'][$i]['name'] = $product->getName();
                $products['data'][$i]['price'] = $price;
                $products['data'][$i]['final_price'] = $this->pricingHelper->currency($product->getFinalPrice(), true, false);
                $products['data'][$i]['sku'] = $product->getSku();
                $products['data'][$i]['image'] = $image;
                $products['data'][$i]['description'] = $description;
                $products['data'][$i]['urlkey'] = $product->getUrlKey();
                $products['data'][$i]['id'] = $product->getId();
                $products['data'][$i]['regularPrice'] = $regularPrice;
                $products['data'][$i]['specialPrice'] = $specialPrice;
                $products['data'][$i]['type'] = $product->getTypeId();

                if ($product->getTypeId() == "simple" && $product->getHasOptions()) {
                    $products['data'][$i]['type'] = "simple_custom";
                }

                if ($product->getTypeId() == "configurable") {
                    $products['data'][$i]['child'] = $productsconfigchild;
                }

                $i++;
            }

            $products['currentPage'] = (Int) $curr_page;
            $products['limit'] = (Int) $limit;
            return $products;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }
}
