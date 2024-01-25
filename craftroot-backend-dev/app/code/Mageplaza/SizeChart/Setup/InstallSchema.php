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

use Magento\Framework\DB\Ddl\Table;
use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Zend_Db_Exception;

/**
 * Class InstallSchema
 * @package Mageplaza\SizeChart\Setup
 */
class InstallSchema implements InstallSchemaInterface
{
    /**
     * @param SchemaSetupInterface $setup
     * @param ModuleContextInterface $context
     *
     * @throws Zend_Db_Exception
     */
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;
        $installer->startSetup();

        if (!$installer->tableExists('mageplaza_sizechart_rule')) {
            $table = $installer->getConnection()
                ->newTable($installer->getTable('mageplaza_sizechart_rule'))
                ->addColumn('rule_id', Table::TYPE_INTEGER, null, [
                    'identity' => true,
                    'unsigned' => true,
                    'nullable' => false,
                    'primary' => true
                ], 'Rule Id')
                ->addColumn('name', Table::TYPE_TEXT, 255, [], 'Name')
                ->addColumn('rule_content', Table::TYPE_TEXT, '2M', [], 'Rule Content')
                ->addColumn('template_styles', Table::TYPE_TEXT, '2M', [], 'Template Styles')
                ->addColumn('store_ids', Table::TYPE_TEXT, null, ['nullable' => false, 'unsigned' => true], 'Store Id')
                ->addColumn('display_type', Table::TYPE_TEXT, 255, [], 'Display Type')
                ->addColumn('enabled', Table::TYPE_SMALLINT, 1, [], 'Enabled')
                ->addColumn('created_at', Table::TYPE_TIMESTAMP, null, [], 'Created At')
                ->addColumn('conditions_serialized', Table::TYPE_TEXT, '2M', [], 'Conditions Serialized')
                ->addColumn('attribute_code', Table::TYPE_TEXT, 255, [], 'Attribute Code')
                ->addColumn('demo_templates', Table::TYPE_TEXT, 255, [], 'Demo Template')
                ->addColumn(
                    'priority',
                    Table::TYPE_SMALLINT,
                    null,
                    ['unsigned' => true, 'nullable' => false, 'default' => '0'],
                    'Priority'
                )
                ->addColumn('updated_at', Table::TYPE_TIMESTAMP, null, [], 'Rule Updated At')
                ->addColumn('created_at', Table::TYPE_TIMESTAMP, null, [], 'Rule Created At')
                ->setComment('SizeChart Rule');

            $installer->getConnection()->createTable($table);
        }

        $installer->endSetup();
    }
}
