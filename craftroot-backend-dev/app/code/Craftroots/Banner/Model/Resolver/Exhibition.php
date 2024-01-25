<?php

declare (strict_types = 1);

namespace Craftroots\Banner\Model\Resolver;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Store\Model\ScopeInterface;
use Mageplaza\BannerSlider\Helper\Data as bannerHelper;

/**
 * @inheritdoc
 */
class Exhibition implements ResolverInterface
{

    protected $assetRepository;
    protected $_storeManager;
    protected $scopeConfig;
    public $helperData;

    public function __construct(
        \Magento\Framework\View\Asset\Repository $assetRepository,
        ScopeConfigInterface $scopeConfig,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        bannerHelper $helperData

    ) {
        $this->assetRepository = $assetRepository;
        $this->scopeConfig = $scopeConfig;
        $this->_storeManager = $storeManager;
        $this->helperData = $helperData;

    }

    /**
     * @inheritdoc
     */
    public function resolve(Field $field, $context, ResolveInfo $info, array $value = null, array $args = null)
    {
        try {
            $exhibitionidSliderId = $this->scopeConfig->getValue("bannerslider/general/exhibitionid", ScopeInterface::SCOPE_STORE);
            if ($exhibitionidSliderId != '') {
                $sliderCollection = $this->helperData->getBannerCollection($exhibitionidSliderId);
                $mediaUrl = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
                $exhibitionBannerArray = [];
                $i = 0;
                foreach ($sliderCollection as $Collection) {
                    $bannerArray = [];
                    $bannerArray = [
                        'exhibitionBannerImage' => $mediaUrl . 'mageplaza/bannerslider/banner/image/' . $Collection->getImage()
                    ];
                    $exhibitionBannerArray['data'][$i] = $bannerArray;
                    $i++;
                }
                return $exhibitionBannerArray;
            }else{
                throw new GraphQlInputException(__('please configure Exhibition banner slider id'));
            }

        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }
    }
}
