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
 * @package     Mageplaza_SizeChart
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

namespace Mageplaza\SizeChart\Api\Data;

use Magento\Framework\Api\SearchResultsInterface;

/**
 * Interface RuleSearchResultInterface
 * @package Mageplaza\SizeChart\Api\Data
 */
interface RuleSearchResultInterface extends SearchResultsInterface
{
    /**
     * @return \Mageplaza\SizeChart\Api\Data\RuleInterface[]
     */
    public function getItems();

    /**
     * @param \Mageplaza\SizeChart\Api\Data\RuleInterface[] $items
     *
     * @return $this
     */
    public function setItems(array $items = null);
}
