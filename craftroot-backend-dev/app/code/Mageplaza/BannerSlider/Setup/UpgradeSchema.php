<?php
namespace Mageplaza\BannerSlider\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;

class UpgradeSchema implements UpgradeSchemaInterface
{
	public function upgrade( SchemaSetupInterface $setup, ModuleContextInterface $context ) {
		$installer = $setup;

		$installer->startSetup();

		if(version_compare($context->getVersion(), '2.1.0', '<')) {
			$installer->getConnection()->addColumn(
				$installer->getTable( 'mageplaza_bannerslider_banner' ),
				'mobile_banner',
				[
					'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
					'nullable' => true,
                    'comment' => 'Mobile Banner',
					'length' => '255',
				]
			);
		}
		$installer->endSetup();
	}
}