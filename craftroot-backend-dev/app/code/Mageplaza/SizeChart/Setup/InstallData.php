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

namespace Mageplaza\SizeChart\Setup;

use Magento\Catalog\Model\Category;
use Magento\Catalog\Model\Product;
use Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface;
use Magento\Eav\Model\ResourceModel\Entity\Attribute;
use Magento\Eav\Setup\EavSetup;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Class InstallData
 * @package Mageplaza\SizeChart\Setup
 */
class InstallData implements InstallDataInterface
{
    /**
     * EAV setup factory
     *
     * @var EavSetupFactory
     */
    private $_eavSetupFactory;

    /**
     * @var StoreManagerInterface
     */
    private $_storeManager;

    /**
     * @var Attribute
     */
    private $_eavAttribute;

    /**
     * InstallData constructor.
     *
     * @param EavSetupFactory $eavSetupFactory
     * @param StoreManagerInterface $storeManager
     * @param Attribute $eavAttribute
     */
    public function __construct(
        EavSetupFactory $eavSetupFactory,
        StoreManagerInterface $storeManager,
        Attribute $eavAttribute
    ) {
        $this->_storeManager = $storeManager;
        $this->_eavSetupFactory = $eavSetupFactory;
        $this->_eavAttribute = $eavAttribute;
    }

    /**
     * @param ModuleDataSetupInterface $setup
     * @param ModuleContextInterface $context
     */
    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        /** @var EavSetup $eavSetup */
        $eavSetup = $this->_eavSetupFactory->create(['setup' => $setup]);

        /**
         * Add size chart attribute to the product eav/attribute
         */
        $eavSetup->removeAttribute(Product::ENTITY, 'mp_sizechart');
        $eavSetup->removeAttribute(Category::ENTITY, 'mp_sizechart');
        $eavSetup->addAttribute(
            Product::ENTITY,
            'mp_sizechart',
            [
                'group' => 'Product Details',
                'type' => 'text',
                'backend' => '',
                'frontend' => '',
                'label' => 'Size Chart',
                'input' => 'select',
                'class' => 'mp-size-chart',
                'source' => 'Mageplaza\SizeChart\Model\Config\Source\AttributeOptions',
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'visible' => true,
                'user_defined' => true,
                'searchable' => false,
                'filterable' => false,
                'comparable' => false,
                'visible_on_front' => false,
                'used_in_product_listing' => true,
                'unique' => false,
                'note' => 'When the "Inherit from Category/Rule" option is picked, Size Chart which is applied for the product will follow the Size Chart rule or this config of current category (the category which product belong to on current page).'
            ]
        );

        /**
         * Add size chart attribute to the category eav/attribute
         */
        $eavSetup->addAttribute(
            Category::ENTITY,
            'mp_sizechart',
            [
                'group' => 'General Information',
                'type' => 'text',
                'label' => 'Size Chart',
                'input' => 'select',
                'class' => 'mp-size-chart',
                'sort_order' => 10,
                'source' => 'Mageplaza\SizeChart\Model\Config\Source\AttributeOptions',
                'global' => ScopedAttributeInterface::SCOPE_GLOBAL,
                'required' => true,
                'user_defined' => true,
                'is_html_allowed_on_front' => true,
            ]
        );
    }
}
