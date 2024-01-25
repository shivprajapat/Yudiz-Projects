<?php

declare (strict_types = 1);

namespace Craftroots\AllCoupon\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * @inheritdoc
 */
class AllCoupon implements ResolverInterface
{

    protected $_salesRuleCoupon;
    protected $timezone;

    public function __construct(
        \Magento\SalesRule\Model\RuleFactory $salesRuleCoupon,
        \Magento\Framework\Stdlib\DateTime\TimezoneInterface $timezone

    ) {
        $this->_salesRuleCoupon = $salesRuleCoupon;
        $this->timezone = $timezone;

    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {

        $objrules = $this->_salesRuleCoupon->create();
        $rules = $objrules->getCollection();
        $rules->addFieldToFilter('is_active', 1);
        $rules->addFieldToFilter('coupon_type', 2);
        $rules->addFieldToFilter('use_auto_generation', 0);
        $finalArray = [];
        $i = 0;
        foreach ($rules as $rule) {
            $couponArray = [];
            if ($rule->getUseAutoGeneration() == 0) {
                if ($rule->getIsActive() == 1) {
                    $todayDate = $this->timezone->date()->format('Y-m-d');
                    $ruleFromDate = $rule->getFromDate();
                    $ruleToDate = $rule->getToDate();
                    if ($ruleFromDate <= $todayDate) {
                        if ($ruleToDate > $todayDate || $ruleToDate == "") {
                            $couponArray = [
                                'couponTitle' => $rule->getName(),
                                'couponCode' => $rule['code'],
                                'couponDescription' => $rule->getDescription(),
                                'couponFromDate' => $rule->getFromDate(),
                                'coupontoDate' => $rule->getToDate(),
                            ];
                        }
                    }
                }

                $finalArray['data'][$i] = $couponArray;
            }
            $i++;
        }

        return $finalArray;
    }

}
