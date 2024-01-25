<?php

namespace Meetanshi\IndianGst\Observer;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Catalog\Model\ProductFactory;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Magento\Quote\Model\QuoteFactory;
use Magento\Store\Model\StoreManagerInterface;
use Meetanshi\IndianGst\Helper\Data;

class SaveGstToInvoice implements ObserverInterface
{
    protected $helper;
    protected $productFactory;
    protected $categoryRepository;
    protected $storeManager;
    protected $quoteFactory;

    public function __construct(
        Data $helper,
        ProductFactory $productFactory,
        CategoryRepositoryInterface $categoryRepository,
        StoreManagerInterface $storeManager,
        QuoteFactory $quoteFactory
    ) {
        $this->helper = $helper;
        $this->productFactory = $productFactory;
        $this->categoryRepository = $categoryRepository;
        $this->storeManager = $storeManager;
        $this->quoteFactory = $quoteFactory;
    }

    public function execute(Observer $observer)
    {
        try {
            if (!$this->helper->isEnabled()) {
                return false;
            }

            $invoice = $observer->getEvent()->getInvoice();
            $order = $observer->getEvent()->getInvoice()->getOrder();

            $invoiceItems = $invoice->getAllItems();
            $orderItems = $order->getAllItems();

            /* Copy GST Data Order to Invoice */
            $invoice->setCgstAmount($order->getCgstAmount());
            $invoice->setBaseCgstAmount($order->getBaseCgstAmount());

            $invoice->setUtgstAmount($order->getUtgstAmount());
            $invoice->setBaseUtgstAmount($order->getBaseUtgstAmount());

            $invoice->setUtgstAmount($order->getUtgstAmount());
            $invoice->setBaseUtgstAmount($order->getBaseUtgstAmount());

            $invoice->setSgstAmount($order->getSgstAmount());
            $invoice->setBaseSgstAmount($order->getBaseSgstAmount());

            $invoice->setIgstAmount($order->getIgstAmount());
            $invoice->setBaseIgstAmount($order->getBaseIgstAmount());

            /* Copy Shipping GST Data Order to Invoice */
            $invoice->setShippingCgstAmount($order->getShippingCgstAmount());
            $invoice->setBaseShippingCgstAmount($order->getBaseShippingCgstAmount());

            $invoice->setShippingUtgstAmount($order->getShippingUtgstAmount());
            $invoice->setBaseShippingUtgstAmount($order->getBaseShippingUtgstAmount());

            $invoice->setShippingUtgstAmount($order->getShippingUtgstAmount());
            $invoice->setBaseShippingUtgstAmount($order->getBaseShippingUtgstAmount());

            $invoice->setShippingSgstAmount($order->getShippingSgstAmount());
            $invoice->setBaseShippingSgstAmount($order->getBaseShippingSgstAmount());

            $invoice->setShippingIgstAmount($order->getShippingIgstAmount());
            $invoice->setBaseShippingIgstAmount($order->getBaseShippingIgstAmount());

            $invoice->setBuyerGstNumber($order->getBuyerGstNumber());

            $k = 0;
            foreach ($invoiceItems as $item) {
                $orderItem = $orderItems[$k];
                if ($item->getData('order_item_id')) {
                    $item->setIgstAmount($orderItem->getIgstAmount());
                    $item->setBaseIgstAmount($orderItem->getIgstAmount());
                    $item->setIgstPercent($orderItem->getIgstPercent());
                    $item->setCgstAmount($orderItem->getCgstAmount());
                    $item->setBaseCgstAmount($orderItem->getCgstAmount());

                    $item->setUtgstAmount($orderItem->getUtgstAmount());
                    $item->setBaseUtgstAmount($orderItem->getUtgstAmount());

                    $item->setSgstAmount($orderItem->getSgstAmount());
                    $item->setBaseSgstAmount($orderItem->getSgstAmount());
                    $item->setCgstPercent($orderItem->getCgstPercent());
                    $item->setUtgstPercent($orderItem->getUtgstPercent());
                    $item->setSgstPercent($orderItem->getSgstPercent());
                    $item->save();
                }
                $k++;
                $item->setGstExclusive($orderItem->getGstExclusive());
            }
        } catch (\Exception $e) {
            $e->getMessage();
        }
    }
}
