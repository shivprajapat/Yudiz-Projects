<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Mobile\Model\Resolver;

use Magento\Customer\Api\AccountManagementInterface;
use Magento\Framework\Exception\AuthenticationException;
use Magento\Framework\Exception\EmailNotConfirmedException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlAuthenticationException;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Integration\Api\CustomerTokenServiceInterface;
use Magento\Store\Model\StoreManagerInterface;

/**
 * Customers Token resolver, used for GraphQL request processing.
 */
class GenerateCustomerToken implements ResolverInterface
{
    /**
     * @var CustomerTokenServiceInterface
     */
    private $customerTokenService;

    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    /**
     * @param CustomerTokenServiceInterface $customerTokenService
     */
    public function __construct(
        CustomerTokenServiceInterface $customerTokenService,
        AccountManagementInterface $customerAccountManagement,
        StoreManagerInterface $storeManager
    ) {
        $this->customerTokenService = $customerTokenService;
        $this->customerAccountManagement = $customerAccountManagement;
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
        if (empty($args['email'])) {
            throw new GraphQlInputException(__('Specify the "email" value.'));

        } else if ($this->emailExistOrNot($args['email'])) {
            throw new GraphQlInputException(__('This Email ID is not registered with us. Please login with your registered Email ID.'));
        }

        if (empty($args['password'])) {
            throw new GraphQlInputException(__('Specify the "password" value.'));
        }

        // will check and add later this confirmation code
        try {
            $customer = $this->customerAccountManagement->authenticate($args['email'], $args['password']);
        } catch (EmailNotConfirmedException $e) {
            $value = 'confirm-email-address?email=' . $args['email'];
            $message = __(
                '<div class="font-medium text-sm text-error">
                <span>This account is not confirmed.</span>
                <a class="capitalize underline " href="%1">
                    Click here
                </a>
                <span> to resend confirmation email.</span>
              </div>',
                $value
            );
            throw new GraphQlInputException($message);
        } catch (\Exception $e) {
            throw new GraphQlInputException(__('Invalid Email id or password.'));
        }

        try {
            $token = $this->customerTokenService->createCustomerAccessToken($args['email'], $args['password']);
            return ['token' => $token];
        } catch (AuthenticationException $e) {
            throw new GraphQlAuthenticationException(__("Please enter the correct email or password."), $e);
        }
    }

    /**
     *
     * @return bool
     */
    public function emailExistOrNot($email): bool
    {
        $websiteId = (int) $this->storeManager->getWebsite()->getId();
        $isEmailNotExists = $this->customerAccountManagement->isEmailAvailable($email, $websiteId);
        return $isEmailNotExists;
    }
}
