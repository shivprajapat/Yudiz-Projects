<?php

namespace Meetanshi\IndianGst\Model\Order\Creditmemo\Total;

use Magento\Sales\Model\Order\Creditmemo\Total\AbstractTotal as CreditmemoAbstractTotal;
use Meetanshi\IndianGst\Helper\Data as HelperData;

class AbstractTotal extends CreditmemoAbstractTotal
{
    protected $helper;

    public function __construct(HelperData $helper, array $data = [])
    {
        $this->helper = $helper;
        parent::__construct($data);
    }

    public function collect(\Magento\Sales\Model\Order\Creditmemo $creditmemo)
    {
        $cgstAmount = $creditmemo->getOrder()->getCgstAmount();
        $basecgstAmount = $creditmemo->getOrder()->getBaseCgstAmount();
        $utgstAmount = $creditmemo->getOrder()->getUtgstAmount();
        $baseutgstAmount = $creditmemo->getOrder()->getBaseUtgstAmount();
        $sgstAmount = $creditmemo->getOrder()->getSgstAmount();
        $basesgstAmount = $creditmemo->getOrder()->getBaseSgstAmount();
        $igstAmount = $creditmemo->getOrder()->getIgstAmount();
        $baseigstAmount = $creditmemo->getOrder()->getBaseIgstAmount();

        $creditmemo->setCgstAmount($cgstAmount);
        $creditmemo->setUtgstAmount($utgstAmount);
        $creditmemo->setSgstAmount($sgstAmount);
        $creditmemo->setIgstAmount($igstAmount);

        $creditmemo->setBaseCgstAmount($basecgstAmount);
        $creditmemo->setBaseUtgstAmount($baseutgstAmount);
        $creditmemo->setBaseSgstAmount($basesgstAmount);
        $creditmemo->setBaseIgstAmount($baseigstAmount);

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

        $subtotal = 0;
        $baseSubtotal = 0;
        $subtotalInclTax = 0;
        $baseSubtotalInclTax = 0;

        foreach ($creditmemo->getAllItems() as $item) {
            if ($item->getOrderItem()->isDummy()) {
                continue;
            }

            $item->calcRowTotal();

            $subtotal += $item->getRowTotal();
            $baseSubtotal += $item->getBaseRowTotal();
            $subtotalInclTax += $item->getRowTotalInclTax();
            $baseSubtotalInclTax += $item->getBaseRowTotalInclTax();
        }

        $creditmemo->setSubtotal($subtotal - $amount);
        $creditmemo->setBaseSubtotal($baseSubtotal - $amount);
        $creditmemo->setSubtotalInclTax($subtotalInclTax);
        $creditmemo->setBaseSubtotalInclTax($baseSubtotalInclTax);

        if ($this->helper->isCatalogExclusiveGst()) {
            $creditmemo->setGrandTotal($creditmemo->getGrandTotal() + $subtotal + $amount);
            $creditmemo->setBaseGrandTotal($creditmemo->getBaseGrandTotal() + $baseSubtotal + $amount);
        } else {
            $creditmemo->setGrandTotal($creditmemo->getGrandTotal() + $subtotal);
            $creditmemo->setBaseGrandTotal($creditmemo->getBaseGrandTotal() + $baseSubtotal);
        }
        return $this;
    }
}
