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
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\UpgradeSchemaInterface;

/**
 * @codeCoverageIgnore
 */
class UpgradeSchema implements UpgradeSchemaInterface
{
    /**
     * {@inheritdoc}
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;
        $installer->startSetup();
        $connection = $installer->getConnection();

        if (version_compare($context->getVersion(), '1.0.2', '<')) {
            if ($installer->tableExists('mageplaza_sizechart_rule')) {
                if (!$connection->tableColumnExists(
                    $installer->getTable('mageplaza_sizechart_rule'),
                    'rule_description'
                )) {
                    $columns = [
                        'rule_description' => [
                            'type' => Table::TYPE_TEXT,
                            'length' => '2M',
                            'comment' => 'Rule Description',
                            'unsigned' => true,
                            'nullable' => true
                        ]
                    ];
                    $table = $installer->getTable('mageplaza_sizechart_rule');
                    foreach ($columns as $name => $definition) {
                        $connection->addColumn($table, $name, $definition);
                    }
                }
            }
        }

        $installer->endSetup();
    }
}
