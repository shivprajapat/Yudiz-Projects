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

namespace Mageplaza\SizeChart\Api;

use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\StateException;

/**
 * Interface RuleManagementInterface
 * @package Mageplaza\SizeChart\Api
 */
interface RuleManagementInterface
{
    /**
     * @param string $id
     *
     * @return bool
     */
    public function deleteRule($id);

    /**
     * @param \Mageplaza\SizeChart\Api\Data\RuleInterface $rules
     *
     * @return \Mageplaza\SizeChart\Api\Data\RuleInterface
     * @throws StateException
     * @throws InputException
     * @throws NoSuchEntityException
     */
    public function addRule($rules);

    /**
     * @param string $id
     *
     * @return \Mageplaza\SizeChart\Api\Data\RuleInterface
     */
    public function getRuleById($id);

    /**
     * @param SearchCriteriaInterface $searchCriteria
     *
     * @return \Mageplaza\SizeChart\Api\Data\RuleSearchResultInterface
     */
    public function getList(SearchCriteriaInterface $searchCriteria = null);
}
