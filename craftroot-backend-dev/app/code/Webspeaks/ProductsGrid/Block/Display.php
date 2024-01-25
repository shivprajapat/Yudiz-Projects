<?php
namespace Webspeaks\ProductsGrid\Block;

use Magento\Catalog\Api\CategoryRepositoryInterface;
use Magento\Framework\App\ResourceConnection;
use Magento\Catalog\Helper\Image;

class Display extends \Magento\Catalog\Block\Product\ListProduct

{
    protected $_collection;
    protected $_contactCollectionFactory;
    protected $categoryRepository;
    protected $_resource;
    protected $swatchHelper;
    protected $_productAttributeRepository;
    protected $_attributeFactory;
    protected $_productRepository;
    protected $_productloader; 
    protected $imageHelper; 


    public function __construct(
        \Magento\Catalog\Block\Product\Context$context,
        \Webspeaks\ProductsGrid\Model\ResourceModel\Contact\CollectionFactory $contactCollectionFactory,
        \Magento\Framework\Data\Helper\PostHelper$postDataHelper,
        \Magento\Catalog\Model\Layer\Resolver$layerResolver,
        \Magento\Catalog\Model\Product\Attribute\Repository$productAttributeRepository,
        CategoryRepositoryInterface $categoryRepository,
        \Magento\Framework\Url\Helper\Data$urlHelper,
        \Magento\Eav\Model\Config$eavConfig,
        \Magento\Catalog\Model\ResourceModel\Product\CollectionFactory $collection,
        \Magento\Catalog\Model\ResourceModel\Eav\Attribute$attributeFactory,
        \Magento\Catalog\Model\ProductRepository $productRepository,
        \Magento\Swatches\Helper\Data$swatchHelper,
        ResourceConnection $resourceConnection,
        \Magento\Catalog\Model\ProductFactory $_productloader,
        Image $imageHelper,
        \Magento\Framework\App\ResourceConnection $resource,

        array $data = []
    ) {
        $this->categoryRepository = $categoryRepository;
        $this->_collection = $collection;
        $this->swatchHelper = $swatchHelper;
        $this->_productAttributeRepository = $productAttributeRepository;
        $this->eavConfig = $eavConfig;
        $this->_resource = $resource;
        $this->_productRepository = $productRepository;
        $this->_attributeFactory = $attributeFactory;
        $this->_productloader = $_productloader;
        $this->imageHelper = $imageHelper;
        $this->_contactCollectionFactory = $contactCollectionFactory;
        $this->resourceConnection = $resourceConnection;

        parent::__construct($context, $postDataHelper, $layerResolver, $categoryRepository, $urlHelper, $data);
    }

    public function testJoinRight(){

       // $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        // Load Contact Model
      //  $contactmodel = $objectManager->get('\Webspeaks\ProductsGrid\Model\ResourceModel\Contact\CollectionFactory');
        $collection =  $this->_contactCollectionFactory->create();

       // $resource = $objectManager->get('Magento\Framework\App\ResourceConnection');
        $connection = $this->_resource->getConnection();
        $second_table_name = $this->_resource ->getTableName('webspeaks_product_attachment_rel'); //gives table name
        $collection->getSelect()->join(array('second' => $second_table_name),
                                               'main_table.contact_id = second.contact_id');

       return $collection;
        //  echo $collection->getSelect()->__toString(); 
        //  exit();
    }
    public function getLoadProduct($id)
    {
        return $this->_productloader->create()->load($id);
    }
    public function getProductImageUrl($id)
    {
        try 
        {
            $product = $this->_productloader->create()->load($id);;
        } 
        catch (NoSuchEntityException $e) 
        {
            return 'Data not found';
        }
        $url = $this->imageHelper->init($product, 'product_thumbnail_image')->getUrl();
        return $url;
    }
}
