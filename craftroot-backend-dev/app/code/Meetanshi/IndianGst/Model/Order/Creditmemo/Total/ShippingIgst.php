<?php
namespace Meetanshi\IndianGst\Model\Order\Creditmemo\Total;

use Magento\Sales\Model\Order\Creditmemo\Total\AbstractTotal as CreditmemoAbstractTotal;
use Magento\Sales\Model\Order\Creditmemo;
use Meetanshi\IndianGst\Helper\Data as HelperData;

class ShippingIgst extends CreditmemoAbstractTotal
{
    protected $helper;

    public function __construct(HelperData $helper, array $data = [])
    {
        parent::__construct($data);
        $this->helper = $helper;
    }

    public function collect(Creditmemo $creditmemo)
    {
        $amount = $creditmemo->getOrder()->getShippingIgstAmount();
        $creditmemo->setShippingIgstAmount($amount);

        if ($this->helper->getShippingGstClass()) {
            $creditmemo->setGrandTotal($creditmemo->getGrandTotal() + $creditmemo->getShippingIgstAmount());
            $creditmemo->setBaseGrandTotal($creditmemo->getBaseGrandTotal() + $creditmemo->getShippingIgstAmount());
        } else {
            $creditmemo->setGrandTotal($creditmemo->getGrandTotal());
            $creditmemo->setBaseGrandTotal($creditmemo->getBaseGrandTotal());
        }
        return $this;
    }
}
