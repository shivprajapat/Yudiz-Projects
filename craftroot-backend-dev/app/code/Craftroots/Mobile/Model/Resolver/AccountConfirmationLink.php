<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Mobile\Model\Resolver;

use Magento\Customer\Api\AccountManagementInterface;
use Magento\Customer\Api\CustomerRepositoryInterface;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

/**
 * Create customer account resolver
 */
class AccountConfirmationLink implements ResolverInterface
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
        if (empty($args['email'])) {
            return ['success' => false, 'message' => "Email is required"];
        }
        try {
            $this->customerAccountManagement->resendConfirmation(
                $args['email'],
                $context->getExtensionAttributes()->getStore()->getWebsiteId()
            );
            return ['success' => true, 'message' => "Please check your email for confirmation key."];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => "This email does not require confirmation."];
        }

    }
}
