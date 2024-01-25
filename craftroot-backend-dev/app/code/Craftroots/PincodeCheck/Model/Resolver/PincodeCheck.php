<?php

namespace Craftroots\PincodeCheck\Model\Resolver;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Encryption\EncryptorInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\ScopeInterface;

class PincodeCheck implements ResolverInterface
{
    protected $scopeConfig;
    protected $_dataHelper;
    protected $PincodeCheck;

    public function __construct(
        ScopeConfigInterface $scopeConfig,
        EncryptorInterface $encryptor,
        \Magento\Framework\App\Config\ConfigResource\ConfigInterface $resourceConfig,
        \Craftroots\PincodeCheck\Model\PincodeCheckFactory $PincodeCheck,
        \Craftroots\PincodeCheck\Helper\ApiData $dataHelper
    ) {
        $this->scopeConfig = $scopeConfig;
        $this->PincodeCheck = $PincodeCheck;
        $this->_dataHelper = $dataHelper;
        $this->resourceConfig = $resourceConfig;
        $this->encryptor = $encryptor;
    }
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    ) {
        try {
            $email = $this->scopeConfig->getValue("pincodecheck/general/email", ScopeInterface::SCOPE_STORE);
            $password = $this->scopeConfig->getValue("pincodecheck/general/password", ScopeInterface::SCOPE_STORE);
            $dePassword = $this->decryptPassword($password);
            $url = 'https://apiv2.shiprocket.in/v1/external/auth/login';
            $post_data = ['email' => $email, 'password' => $dePassword];
            $headers = [
                'Content-Type' => 'application/json',
            ];
            $post = $this->PincodeCheck->create()->getCollection();
            if (count($post) == 0) {
                $result = $this->_dataHelper->curlPost($url, $post_data, $headers);
                $response = $result['data'];
                $jsonResponse = json_decode($response, true);
                if (isset($jsonResponse['token'])) {
                    $token = $jsonResponse['token'];
                    $tokenGenerate = date('Y-m-d H:i:s');
                    $postObj = $this->PincodeCheck->create();
                    $postObj->setToken($token);
                    $postObj->setTokenDate($tokenGenerate);
                    $postObj->save();

                } else {
                    echo 'Failed to generate authorization token';
                }
            } else {
                $post = $this->PincodeCheck->create()->getCollection()->addFieldToFilter('entity_id', 1)->load();
                $tokenDate = '';
                foreach ($post as $posts) {
                    $tokenDate = $posts->getTokenDate();
                }
                $tokenUpdatedDate = new \DateTime($tokenDate);
                $now = new \DateTime();
                if ($tokenUpdatedDate->diff($now)->days > 8) {
                    $result = $this->_dataHelper->curlPost($url, $post_data, $headers);
                    $response = $result['data'];
                    $jsonResponse = json_decode($response, true);
                    if (isset($jsonResponse['token'])) {
                        $token = $jsonResponse['token'];
                        $tokenGenerate = date('Y-m-d H:i:s');
                        $postObj = $this->PincodeCheck->create()->load(1);
                        $postObj->setToken($token);
                        $postObj->setTokenDate($tokenGenerate);
                        $postObj->save();

                    } else {
                        echo 'Failed to generate authorization token';
                    }
                }
            }
            $pickupPostCode = $this->scopeConfig->getValue("pincodecheck/general/pincode", ScopeInterface::SCOPE_STORE);
            $deliveryPostCode = $args['deliveryPostCode'];

            if (!isset($deliveryPostCode)) {
                throw new GraphQlInputException(__('Delivery Post Code should be specified.'));
            }

            if(strlen($deliveryPostCode) < 6){
                //throw new GraphQlInputException(__('Delivery Post Code Length should be 6 character.'));
                return ["status" => false, "message" => 'Delivery Post Code Length should be 6 character.'];
            }
            $result = $this->checkPincode($pickupPostCode, $deliveryPostCode);

            if ($result == 200) {
                return ["status" => true, "message" => 'Product delivery is available for this pincode'];
            } else {
                return ["status" => false, "message" => 'Product delivery is not available for this pincode, please choose another pincode.'];
            }
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }

    public function decryptPassword($password)
    {
        return $this->encryptor->decrypt($password);
    }

    public function checkPincode($pickupPostCode, $deliveryPostCode)
    {
        $endpoint = 'https://apiv2.shiprocket.in/v1/external/courier/serviceability/';
        $params = array('pickup_postcode' => $pickupPostCode, 'delivery_postcode' => $deliveryPostCode, 'weight' => '1', 'cod' => '1');
        $checkPincodeUrl = $endpoint . '?' . http_build_query($params);
        $Obj = $this->PincodeCheck->create()->load(1);
        $tokenShip = $Obj->getToken();
        $header = [
            'Content-Type' => 'application/json',
            'Authorization: Bearer ' . $tokenShip,
        ];
        $result = $this->_dataHelper->curlGet($checkPincodeUrl, $header);
        return $result;
    }
}
