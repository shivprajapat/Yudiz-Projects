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
use Magento\Backend\App\Action;
use Magento\Backend\App\Action\Context;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\ResultInterface;
use Mageplaza\SizeChart\Helper\Data;

/**
 * Class LoadTemplate
 * @package Mageplaza\SizeChart\Controller\Adminhtml\Rule
 */
class LoadTemplate extends Action
{
    /**
     * @var Data
     */
    protected $_helperData;

    /**
     * LoadTemplate constructor.
     *
     * @param Context $context
     * @param Data $helperData
     */
    public function __construct(
        Context $context,
        Data $helperData
    ) {
        $this->_helperData = $helperData;

        parent::__construct($context);
    }

    /**
     * @return ResponseInterface|ResultInterface
     */
    public function execute()
    {
        $data = $this->getRequest()->getParams();
        $templateId = $data['templateId'];
        $templateHtml = $templateCss = '';
        try {
            $templateHtml = $this->_helperData->getDefaultTemplateHtml($templateId);
            $templateCss = $this->_helperData->getDefaultTemplateCss($templateId);
            $status = true;
            $message = __('Load message success!');
        } catch (Exception $e) {
            $status = false;
            $message = __("Cannot load template.");
        }
        $result = [
            'status' => $status,
            'message' => $message,
            'templateHtml' => $templateHtml,
            'templateCss' => $templateCss
        ];

        return $this->getResponse()->representJson(Data::jsonEncode($result));
    }
}
