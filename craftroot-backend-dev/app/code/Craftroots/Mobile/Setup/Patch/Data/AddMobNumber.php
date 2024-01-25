<?php
namespace Craftroots\Mobile\Setup\Patch\Data;

use Magento\Customer\Model\Customer;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;

class AddMobNumber implements DataPatchInterface
{
    private $customerSetupFactory;

    public function __construct(\Magento\Customer\Setup\CustomerSetupFactory $customerSetupFactory, ModuleDataSetupInterface $moduleDataSetup)
    {
        $this->customerSetupFactory = $customerSetupFactory;
        $this->setup = $moduleDataSetup;
    }

    public function apply()
    {
        //$this->setup->startSetup();

        $customerSetup = $this->customerSetupFactory->create(['setup' => $this->setup]);

            $customerSetup->addAttribute(
                Customer::ENTITY,
                'mobilenumber',
                [
                'type' => 'varchar',
                'label' => 'Mobile Number',
                'input' => 'text',
                'frontend_class' => 'validate-zero-or-greater validate-number',
                'class' => '',
                'source' => '',
                'backend' => (\Magento\Eav\Model\Entity\Attribute\Backend\ArrayBackend::class),
                'sort_order' => 100,
                'system' => false,
                'visible' => true,
                'required' => false,
                'user_defined' => false,
                'searchable' => true,
                'filterable' => true,
                'comparable' => true,
                'visible_on_front' => true,
                'unique' => false,
                'apply_to' => ''
                ]
            );

        // add attribute to form
        /** @var  $attribute */
        $attribute = $customerSetup->getEavConfig()->getAttribute(Customer::ENTITY, 'mobilenumber');
        $used_in_forms[]="adminhtml_customer";
        $used_in_forms[]="checkout_register";
        $used_in_forms[]="customer_account_create";
        $used_in_forms[]="customer_account_edit";
        $used_in_forms[]="adminhtml_checkout";

        $attribute->setData('used_in_forms', $used_in_forms)
            ->setData("is_used_for_customer_segment", true)
            ->setData("is_system", 0)
            ->setData("is_user_defined", 1)
            ->setData("is_visible", 1)
            ->setData("sort_order", 100);
        $attribute->save();
    }
    public static function getDependencies()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public static function getVersion()
    {
        return '3.0.6';
    }
}
