<?php

namespace Craftroots\Assistance\Model\Resolver;

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

class AssistanceForm implements ResolverInterface
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
        \Craftroots\Assistance\Model\AssistanceFactory $postFactory

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
        $sendEmailTo = $this->scopeConfig->getValue('assistance/email/craftroots_recipient_email', $storeScope);
        $ccEmailTo = $this->scopeConfig->getValue('assistance/email/copy_to', $storeScope);
        $emailSender = $this->scopeConfig->getValue('assistance/email/craftroots_sender_email_identity', $storeScope);

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
                ->setTemplateIdentifier('craftroots_assistance_email_template_front') // this code we have mentioned in the email_templates.xml
                ->setTemplateOptions(
                    [
                        'area' => \Magento\Framework\App\Area::AREA_FRONTEND, // this is using frontend area to get the template file
                        'store' => \Magento\Store\Model\Store::DEFAULT_STORE_ID,
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
            $emailTemplateVariables = array(
                'fullname' => $args['input']['name'],
                'email' => $args['input']['email'],
                'telephone' => $args['input']['telephone'],
                'message' => $args['input']['message']
            );
            $to = $sendEmailTo;
            $sender = array('name' => $adminSenderName, 'email' => $adminSenderEmail);
            $transport = $this->transportBuilder->setTemplateIdentifier('craftroots_assistance_email_template_admin')
                ->setTemplateOptions(
                    [
                        'area' => \Magento\Framework\App\Area::AREA_FRONTEND,
                        'store' => \Magento\Store\Model\Store::DEFAULT_STORE_ID,
                    ]
                )
                ->setTemplateVars($emailTemplateVariables)
                ->setFrom($sender)
                ->addTo($to);
            foreach ($toCc as $addCcData) {
                $transport->addCc($addCcData);
            }
            $transport->getTransport()->sendMessage();
            $dataStore = [
                'name' => $args['input']['name'],
                'email' => $args['input']['email'],
                'telephone' => $args['input']['telephone'],
                'message' => $args['input']['message']
            ];
            $post->setData($dataStore)->save();
            return [
                'success' => true,
                'message' => "Successfully saved data",
            ];

        }

    }
}
