<?php

namespace Craftroots\DiscoverRegion\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\Controller\Result\RedirectFactory;
use Magento\Framework\View\Result\PageFactory;

class Data extends AbstractHelper
{
	protected $fileSystem;
	protected $uploaderFactory;
	protected $resultPageFactory;
	protected $_messageManager;
	protected $_fileUploaderFactory;
	
	const XML_PATH_STORY = 'discoverbyregion/';

	public function __construct(
		\Magento\Framework\App\Helper\Context $context,
		\Magento\Framework\Filesystem $fileSystem,
		\Magento\MediaStorage\Model\File\UploaderFactory $uploaderFactory,
		\Magento\MediaStorage\Model\File\UploaderFactory $fileUploaderFactory
	) {
		parent::__construct($context);
		$this->fileSystem = $fileSystem;
		$this->uploaderFactory = $uploaderFactory;
		$this->_fileUploaderFactory = $fileUploaderFactory;
	}

	public function getConfigValue($field, $storeId = null)
	{
		return $this->scopeConfig->getValue(
			$field, ScopeInterface::SCOPE_STORE, $storeId
		);
	}

	public function getGeneralConfig($code, $storeId = null)
	{
		return $this->getConfigValue(self::XML_PATH_STORY .'general/'. $code, $storeId);
	}

	public function getImageUploader(){

		$uploaderFactory = $this->_fileUploaderFactory->create(['fileId' => 'fileupload']);
		// $uploaderFactory->setAllowedExtensions(['pdf']);
		$uploaderFactory->setAllowRenameFiles(false);
		$uploaderFactory->setFilesDispersion(false);
		$uploaderFactory->setAllowCreateFolders(true);
		$mediaDirectory = $this->fileSystem->getDirectoryRead(DirectoryList::MEDIA)->getAbsolutePath('Craftroots/DiscoverByRegion');
		// die("asd");
		$result = $uploaderFactory->save($mediaDirectory);
		$imgpath = 'Craftroots/DiscoverByRegion/'.$result['file'];
		return $imgpath;
	}


	function getYoutubeId($url)
	{
		$video_id = '';
		if (preg_match('/youtube\.com\/watch\?v=([^\&\?\/]+)/', $url, $match)) {
			$values = $match[1];
		} else if (preg_match('/youtube\.com\/embed\/([^\&\?\/]+)/', $url, $match)) {
			$values = $match[1];
		} else if (preg_match('/youtube\.com\/v\/([^\&\?\/]+)/', $url, $match)) {
			$values = $match[1];
		} else if (preg_match('/youtu\.be\/([^\&\?\/]+)/', $url, $match)) {
			$values = $match[1];
		} else if (preg_match('/youtube\.com\/verify_age\?next_url=\/watch%3Fv%3D([^\&\?\/]+)/', $url, $match)) {
			$values = $match[1];
		}
		$video_id = $match[1];
		return $video_id;
	}



}