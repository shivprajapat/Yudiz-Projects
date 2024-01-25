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

namespace Mageplaza\SizeChart\Controller\Adminhtml\Rule;

use Exception;
use Magento\Backend\App\Action\Context;
use Magento\Backend\Helper\Js;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\Result\Redirect;
use Magento\Framework\Controller\ResultInterface;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Registry;
use Magento\Framework\Stdlib\DateTime\DateTime;
use Mageplaza\SizeChart\Controller\Adminhtml\Rule;
use Mageplaza\SizeChart\Model\RuleFactory;
use RuntimeException;

/**
 * Class Save
 * @package Mageplaza\SizeChart\Controller\Adminhtml\Rule
 */
class Save extends Rule
{
    /**
     * JS helper
     *
     * @var Js
     */
    public $jsHelper;

    /**
     * @var DateTime
     */
    public $date;

    /**
     * Save constructor.
     *
     * @param Context $context
     * @param Registry $registry
     * @param RuleFactory $ruleFactory
     * @param Js $jsHelper
     * @param DateTime $date
     */
    public function __construct(
        Context $context,
        Registry $registry,
        RuleFactory $ruleFactory,
        Js $jsHelper,
        DateTime $date
    ) {
        $this->jsHelper = $jsHelper;
        $this->date = $date;

        parent::__construct($ruleFactory, $registry, $context);
    }

    /**
     * Save data action
     *
     * @return ResponseInterface|Redirect|ResultInterface
     */
    public function execute()
    {
        $resultRedirect = $this->resultRedirectFactory->create();

        if ($data = $this->getRequest()->getPost('rule')) {
            /** @var \Mageplaza\SizeChart\Model\Rule $rule */
            $rule = $this->initRule();
            $this->_prepareData($rule, $data);

            /** get rule conditions */
            $rule->loadPost($data);
            $this->_eventManager->dispatch(
                'mageplaza_sizechart_rule_prepare_save',
                ['post' => $rule, 'request' => $this->getRequest()]
            );

            try {
                $rule->save();

                $this->messageManager->addSuccessMessage(__('The rule has been saved.'));
                $this->_getSession()->setData('mageplaza_sizechart_rule_data', false);

                if ($this->getRequest()->getParam('back')) {
                    $resultRedirect->setPath('mpsizechart/*/edit', ['id' => $rule->getId(), '_current' => true]);
                } else {
                    $resultRedirect->setPath('mpsizechart/*/');
                }

                return $resultRedirect;
            } catch (LocalizedException $e) {
                $this->messageManager->addErrorMessage($e->getMessage());
            } catch (RuntimeException $e) {
                $this->messageManager->addErrorMessage($e->getMessage());
            } catch (Exception $e) {
                $this->messageManager->addExceptionMessage($e, __('Something went wrong while saving the Rule.'));
            }

            $this->_getSession()->setData('mageplaza_sizechart_rule_data', $data);

            $resultRedirect->setPath('mpsizechart/*/edit', ['id' => $rule->getId(), '_current' => true]);

            return $resultRedirect;
        }

        $resultRedirect->setPath('mpsizechart/*/');

        return $resultRedirect;
    }

    /**
     * Set specific data
     *
     * @param $rule
     * @param array $data
     *
     * @return $this
     */
    protected function _prepareData($rule, $data = [])
    {
        if ($rule->getCreatedAt() == null) {
            $data['created_at'] = $this->date->date();
        }
        $data['updated_at'] = $this->date->date();
        $rule->addData($data);

        return $this;
    }
}
