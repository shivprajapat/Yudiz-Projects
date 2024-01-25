<?php

namespace Meetanshi\IndianGst\Model\Order\Invoice\Total;

use Magento\Sales\Model\Order\Invoice;
use Magento\Sales\Model\Order\Invoice\Total\AbstractTotal as InvoiceAbstractTotal;
use Meetanshi\IndianGst\Helper\Data as HelperData;
use Magento\Catalog\Model\ProductFactory;
use Magento\Sales\Model\OrderFactory;
use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;

class AbstractTotal extends InvoiceAbstractTotal
{
    protected $productFactory;
    protected $orderFactory;
    protected $helper;
    protected $categoryRepository;
    protected $storeManager;

    public function __construct(
        HelperData $helper,
        ProductFactory $productFactory,
        OrderFactory $orderFactory,
        CategoryRepositoryInterface $categoryRepository,
        StoreManagerInterface $storeManager,
        array $data = []
    ) {
        $this->helper = $helper;
        $this->productFactory = $productFactory;
        $this->orderFactory = $orderFactory;
        $this->categoryRepository = $categoryRepository;
        $this->storeManager = $storeManager;
        parent::__construct($data);
    }

    public function collect(Invoice $invoice)
    {
        $subtotal = 0;
        $baseSubtotal = 0;
        $subtotalInclTax = 0;
        $baseSubtotalInclTax = 0;

        $order = $invoice->getOrder();

        foreach ($invoice->getAllItems() as $item) {
            if ($item->getOrderItem()->isDummy()) {
                continue;
            }

            $item->calcRowTotal();
            $subtotal += $item->getRowTotal();
            $baseSubtotal += $item->getBaseRowTotal();
            $subtotalInclTax += $item->getRowTotalInclTax();
            $baseSubtotalInclTax += $item->getBaseRowTotalInclTax();
        }

        $allowedSubtotal = $order->getSubtotal() - $order->getSubtotalInvoiced();
        $baseAllowedSubtotal = $order->getBaseSubtotal() - $order->getBaseSubtotalInvoiced();
        //Note: The $subtotalInclTax and $baseSubtotalInclTax are not adjusted from those provide by the line items
        //because the "InclTax" is displayed before any tax adjustments based on discounts, shipping, etc.

        if ($invoice->isLast()) {
            $subtotal = $allowedSubtotal;
            $baseSubtotal = $baseAllowedSubtotal;
        } else {
            $subtotal = min($allowedSubtotal, $subtotal);
            $baseSubtotal = min($baseAllowedSubtotal, $baseSubtotal);
        }


        $cgstAmount = $invoice->getOrder()->getCgstAmount();
        $basecgstAmount = $invoice->getOrder()->getBaseCgstAmount();
        $utgstAmount = $invoice->getOrder()->getUtgstAmount();
        $baseutgstAmount = $invoice->getOrder()->getBaseUtgstAmount();
        $sgstAmount = $invoice->getOrder()->getSgstAmount();
        $basesgstAmount = $invoice->getOrder()->getBaseSgstAmount();
        $igstAmount = $invoice->getOrder()->getIgstAmount();
        $baseigstAmount = $invoice->getOrder()->getBaseIgstAmount();


        $invoice->setCgstAmount($cgstAmount);
        $invoice->setUtgstAmount($utgstAmount);
        $invoice->setSgstAmount($sgstAmount);
        $invoice->setIgstAmount($igstAmount);

        $invoice->setBaseCgstAmount($basecgstAmount);
        $invoice->setBaseUtgstAmount($baseutgstAmount);
        $invoice->setBaseSgstAmount($basesgstAmount);
        $invoice->setBaseIgstAmount($baseigstAmount);

        $amount = 0;

        if ($cgstAmount > 0 && $sgstAmount > 0) {
            $amount = $cgstAmount + $sgstAmount;
        }
        if ($cgstAmount > 0 && $utgstAmount > 0) {
            $amount = $cgstAmount + $utgstAmount;
        }

        if ($igstAmount > 0) {
            $amount = $igstAmount;
        }

        $invoice->setSubtotal($subtotal);
        $invoice->setBaseSubtotal($baseSubtotal);
        $invoice->setSubtotalInclTax($subtotalInclTax);
        $invoice->setBaseSubtotalInclTax($baseSubtotalInclTax);

        $invoice->setGrandTotal($invoice->getGrandTotal() + $subtotal + $amount);
        $invoice->setBaseGrandTotal($invoice->getBaseGrandTotal() + $baseSubtotal + $amount);
        return $this;
    }
}
