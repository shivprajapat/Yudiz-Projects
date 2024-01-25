<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Craftroots\Mobile\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Customer\Api\AccountManagementInterface;
use Magento\Customer\Api\CustomerRepositoryInterface;


/**
 * Create customer account resolver
 */
class AccountConfirmation implements ResolverInterface
{

    public function __construct(
        \Magento\Integration\Model\Oauth\Token $token,
        AccountManagementInterface $customerAccountManagement,
        CustomerRepositoryInterface $customerRepository
    ) {
        $this->token = $token;
        $this->customerAccountManagement = $customerAccountManagement;
        $this->customerRepository = $customerRepository;
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
        if (empty($args['id']) || empty($args['key'])) {
            return ['success' => false, 'token' => "", 'message' => "Something went wrong"];
        }
        try{
        $customerEmail = $this->customerRepository->getById($args['id'])->getEmail();
        $customer = $this->customerAccountManagement->activate($customerEmail, $args['key']);
        if($customer->getId()){
             $token = $this->token->createCustomerToken($customer->getId())->getToken();
             return ['success' => true, 'token' => $token, 'message' => "Account Verified Successfully"];
        }else{
            return ['success' => false, 'token' => "", 'message' => "Your link is expired."];
        }
    }
        catch(\Exception $e){
            return ['success' => false, 'token' => "", 'message' => $e->getMessage()];
           
        }

        
    }
}
