<?php
declare (strict_types = 1);
namespace Craftroots\Base\Model\Resolver;

use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\InventoryCatalog\Model\GetStockIdForCurrentWebsite;
use Magento\InventoryConfigurationApi\Api\GetStockItemConfigurationInterface;
use Magento\InventoryConfigurationApi\Exception\SkuIsNotAssignedToStockException;
use Magento\InventorySalesApi\Api\GetProductSalableQtyInterface;
use Magento\InventorySalesApi\Api\AreProductsSalableInterface;
use Magento\InventorySalesApi\Model\GetStockItemDataInterface;
use Magento\InventoryReservationsApi\Model\GetReservationsQuantityInterface;

class ProductStockResolver implements ResolverInterface
{
    /**
     * @var GetProductSalableQtyInterface
     */
    private $getProductSalableQty;

    /**
     * @var GetStockIdForCurrentWebsite
     */
    private $getStockIdForCurrentWebsite;

    /**
     * @var GetStockItemConfigurationInterface
     */
    private $getStockItemConfiguration;

     /**
     * @var GetStockItemDataInterface
     */
    private $getStockItemData;

    /**
     * @var GetReservationsQuantityInterface
     */
    private $getReservationsQuantity;

    /**
     * @var AreProductsSalableInterface|null
     */
    private $areProductsSalable;

    /**
     * @param GetProductSalableQtyInterface $getProductSalableQty
     * @param GetStockIdForCurrentWebsite $getStockIdForCurrentWebsite
     * @param GetStockItemDataInterface $getStockItemData
     * @param GetReservationsQuantityInterface $getReservationsQuantity
     * @param GetStockItemConfigurationInterface $getStockItemConfiguration
     * @param AreProductsSalableInterface $areProductsSalable
     */
    public function __construct(
        GetProductSalableQtyInterface $getProductSalableQty,
        GetStockIdForCurrentWebsite $getStockIdForCurrentWebsite,
        GetStockItemConfigurationInterface $getStockItemConfiguration,
        AreProductsSalableInterface $areProductsSalable,
        GetStockItemDataInterface $getStockItemData,
        GetReservationsQuantityInterface $getReservationsQuantity
    ) {
        $this->getProductSalableQty = $getProductSalableQty;
        $this->getStockIdForCurrentWebsite = $getStockIdForCurrentWebsite;
        $this->getStockItemConfiguration = $getStockItemConfiguration;
        $this->areProductsSalable = $areProductsSalable;
        $this->getStockItemData = $getStockItemData;
        $this->getReservationsQuantity = $getReservationsQuantity;
    }

    /**
     * @inheritDoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        /* @var $product ProductInterface */
        $product = $value['model'];
        $onlyXLeftQty = 0;
        $sku = $product->getSku();

        $stockId = $this->getStockIdForCurrentWebsite->execute();
        $result = $this->areProductsSalable->execute([$sku], $stockId);
        $result = current($result);

        $stockItemConfiguration = $this->getStockItemConfiguration->execute($sku, $stockId);
        $notifyStockQty = $stockItemConfiguration->getNotifyStockQty();

        if($product->getTypeId() == 'simple' && $product->getStatus() == 1){
           $stockItemData = $this->getStockItemData->execute($sku, $stockId);
            if (null === $stockItemData || (bool)$stockItemData[GetStockItemDataInterface::IS_SALABLE] === false)
            {
                $onlyXLeftQty = 0;
            } else {
                $minQty = $stockItemConfiguration->getMinQty();
                $onlyXLeftQty = $stockItemData[GetStockItemDataInterface::QUANTITY]
                + $this->getReservationsQuantity->execute($sku, $stockId) 
                - $minQty;

            }
           // $onlyXLeftQty = $this->getOnlyXLeftQty($sku);
            // $onlyXLeftQty = 0;
        } else{
            $onlyXLeftQty = 0;
        }

        $stock_status = $result->isSalable() ? 'IN_STOCK' : 'OUT_OF_STOCK';

        if($stock_status == 'IN_STOCK') {
            if($onlyXLeftQty < $notifyStockQty) {
                $stock_status = 'LOW_STOCK';
            }
        }
        if($onlyXLeftQty <= 0) {
            $stock_status = 'OUT_OF_STOCK';
        }
        return [
            'qty' => $onlyXLeftQty,
            'low_stock_qty' => $notifyStockQty,
            'stock_status' => $stock_status
        ];
    }

    /**
     * Get quantity of a specified product when equals or lower then configured threshold.
     *
     * @param string $sku
     * @return null|float
     * @throws SkuIsNotAssignedToStockException
     * @throws LocalizedException
     */
    private function getOnlyXLeftQty(string $sku): ?float
    {
        $stockId = $this->getStockIdForCurrentWebsite->execute();
        $productSalableQty = $this->getProductSalableQty->execute($sku, $stockId);
        return $productSalableQty;
    }

}
