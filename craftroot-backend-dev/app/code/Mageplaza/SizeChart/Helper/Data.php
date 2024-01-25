<?php
/**
 * Mageplaza
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Mageplaza.com license that is
 * available through the world-wide-web at this URL:
 * https://www.mageplaza.com/LICENSE.txt
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Mageplaza
 * @package     Mageplaza_SizeChart
 * @copyright   Copyright (c) Mageplaza (https://www.mageplaza.com/)
 * @license     https://www.mageplaza.com/LICENSE.txt
 */

namespace Mageplaza\SizeChart\Helper;

use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\Exception\FileSystemException;
use Magento\Framework\Filesystem;
use Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection;
use Magento\Framework\ObjectManagerInterface;
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;
use Mageplaza\Core\Helper\AbstractData as CoreHelper;
use Mageplaza\SizeChart\Helper\Image as HelperImage;
use Mageplaza\SizeChart\Model\ResourceModel\Rule\Collection;
use Mageplaza\SizeChart\Model\ResourceModel\Rule\CollectionFactory as RuleCollection;

/**
 * Class Data
 * @package Mageplaza\SizeChart\Helper
 */
class Data extends CoreHelper
{
    const CONFIG_MODULE_PATH = 'sizechart';
    const SIZE_CHART_ATTRIBUTE_CODE = 'mp_sizechart';

    /**
     * @var DirectoryList
     */
    protected $_directoryList;

    /**
     * @var Filesystem
     */
    protected $_fileSystem;

    /**
     * @var HelperImage
     */
    protected $_imageHelper;

    /**
     * @var RuleCollection
     */
    protected $_ruleCollection;

    /**
     * Data constructor.
     *
     * @param Context $context
     * @param ObjectManagerInterface $objectManager
     * @param DirectoryList $directoryList
     * @param Filesystem $filesystem
     * @param Image $image
     * @param StoreManagerInterface $storeManager
     * @param RuleCollection $ruleCollection
     */
    public function __construct(
        Context $context,
        ObjectManagerInterface $objectManager,
        DirectoryList $directoryList,
        Filesystem $filesystem,
        HelperImage $image,
        StoreManagerInterface $storeManager,
        RuleCollection $ruleCollection
    ) {
        $this->_fileSystem = $filesystem;
        $this->_directoryList = $directoryList;
        $this->_imageHelper = $image;
        $this->_ruleCollection = $ruleCollection;

        parent::__construct($context, $objectManager, $storeManager);
    }

    /**
     * Get default template path
     *
     * @param $templateId
     * @param string $type
     *
     * @return string
     */
    public function getTemplatePath($templateId, $type = '.html')
    {
        /** Get directory of Data.php */
        $currentDir = __DIR__;

        /** Get root directory(path of magento's project folder) */
        $rootPath = $this->_directoryList->getRoot();

        $currentDirArr = explode('\\', $currentDir);
        if (count($currentDirArr) == 1) {
            $currentDirArr = explode('/', $currentDir);
        }

        $rootPathArr = explode('/', $rootPath);
        if (count($rootPathArr) == 1) {
            $rootPathArr = explode('\\', $rootPath);
        }

        $basePath = '';
        for ($i = count($rootPathArr); $i < count($currentDirArr) - 1; $i++) {
            $basePath .= $currentDirArr[$i] . '/';
        }

        $templatePath = $basePath . 'view/base/templates/default/demo/';

        return $templatePath . $templateId . $type;
    }

    /**
     * @param $relativePath
     *
     * @return string
     * @throws FileSystemException
     */
    public function readFile($relativePath)
    {
        $rootDirectory = $this->_fileSystem->getDirectoryRead(DirectoryList::ROOT);

        return $rootDirectory->readFile($relativePath);
    }

    /**
     * @param $templateId
     *
     * @return string
     * @throws FileSystemException
     */
    public function getDefaultTemplateHtml($templateId)
    {
        return $this->readFile($this->getTemplatePath($templateId));
    }

    /**
     * @param $templateId
     *
     * @return string
     * @throws FileSystemException
     */
    public function getDefaultTemplateCss($templateId)
    {
        return $this->readFile($this->getTemplatePath($templateId, '.css'));
    }

    /**
     * @param $file
     *
     * @return string
     */
    public function getImageUrl($file)
    {
        return $this->_imageHelper->getBaseMediaUrl() . '/' . $this->_imageHelper->getMediaPath($file);
    }

    /**
     * Get rule collection
     *
     * @param null $storeId
     *
     * @return Collection
     */
    public function getRuleCollection($storeId = null)
    {
        /** @var Collection $collection */
        $collection = $this->_ruleCollection->create()
            ->addFieldToFilter('enabled', 1)
            ->setOrder('priority', 'asc');
        $this->addStoreFilter($collection, $storeId);

        return $collection;
    }

    /**
     * Filter by store
     *
     * @param AbstractCollection $collection
     * @param null $storeId
     *
     * @return mixed
     */
    public function addStoreFilter($collection, $storeId = null)
    {
        if (is_null($storeId)) {
            $storeId = $this->storeManager->getStore()->getId();
        }

        $collection->addFieldToFilter('store_ids', [
            ['finset' => Store::DEFAULT_STORE_ID],
            ['finset' => $storeId]
        ]);

        return $collection;
    }
}
