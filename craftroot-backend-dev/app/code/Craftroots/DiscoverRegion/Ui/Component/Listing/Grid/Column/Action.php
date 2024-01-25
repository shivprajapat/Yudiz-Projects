<?php

namespace Craftroots\DiscoverRegion\Ui\Component\Listing\Grid\Column;

use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Listing\Columns\Column;

class Action extends Column
{

    /** Add/Edit Url path */
    const URL_PATH_EDIT = 'discoverbyregion/grid/addrow';

    /** Delete Url Path */
    const URL_PATH_DELETE = 'discoverbyregion/grid/delete';

    /** @var UrlInterface */
    protected $urlBuilder;

    /**
     * @var string
     */
    private $_editUrl;
    private $_deleteUrl;

    /**
     * @param ContextInterface   $context
     * @param UiComponentFactory $uiComponentFactory
     * @param UrlInterface       $urlBuilder
     * @param array              $components
     * @param array              $data
     * @param string             $editUrl
     * @param string             $deleteUrl
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        UrlInterface $urlBuilder,
        array $components = [],
        array $data = [],
        $editUrl = self::URL_PATH_EDIT,
        $deleteUrl = self::URL_PATH_DELETE
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->_editUrl = $editUrl;
        $this->_deleteUrl = $deleteUrl;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * Prepare Data Source.
     *
     * @param array $dataSource
     *
     * @return array
     */
    public function prepareDataSource(array $dataSource)
    {
        if (isset($dataSource['data']['items']))
        {
            foreach ($dataSource['data']['items'] as & $item)
            {
                $name = $this->getData('name');
                if (isset($item['entity_id']))
                {
                    $item[$name]['edit'] = [
                        'href' => $this->urlBuilder->getUrl(
                                self::URL_PATH_EDIT, 
                                [
                                    'id' => $item['entity_id']
                                ]
                        ),
                        'label' => __('Edit')
                    ];
                    $item[$name]['delete'] = [
                        'href' => $this->urlBuilder->getUrl(
                                self::URL_PATH_DELETE, 
                                [
                                    'id' => $item['entity_id']
                                ]
                        ),
                        'label' => __('Delete'),
                        'confirm' => [
                            'title' => __(''),
                            'message' => __('Are you sure you want to do this?')
                        ]
                    ];
                    
                }
            }
        }
        return $dataSource;
    }

}
