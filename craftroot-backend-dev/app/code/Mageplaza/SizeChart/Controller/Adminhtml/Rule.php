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

namespace Mageplaza\SizeChart\Controller\Adminhtml;

use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\Registry;
use Mageplaza\SizeChart\Model\RuleFactory;

/**
 * Class Rule
 * @package Mageplaza\SizeChart\Controller\Adminhtml
 */
abstract class Rule extends Action
{
    /** Authorization level of a basic admin session */
    const ADMIN_RESOURCE = 'Mageplaza_SizeChart::rule';

    /**
     * Rule model factory
     *
     * @var RuleFactory
     */
    public $ruleFactory;

    /**
     * Core registry
     *
     * @var Registry
     */
    public $coreRegistry;

    /**
     * Rule constructor.
     *
     * @param RuleFactory $ruleFactory
     * @param Registry $coreRegistry
     * @param Context $context
     */
    public function __construct(
        RuleFactory $ruleFactory,
        Registry $coreRegistry,
        Context $context
    ) {
        $this->ruleFactory = $ruleFactory;
        $this->coreRegistry = $coreRegistry;

        parent::__construct($context);
    }

    /**
     * @param bool $register
     *
     * @return bool|\Mageplaza\SizeChart\Model\Rule
     */
    protected function initRule($register = false)
    {
        $ruleId = (int)$this->getRequest()->getParam('id');

        /** @var \Mageplaza\SizeChart\Model\Rule $rule */
        $rule = $this->ruleFactory->create();

        if ($ruleId) {
            $rule->load($ruleId);
            if (!$rule->getId()) {
                $this->messageManager->addErrorMessage(__('This rule no longer exists.'));

                return false;
            }
        }
        if ($register) {
            $this->coreRegistry->register('mageplaza_sizechart_rule', $rule);
        }

        return $rule;
    }
}
