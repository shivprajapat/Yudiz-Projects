<?php
/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_SizeChartGraphQl
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

declare(strict_types=1);

namespace Mageplaza\SizeChartGraphQl\Model\Resolver;

use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Mageplaza\SizeChart\Helper\Data;
use Magento\Cms\Model\Template\FilterProvider;

/**
 * Class SizeChartDataProvider
 * @package Mageplaza\SizeChartGraphQl\Model\Resolver
 */
class SizeChartDataProvider implements ResolverInterface
{
    /**
     * @var Data
     */
    protected $helperData;

    /**
     * @var FilterProvider
     */
    protected $filterProvider;

    /**
     * SizeChartDataProvider constructor.
     *
     * @param Data $helperData
     * @param FilterProvider $filterProvider
     */
    public function __construct(
        Data $helperData,
        FilterProvider $filterProvider
    ) {
        $this->helperData     = $helperData;
        $this->filterProvider = $filterProvider;
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {

        if (!$this->helperData->isEnabled()) {
            return null;
        }

        if (!array_key_exists('model', $value) || !$value['model'] instanceof ProductInterface) {
            throw new LocalizedException(__('"model" value should be specified'));
        }

        /* @var $product ProductInterface */
        $product = $value['model'];
        $rules   = $this->helperData->getRuleCollection();

        foreach ($rules as $rule) {
            if ($rule->getConditions()->validate($product)) {
                $rule->setRuleContent($this->filterProvider->getPageFilter()->filter($rule->getRuleContent()));

                return $rule;
            }
        }

        return null;
    }
}
