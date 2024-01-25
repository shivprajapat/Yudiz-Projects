<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Magento\Catalog\Api\CategoryManagementInterface;
use Magento\Catalog\Api\Data\CategoryTreeInterface;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Psr\Log\LoggerInterface;

/**
 * Orders data reslover
 */
class CategoryFilters implements ResolverInterface
{
    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var CategoryManagementInterface
     */
    private $categoryManagement;
    public function __construct(
        CategoryManagementInterface $categoryManagement,
        LoggerInterface $logger
    ) {
        $this->categoryManagement = $categoryManagement;
        $this->logger = $logger;
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
        if (!isset($args['category_id'])) {
            throw new GraphQlInputException(__('category id should be specified'));
        }
        try {
            $categoryData = [];
            $categoryId = $args['category_id'];
            $i = 0;
            $getSubCategory = $this->getCategoryData($categoryId);
            foreach ($getSubCategory->getChildrenData() as $category) {
                $categoryData['data'][$i]['value'] =  $category->getId();
                $categoryData['data'][$i]['label'] = $category->getName();
                if (count($category->getChildrenData())) {
                    $subCatId = $category->getId();
                    $getSubCategoryLevelDown = $this->getCategoryData($subCatId);
                    $subCategoryData = [];
                    foreach ($getSubCategoryLevelDown->getChildrenData() as $subcategory) {
                        $subCategoryData[] = [
                            'label' => $subcategory->getName(),
                            'value' => $subcategory->getId(),
                        ];
                    }
                    $categoryData['data'][$i]['Child'] = $subCategoryData;
                }
                $i++;
            }
            return $categoryData;
        } catch (NoSuchEntityException $e) {
            throw new GraphQlNoSuchEntityException(__($e->getMessage()), $e);
        }

    }

    public function getCategoryData($categoryId):  ? CategoryTreeInterface
    {
        try {
            $getSubCategory = $this->categoryManagement->getTree($categoryId);
        } catch (NoSuchEntityException $e) {
            $this->logger->error("Category not found", [$e]);
            $getSubCategory = null;
        }
        return $getSubCategory;
    }
}
