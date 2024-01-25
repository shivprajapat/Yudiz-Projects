<?php

namespace Craftroots\JoinUs\Ui\Component\Listing\Grid\Column;

use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Store\Model\StoreManagerInterface;

class MultipleImages extends \Magento\Ui\Component\Listing\Columns\Column

{
    /**
     * object of store manger class
     * @var storemanager
     */
    protected $_storeManager;

    /**
     * @param ContextInterface      $context
     * @param UiComponentFactory    $uiComponentFactory
     * @param StoreManagerInterface $storemanager
     * @param array                 $components
     * @param array                 $data
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        StoreManagerInterface $storemanager,
        array $components = [],
        array $data = []
    ) {
        parent::__construct($context, $uiComponentFactory, $components, $data);
        $this->_storeManager = $storemanager;
    }

    /**
     * Prepare Data Source
     *
     * @param array $dataSource
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        $mediaDirectory = $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
        if (isset($dataSource['data']['items'])) {

            $fieldName = $this->getData('name');
            foreach ($dataSource['data']['items'] as &$item) {
                $multi = $item['images'];
                $imagesArray = array();
                $imagesContainer = '';
                //imagesArray contain images
                $imagesArray = explode(",", $multi);
                foreach ($imagesArray as $image) {
                    $imageUrl = $mediaDirectory . 'joinus/images' . $image;
                    $item[$fieldName . '_src'] = $imageUrl;
                    $item[$fieldName . '_orig_src'] = $imageUrl;
                    $imagesContainer = $imagesContainer . "<a href=" . $imageUrl . " target='_blank'><img src=" . $imageUrl . " width='50px' height='50px' style='display:inline-block;margin:2px'/></a>";
                }
                $item[$fieldName] = $imagesContainer;

            }
        }
        return $dataSource;
    }
}
