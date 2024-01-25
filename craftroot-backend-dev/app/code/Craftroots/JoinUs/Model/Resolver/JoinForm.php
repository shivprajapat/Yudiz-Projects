<?php

namespace Craftroots\JoinUs\Model\Resolver;

use Magento\Framework\Mail\Template\TransportBuilder;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Filesystem;
use Magento\Framework\Filesystem\Driver\File;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\StoreManagerInterface;

class JoinForm implements ResolverInterface
{
    /**
     * @var CustomFormCheck
     */
    protected $_postFactory;
    protected $fileSystem;
    protected $fileDriver;
    protected $scopeConfig;
    protected $transportBuilder;
    protected $storeManager;
    public $messageManager;
    protected $inlineTranslation;
    protected $_storeManager;

    /**
     * @param CustomFormCheck $customFormCheck
     */
    public function __construct(
        Filesystem $fileSystem,
        File $fileDriver,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Framework\Message\ManagerInterface $messageManager,
        \Magento\Framework\Translate\Inline\StateInterface $inlineTranslation,
        StoreManagerInterface $storemanager,
        TransportBuilder $transportBuilder,
        \Craftroots\JoinUs\Model\JoinUsFactory $postFactory

    ) {
        $this->_postFactory = $postFactory;
        $this->fileSystem = $fileSystem;
        $this->fileDriver = $fileDriver;
        $this->scopeConfig = $scopeConfig;
        $this->inlineTranslation = $inlineTranslation;
        $this->storeManager = $storeManager;
        $this->transportBuilder = $transportBuilder;
        $this->messageManager = $messageManager;
        $this->_storeManager = $storemanager;
    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {

        $storeScope = \Magento\Store\Model\ScopeInterface::SCOPE_STORE;
        $storeId = $this->storeManager->getStore()->getId();
        $sendEmailTo = $this->scopeConfig->getValue('craftroots/email/craftroots_recipient_email', $storeScope);
        $ccEmailTo = $this->scopeConfig->getValue('craftroots/email/copy_to', $storeScope);
        $emailSender = $this->scopeConfig->getValue('craftroots/email/craftroots_sender_email_identity', $storeScope);

        if ($emailSender == 'sales') {
            $adminSenderName = $this->scopeConfig->getValue('trans_email/ident_sales/name', $storeScope);
            $adminSenderEmail = $this->scopeConfig->getValue('trans_email/ident_sales/email', $storeScope);

        } elseif ($emailSender == 'general') {
            $adminSenderName = $this->scopeConfig->getValue('trans_email/ident_general/name', $storeScope);
            $adminSenderEmail = $this->scopeConfig->getValue('trans_email/ident_general/email', $storeScope);
        } elseif ($emailSender == 'support') {
            $adminSenderName = $this->scopeConfig->getValue('trans_email/ident_support/name', $storeScope);
            $adminSenderEmail = $this->scopeConfig->getValue('trans_email/ident_support/email', $storeScope);
        } else {
            $adminSenderName = $this->scopeConfig->getValue('trans_email/ident_general/name', $storeScope);
            $adminSenderEmail = $this->scopeConfig->getValue('trans_email/ident_general/email', $storeScope);
        }
        $recipientMail = $args['input']['email'];
        $toCc = explode(',', $ccEmailTo);

        try {
            $sender = array('name' => $adminSenderName, 'email' => $adminSenderEmail);
            $emailTemplateVariables = array(
                'fullname' => $args['input']['name'],
            );
            $transport = $this->transportBuilder
                ->setTemplateIdentifier('craftroots_email_template_front') // this code we have mentioned in the email_templates.xml
                ->setTemplateOptions(
                    [
                        'area' => \Magento\Framework\App\Area::AREA_FRONTEND, // this is using frontend area to get the template file
                        'store' => $storeId,
                    ]
                )
                ->setTemplateVars($emailTemplateVariables)
                ->setFrom($sender)
                ->addTo($recipientMail)
                ->getTransport();
            $transport->sendMessage();
            $this->inlineTranslation->resume();
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        } finally {
            $post = $this->_postFactory->create();
            $data = $this->uploadFile($args);
            $multipleImages = implode(',', $data);
            $mediaDirectory = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            $emailTemplateVariables = array(
                'fullname' => $args['input']['name'],
                'email' => $args['input']['email'],
                'telephone' => $args['input']['telephone'],
                'city' => $args['input']['city'],
                'state' => $args['input']['state'],
                'country' => $args['input']['country'],
            );
            $to = $sendEmailTo;
            $sender = array('name' => $adminSenderName, 'email' => $adminSenderEmail);
            $transport = $this->transportBuilder->setTemplateIdentifier('craftroots_email_template_admin')
                ->setTemplateOptions(
                    [
                        'area' => \Magento\Framework\App\Area::AREA_FRONTEND,
                        'store' => $storeId,
                    ]
                )
                ->setTemplateVars($emailTemplateVariables)
                ->setFrom($sender)
                ->addTo($to);
            foreach ($data as $multipleImagesData) {
                $imagetype = explode('.', $multipleImagesData);
                $imageUrl = $mediaDirectory . 'joinus/images' . $multipleImagesData;
                $transport->addAttachment(file_get_contents($imageUrl), $multipleImagesData, $imagetype[1]);
            }
            foreach ($toCc as $addCcData) {
                $transport->addCc($addCcData);
            }
            $transport->getTransport()->sendMessage();
            $dataStore = [
                'name' => $args['input']['name'],
                'email' => $args['input']['email'],
                'telephone' => $args['input']['telephone'],
                'city' => $args['input']['city'],
                'state' => $args['input']['state'],
                'country' => $args['input']['country'],
                'images' => $multipleImages,
            ];
            $post->setData($dataStore)->save();
            return [
                'success' => true,
                'message' => "Successfully saved data.",
            ];

        }

    }

    public function uploadFile(array $fileData)
    {
        // convert base64 string to image and save as file on server.
        $uploadedFileName = [];
        $images = $fileData['input']['images'];
        $i = 0;
        foreach ($images as $files) {
            $fileName = '';
            $fileName = rand() . time();
            $mediaPath = $this->fileSystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath();

            $originalPath = 'joinus/images/';
            $mediaFullPath = $mediaPath . $originalPath;
            if (!file_exists($mediaFullPath)) {
                mkdir($mediaFullPath, 0775, true);
            }
            /* Check File is exist or not */
            $fullFilepath = $mediaFullPath . $fileName;
            if ($this->fileDriver->isExists($fullFilepath)) {
                $fileName = rand() . time() . $fileName;
            }
            $base64_encoded_string = $files['base_64_images'];
            $image_extension = substr($base64_encoded_string, strpos($base64_encoded_string, '/') + 1, strpos($base64_encoded_string, ';') - strpos($base64_encoded_string, '/') - 1);
            $fileSupportedType = array("jpg", "png", "jpeg","pdf");
            if (in_array($image_extension, $fileSupportedType)) {
                $data_val = explode(",", $base64_encoded_string);
                $fileContent = base64_decode($data_val[1]);
                $savedFile = fopen($mediaFullPath . $fileName . "." . $image_extension, "wb");
                fwrite($savedFile, $fileContent);
                fclose($savedFile);
                $uploadedFileName[] = "/" . $fileName . "." . $image_extension;
            }
            $i++;
        }
        return $uploadedFileName;
    }
}
