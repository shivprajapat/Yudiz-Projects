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

namespace Mageplaza\SizeChart\Block\Product;

use Exception;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Catalog\Block\Product\Context;
use Magento\Catalog\Block\Product\View;
use Magento\Catalog\Helper\Product;
use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\ProductTypes\ConfigInterface;
use Magento\Cms\Model\Template\FilterProvider;
use Magento\Customer\Model\Session;
use Magento\Eav\Model\ResourceModel\Entity\Attribute;
use Magento\Framework\Json\EncoderInterface as JsonEncoderInterface;
use Magento\Framework\Locale\FormatInterface;
use Magento\Framework\Pricing\PriceCurrencyInterface;
use Magento\Framework\Stdlib\StringUtils;
use Magento\Framework\Url\EncoderInterface as UrlEncoderInterface;
use Mageplaza\SizeChart\Helper\Data;
use Mageplaza\SizeChart\Model\Config\Source\AttributeOptions;
use Mageplaza\SizeChart\Model\Rule;
use Mageplaza\SizeChart\Model\RuleFactory;

/**
 * Class SizeChart
 * @package Mageplaza\SizeChart\Block\Product
 */
class SizeChart extends View
{
    /**
     * Get catalog type
     */
    const CATALOG_TYPE = 'category';

    /**
     * @var FilterProvider
     */
    public $filterProvider;

    /**
     * @var RuleFactory
     */
    protected $_ruleFactory;

    /**
     * @var Data
     */
    protected $_helperData;

    /**
     * @var Attribute
     */
    protected $_eavAttribute;

    /**
     * @var \Magento\Catalog\Helper\Data
     */
    protected $_catalogHelper;

    /**
     * @var Category
     */
    protected $_categoryFactory;

    /**
     * @var bool|Rule
     */
    protected $sizeChartRule;

    /**
     * SizeChart constructor.
     *
     * @param Context $context
     * @param UrlEncoderInterface $urlEncoder
     * @param JsonEncoderInterface $jsonEncoder
     * @param StringUtils $string
     * @param Product $productHelper
     * @param ConfigInterface $productTypeConfig
     * @param FormatInterface $localeFormat
     * @param Session $customerSession
     * @param ProductRepositoryInterface $productRepository
     * @param PriceCurrencyInterface $priceCurrency
     * @param FilterProvider $filterProvider
     * @param RuleFactory $ruleFactory
     * @param Data $helperData
     * @param Attribute $attribute
     * @param Category $categoryFactory
     * @param array $data
     */
    public function __construct(
        Context $context,
        UrlEncoderInterface $urlEncoder,
        JsonEncoderInterface $jsonEncoder,
        StringUtils $string,
        Product $productHelper,
        ConfigInterface $productTypeConfig,
        FormatInterface $localeFormat,
        Session $customerSession,
        ProductRepositoryInterface $productRepository,
        PriceCurrencyInterface $priceCurrency,
        FilterProvider $filterProvider,
        RuleFactory $ruleFactory,
        Data $helperData,
        Attribute $attribute,
        Category $categoryFactory,
        array $data = []
    ) {
        $this->_ruleFactory = $ruleFactory;
        $this->filterProvider = $filterProvider;
        $this->_helperData = $helperData;
        $this->_eavAttribute = $attribute;
        $this->_catalogHelper = $context->getCatalogHelper();
        $this->_categoryFactory = $categoryFactory;

        parent::__construct(
            $context,
            $urlEncoder,
            $jsonEncoder,
            $string,
            $productHelper,
            $productTypeConfig,
            $localeFormat,
            $customerSession,
            $productRepository,
            $priceCurrency,
            $data
        );
    }

    /**
     * @inheritdoc
     */
    protected function _construct()
    {
        $this->setTabTitle();

        parent::_construct();
    }

    /**
     * @param $content
     *
     * @return string
     * @throws Exception
     */
    public function getPageFilter($content)
    {
        return $this->filterProvider->getPageFilter()->filter($content);
    }

    /**
     * get html for size chart content
     *
     * @param $rule
     *
     * @return string
     * @throws Exception
     */
    public function getSizeChartHtml($rule)
    {
        $html = $rule->getRuleContent();
        $html = $this->getPageFilter($html);

        return Data::jsonEncode($html);
    }

    /**
     * get css style for size chart content
     *
     * @param $rule
     *
     * @return string
     */
    public function getSizeChartCss($rule)
    {
        return $rule->getTemplateStyles();
    }

    /**
     * get default image url
     *
     * @return string
     */
    public function getDefaultIconUrl()
    {
        return $this->getViewFileUrl('Mageplaza_SizeChart::media/images/default-chart-icon.png');
    }

    /**
     * get icon url
     *
     * @return string
     */
    public function getIconUrl()
    {
        $iconImage = $this->_helperData->getConfigGeneral('upload_image_id');
        if ($iconImage) {
            $imageUrl = $this->_helperData->getImageUrl($iconImage);
        } else {
            $imageUrl = $this->getDefaultIconUrl();
        }

        return $imageUrl;
    }

    /**
     * get the next to attribute code
     *
     * @param $rule
     *
     * @return mixed
     */
    public function getNextAttributeCode($rule)
    {
        return $rule->getAttributeCode();
    }

    /**
     * get the next to attribute id
     *
     * @param $rule
     *
     * @return int
     */
    public function getNextAttributeId($rule)
    {
        return $this->_eavAttribute->getIdByCode(
            \Magento\Catalog\Model\Product::ENTITY,
            $this->getNextAttributeCode($rule)
        );
    }

    /**
     * set size chart product tab title
     */
    public function setTabTitle()
    {
        $title = __('Size Chart');
        $this->setTitle($title);
    }

    /**
     * Get override product size chart
     *
     * @param $entityType
     * @param bool $isCategory
     *
     * @return int
     */
    protected function _getOverrideSizeChart($entityType, $isCategory = false)
    {
        $attribute = $entityType->getCustomAttribute(Data::SIZE_CHART_ATTRIBUTE_CODE);
        $attribute = $attribute ? $attribute->getValue() : AttributeOptions::SIZE_CHART_ATTRIBUTE_PARENT_CATEGORY;

        /** Ger override category size chart */
        if ($attribute === AttributeOptions::SIZE_CHART_ATTRIBUTE_PARENT_CATEGORY && $isCategory === false && $this->getCategory()) {
            $isCategory = true;
            $attribute = $this->_getOverrideSizeChart($this->getCategory(), $isCategory);

            return $attribute;
        }

        return (int)$attribute;
    }

    /**
     * Get the rule that is validated with this product
     *
     * @return mixed|null
     */
    public function validateProductInRule()
    {
        if (!isset($this->sizeChartRule)) {
            $this->sizeChartRule = false;
            $product = $this->getProduct();
            $nativeSizeChart = $this->_getOverrideSizeChart($product);

            if ($nativeSizeChart === AttributeOptions::SIZE_CHART_ATTRIBUTE_PARENT_CATEGORY) {
                /** if the product use the current rules */
                $ruleCollection = $this->_helperData->getRuleCollection();
                foreach ($ruleCollection as $rule) {
                    if ($rule->getConditions()->validate($product)) {
                        $this->sizeChartRule = $rule;
                        break;
                    }
                }
            } elseif ($nativeSizeChart !== AttributeOptions::SIZE_CHART_ATTRIBUTE_DISABLED) {
                $rule = $this->_ruleFactory->create()->load($nativeSizeChart);

                if ($rule && $rule->getEnabled()){
                    $this->sizeChartRule = $rule;
                }
            }
        }

        return $this->sizeChartRule;
    }

    /**
     * Get selected category_id rule
     *
     * @return Category $category
     */
    public function getCategory()
    {
        if ($category_id = $this->_getCategoryId()) {
            return $this->_categoryFactory->load($category_id);
        }

        return null;
    }

    /**
     * Get selected category rule from breadcrums
     *
     * @return mixed|string
     */
    protected function _getCategoryId()
    {
        $paths = $this->_catalogHelper->getBreadcrumbPath();
        if (count($paths) === 1) {
            return null;
        }

        $categoryIds = [];
        array_pop($paths);
        foreach ($paths as $key => $path) {
            $categoryIds [] = $key;
        }
        $categoryId = array_pop($categoryIds);
        $categoryId = (int)trim($categoryId, self::CATALOG_TYPE);

        return $categoryId;
    }

    /**
     * Get all rule types
     *
     * @return array
     */
    public function getDisplayTypes()
    {
        /** @var Rule $rule */
        $rule = $this->validateProductInRule();
        $ruleType = $rule->getDisplayType();

        return explode(',', $ruleType);
    }
}
