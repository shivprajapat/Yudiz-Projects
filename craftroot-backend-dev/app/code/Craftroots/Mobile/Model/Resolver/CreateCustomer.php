<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Mobile\Model\Resolver;

use Magento\CustomerGraphQl\Model\Customer\CreateCustomerAccount;
use Magento\Customer\Model\CustomerFactory;
use Magento\CustomerGraphQl\Model\Customer\ExtractCustomerData;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Newsletter\Model\Config;
use Magento\Store\Model\ScopeInterface;
use Magento\Customer\Api\AccountManagementInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Create customer account resolver
 */
class CreateCustomer implements ResolverInterface
{
    /**
     * @var ExtractCustomerData
     */
    private $extractCustomerData;

    /**
     * @var CreateCustomerAccount
     */
    private $createCustomerAccount;

    /**
     * @var Config
     */
    private $newsLetterConfig;
    protected $customerFactory;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;


    /**
     * CreateCustomer constructor.
     *
     * @param ExtractCustomerData $extractCustomerData
     * @param CreateCustomerAccount $createCustomerAccount
     * @param Config $newsLetterConfig
    * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        ExtractCustomerData $extractCustomerData,
        CreateCustomerAccount $createCustomerAccount,
        Config $newsLetterConfig,
        customerFactory $customerFactory,
        AccountManagementInterface $accountManagement,
        StoreManagerInterface $storeManager
    ) {
        $this->newsLetterConfig = $newsLetterConfig;
        $this->extractCustomerData = $extractCustomerData;
        $this->createCustomerAccount = $createCustomerAccount;
        $this->accountManagement = $accountManagement;
        $this->customerFactory = $customerFactory;
         $this->storeManager = $storeManager;
    }

    /**
     * @inheritdoc
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {


        if (empty($args['input']) || !is_array($args['input'])) {
            throw new GraphQlInputException(__('"input" value should be specified'));
        }
        if (isset($args['input']['mobilenumber'])) {
            $mobileCheck = $this->customerFactory->create()->getCollection()->addFieldToFilter("mobilenumber",$args['input']['mobilenumber'])->load();
            if(count($mobileCheck) > 0){
             throw new GraphQlInputException(
                 __('Mobile Number Already exists'));
           }

            if(strlen($args['input']['mobilenumber'])== 10 && is_numeric($args['input']['mobilenumber'])){
                $args['input']['mobilenumber'] = $args['input']['mobilenumber'];
            }else{
                throw new GraphQlInputException(__('Please enter your mobile number as 10 Number.'));
            }
        }
        if (isset($args['input']['assistance_allowed'])) {
            $args['input']['extension_attributes']['assistance_allowed'] = $args['input']['assistance_allowed'];
        }
        
        $websiteId = (int)$this->storeManager->getWebsite()->getId();
        $isEmailNotExists = $this->accountManagement->isEmailAvailable($args['input']['email'], $websiteId);

        if(!$isEmailNotExists){
             throw new GraphQlInputException(__('A customer with the same email address already exists.'));
        }

        $customer = $this->createCustomerAccount->execute($args['input'],$context->getExtensionAttributes()->getStore());
        
        $confirmationRequired = false;
        $confirmationStatus = $this->accountManagement->getConfirmationStatus($customer->getId());
        if ($confirmationStatus === AccountManagementInterface::ACCOUNT_CONFIRMATION_REQUIRED) {
            $confirmationRequired = true;
          } 

        $data = $this->extractCustomerData->execute($customer);
        return ['customer' => $data, 'confirmation_required' => $confirmationRequired, 'message' => "Customer is registered successfully, please check your email for confirmation."];
    }
}
