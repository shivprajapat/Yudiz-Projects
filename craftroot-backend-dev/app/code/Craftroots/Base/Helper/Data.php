<?php

namespace Craftroots\Base\Helper;

use Magento\CatalogInventory\Model\Stock\StockItemRepository;

use Magento\Catalog\Api\ProductAttributeRepositoryInterface;
use Magento\Catalog\Helper\ImageFactory as ProductImageHelper;
use Magento\InventorySalesAdminUi\Model\GetSalableQuantityDataBySku;
use Magento\Store\Model\App\Emulation as AppEmulation;
use \Magento\Framework\App\Helper\AbstractHelper;

class Data extends AbstractHelper
{

    protected $_productloader;
    protected $stockItemRepository;
    private $getSalableQuantityDataBySku;
    protected $_storeManager;
    protected $_scopeConfigManager;
    protected $stockRegistryInterface;

    public function __construct(
        \Magento\Catalog\Model\ProductFactory $_productloader,
        \Magento\Catalog\Api\ProductRepositoryInterface $productrepository,
        \Magento\Store\Model\StoreManagerInterface $storeManagerInterface,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfigInterface,
        \Magento\CatalogInventory\Api\StockRegistryInterface $stockRegistryInterface,
        \Magento\Swatches\Helper\Data $swatchHelper,
        ProductImageHelper $productImageHelper,
        AppEmulation $appEmulation,
        StockItemRepository $stockItemRepository,
        GetSalableQuantityDataBySku $getSalableQuantityDataBySku,
        ProductAttributeRepositoryInterface $attributeRepository,
        \Magento\Framework\App\Helper\Context $context
    ) {
        $this->productrepository = $productrepository;
        $this->stockRegistryInterface = $stockRegistryInterface;
        $this->_storeManager = $storeManagerInterface;
        $this->_scopeConfigManager = $scopeConfigInterface;
        $this->swatchHelper = $swatchHelper;
        $this->_productloader = $_productloader;
        $this->appEmulation = $appEmulation;
        $this->productImageHelper = $productImageHelper;
        $this->stockItemRepository = $stockItemRepository;
        $this->attributeRepository = $attributeRepository;
        $this->getSalableQuantityDataBySku = $getSalableQuantityDataBySku;
        parent::__construct($context);
    }

    public function getChildSuperAttribute(string $parentSku, string $childSku)
    {
        $parentProduct = $this->getProducts($parentSku);
        $childProduct = $this->getProducts($childSku);
        $_attributes = $parentProduct->getTypeInstance(true)->getConfigurableAttributes($parentProduct);
        $attributesPair = [];
        foreach ($_attributes as $_attribute) {
            $attributeId = (int) $_attribute->getAttributeId();
            $attributeCode = $this->getAttributeCode($attributeId);
            $option_val = $childProduct->getData($attributeCode);
            $hex_code = $this->getAtributeSwatchHashcode($option_val);
            $attributesPairsValue = [];
            $attributesPairsValue[] = [
                'label' => $_attribute['label'],
                'value' => $option_val,
                'code' => $hex_code,

            ];
            $attributesPair[] = [
                'Attribute_id' => $attributeId,
                'Attribute_code' => $attributeCode,
                'attribute_options' => $attributesPairsValue,

            ];
        }
        return $attributesPair;
    }
    public function getAtributeSwatchHashcode($optionid)
    {
        $hashcodeData = $this->swatchHelper->getSwatchesByOptionsId([$optionid]);
        return $hashcodeData[$optionid]['value'];
    }
    public function getAttributeCode(int $id)
    {
        return $this->attributeRepository->get($id)->getAttributeCode();
    }
    public function getStockItem($productId)
    {
        return $this->stockItemRepository->get($productId);
    }
    public function getProducts(string $sku)
    {
        $product = null;
        try {
            $product = $this->productrepository->get($sku);
        } catch (\Magento\Framework\Exception\NoSuchEntityException $exception) {
            $this->logger->error(__($exception->getMessage()));
        }

        return $product;
    }
    public function getProductSalableQty($sku)
    {
        $salable = $this->getSalableQuantityDataBySku->execute($sku);
        return $salable;
    }
    public function getStoreConfig($path, $storeId = null)
    {
        $store = $this->_storeManager->getStore($storeId);
        return $this->_scopeConfigManager->getValue($path, 'store', $store->getCode());
    }

    public function getImageUrl($product, string $imageType = null)
    {
        $storeId = $this->_storeManager->getStore()->getId();

        $this->appEmulation->startEnvironmentEmulation($storeId, \Magento\Framework\App\Area::AREA_FRONTEND, true);
        $imageUrl = $this->productImageHelper->create()->init($product, $imageType)->resize(300, 300)->getUrl();
        $this->appEmulation->stopEnvironmentEmulation();
        return $imageUrl;
    }

    public function getProductStockStatus($products)
    {
        $stock_status = [];
        if ($products && $products->getTypeId() == "simple") {
            $ProductStock = $this->stockRegistryInterface->getStockItem($products->getId());
            $salebleQty = $this->getProductSalableQty($products->getSku());
            if ($ProductStock->getIsInStock() == 1 && $salebleQty[0]['qty'] > 0) {
                $stock_status = [
                    'qty' => $salebleQty[0]['qty'],
                    'stock_status' => 'In Stock',
                ];
            } else {
                $stock_status = [
                    'qty' => $salebleQty[0]['qty'],
                    'stock_status' => 'Out Of Stock',
                ];
            }
        }
        return $stock_status;
    }

}
