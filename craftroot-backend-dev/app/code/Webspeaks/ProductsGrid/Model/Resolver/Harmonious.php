<?php
declare (strict_types = 1);
namespace Webspeaks\ProductsGrid\Model\Resolver;

use Magento\Catalog\Helper\Image;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\ScopeInterface;

class Harmonious implements ResolverInterface
{
    protected $_instaCollectionFactory;
    protected $_resource;
    protected $_productloader;
    protected $imageHelper;
    protected $scopeConfig;

    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storemanager,
        \Webspeaks\ProductsGrid\Model\ResourceModel\Contact\CollectionFactory $instaCollectionFactory,
        \Magento\Framework\App\ResourceConnection $resource,
        \Magento\Catalog\Model\ProductFactory $_productloader,
        ScopeConfigInterface $scopeConfig,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        Image $imageHelper,
        \Magento\Framework\Pricing\Helper\Data $pricingHelper

    ) {
        $this->_instaCollectionFactory = $instaCollectionFactory;
        $this->_resource = $resource;
        $this->pricingHelper = $pricingHelper;
        $this->_productloader = $_productloader;
        $this->imageHelper = $imageHelper;
        $this->_storeManager = $storemanager;
        $this->scopeConfig = $scopeConfig;
    }

    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        try {
            $enable = $this->scopeConfig->getValue("harmonious/general/enable_harmonious", ScopeInterface::SCOPE_STORE);
            if ($enable == 1) {
                $store = $this->_storeManager->getStore();
                $connection = $this->_resource->getConnection();
                $table1 = $this->_resource->getTableName('webspeaks_contact'); // Replace 'table1' with the actual name of your first table
                $table2 = $this->_resource->getTableName('webspeaks_product_attachment_rel');
                $select = $connection->select()
                    ->from(['t1' => $table1]) // Alias 't1' for table1
                    ->joinInner(
                        ['t2' => $table2], // Alias 't2' for table2
                        't1.contact_id = t2.contact_id'
                    );
                $result = $connection->fetchAll($select);
                $products = [];
                $i = 0;
                $instaImages = $this->_instaCollectionFactory->create();
                $instaImages->setPageSize(1);
                $mainBannerImages = '';
                foreach ($instaImages as $mainImages) {
                    $mainBannerImages = $mainImages->getData('main_banner');
                }
                foreach ($result as $row) {
                    $products['data'][$i]['title'] = $row['title'];
                    $productId = $row['product_id'];
                    $productAssignData = $this->getLoadProduct($productId);
                    $products['data'][$i]['id'] = $productAssignData->getId();
                    $products['data'][$i]['name'] = $productAssignData->getName();
                    $price = $this->pricingHelper->currency($productAssignData->getFinalPrice(), true, false);
                    $products['data'][$i]['price'] = $price;
                    $products['data'][$i]['sku'] = $productAssignData->getSku();
                    $products['data'][$i]['productUrl'] = $productAssignData->getUrlKey();
                    $thumbnailimages = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $productAssignData->getThumbnail();
                    $products['data'][$i]['productImage'] = $thumbnailimages;
                    $i++;
                }
                $products['mainBannner'] = !empty($mainBannerImages) ? $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . $mainBannerImages : null;
                return $products;
            }

        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }
    public function getLoadProduct($id)
    {
        return $this->_productloader->create()->load($id);
    }

}
