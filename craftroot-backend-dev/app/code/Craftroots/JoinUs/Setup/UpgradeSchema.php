<?php
namespace Craftroots\JoinUs\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
	public function upgrade( SchemaSetupInterface $setup, ModuleContextInterface $context ) {
		$installer = $setup;

		$installer->startSetup();

		if(version_compare($context->getVersion(), '1.2.0', '<')) {
			$installer->getConnection()->addColumn(
				$installer->getTable( 'craftroots_joinus' ),
				'country',
				[
					'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
					'nullable' => true,
                    'comment' => 'country',
					'length' => '255',
				]
			);
		}



		$installer->endSetup();
	}
}