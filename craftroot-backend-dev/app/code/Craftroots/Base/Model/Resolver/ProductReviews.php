<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare (strict_types = 1);

namespace Craftroots\Base\Model\Resolver;

use Craftroots\Base\Helper\Data;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Exception\GraphQlNoSuchEntityException;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;
use Magento\Review\Model\Review;

/**
 * CMS page field resolver, used for GraphQL request processing
 */
class ProductReviews implements ResolverInterface
{
    // @codingStandardsIgnoreFile
    private $storeManager;

    private $ratingVoteCollectionFactory;

    private $reviewCollectionFactory;

    private $ratingCollectionFactory;

    private $pwaHelper;

    private $productUrlSuffix;

    private $summaryFactory;

    /**
     * @param StoreManagerInterface $storeManager
     * @param CollectionFactory $reviewCollection
     * @param Collection $ratingVoteCollectionFactory
     * @param \Magento\Review\Model\ResourceModel\Rating\CollectionFactory $ratingCollectionFactory
     * @param \Magento\Review\Model\Review\SummaryFactory $summaryFactory
     */
    public function __construct(
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Review\Model\ResourceModel\Review\Product\CollectionFactory $reviewCollection,
        \Magento\Review\Model\ResourceModel\Rating\Option\Vote\CollectionFactory $ratingVoteCollectionFactory,
        \Magento\Review\Model\ResourceModel\Rating\CollectionFactory $ratingCollectionFactory,
        \Magento\Review\Model\Review\SummaryFactory $summaryFactory,
        Data $pwaHelper
    ) {
        $this->storeManager = $storeManager;
        $this->ratingVoteCollectionFactory = $ratingVoteCollectionFactory;
        $this->reviewCollectionFactory = $reviewCollection;
        $this->ratingCollectionFactory = $ratingCollectionFactory;
        $this->summaryFactory = $summaryFactory;
        $this->pwaHelper = $pwaHelper;
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
        if (isset($args['product_id'])) {
            $productId = $this->getProductId($args);
            $productReviewData = $this->getProductReviewData($productId, $args);

            return $productReviewData;

        } else {
            if (!$context->getUserId()) {
                throw new GraphQlInputException(
                    __("Customer is not authorized.")
                );
            }
            $customerId = $context->getUserId();
            $customerReviewData = $this->getCustomerReviewData($customerId, $args);

            return $customerReviewData;
        }
    }

    /**
     * @param array $args
     * @return int
     * @throws GraphQlInputException
     */
    private function getProductId(array $args): int
    {
        if (!isset($args['product_id'])) {
            throw new GraphQlInputException(__('Product id should be specified'));
        }
        return (int) $args['product_id'];
    }

    /**
     * @return String
     */
    private function getProductUrlSuffix()
    {
        if (!$this->productUrlSuffix) {
            $this->productUrlSuffix = $this->pwaHelper->getStoreConfig('catalog/seo/product_url_suffix');
        }
        return $this->productUrlSuffix;
    }

    /**
     * @param int $customerId
     * @return array
     * @throws GraphQlNoSuchEntityException
     */
    private function getCustomerReviewData(int $customerId, $args): array
    {
        $currentStoreId = $this->storeManager->getStore()->getId();

        $reviewCollection = $this->reviewCollectionFactory->create()
            ->addAttributeToSelect('*')
            ->addStoreFilter($currentStoreId)
            ->addCustomerFilter($customerId)
            ->setDateOrder();
        if (isset($args['current_page']) && $args['limit']) {
            $reviewCollection->setPageSize($args['limit']);
            $reviewCollection->setCurPage($args['current_page']);
        }
        $i = 0;
        $data = [];
        $urlSuffix = $this->getProductUrlSuffix();
        foreach ($reviewCollection as $review) {
            $store = $this->storeManager->getStore();
            $currentDate = date('Y-m-d');
            $reviewDate = date('d-M-Y', strtotime($review->getReviewCreatedAt()));
            $diff = date_diff(date_create($reviewDate), date_create($currentDate));
            // Get the difference in days, weeks, months, and years
            $daysOld = $diff->days;
            $weeksOld = floor($daysOld / 7);
            $monthsOld = $diff->y * 12 + $diff->m;
            $yearsOld = $diff->y;
            $reviewShow = "";
            // Manage the review based on its age
            if ($daysOld == 0) {
                $reviewShow = "Today";
            } elseif ($daysOld <= 6) {
                $reviewShow = "$daysOld day ago";
            } elseif ($weeksOld <= 4) {
                $reviewShow = "$weeksOld week ago";
            } elseif ($monthsOld <= 12) {
                $reviewShow = "$monthsOld month ago";
            } elseif ($yearsOld >= 1) {
                $reviewShow = "$yearsOld year ago";
            }
            $data[$i]['created_at'] = $reviewShow;
            $data[$i]['review'] = $review->getTitle();
            $data[$i]['review_id'] = $review->getReviewId();
            $data[$i]['product_name'] = $review->getName();
            $data[$i]['product_img'] = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $review->getThumbnail();
            $ratingData = $this->ratingVoteCollectionFactory->create()
                ->addFieldToFilter('review_id', $review->getReviewId());
            $ratingCount = (int) $ratingData->getSize();
            $ratingSum = array_sum($ratingData->getColumnValues('percent'));
            $data[$i]['rating'] = round(((int) $ratingSum / (int) $ratingCount), 1);
            $data[$i]['detail'] = $review->getDetail();
            $data[$i]['url_key'] = $review->getUrlKey() . $urlSuffix;
            $data[$i]['status'] = $this->getStatusCode($review->getStatusId());
            $i++;
        }

        return [
            "data" => $data,
            'current_page' => $reviewCollection->getCurPage(),
            'limit' => $reviewCollection->getPageSize(),
            'total_count' => $reviewCollection->getLastPageNumber(),
        ];
    }

    /**
     * @param int $productId
     * @return array
     * @throws GraphQlNoSuchEntityException
     */
    private function getProductReviewData(int $productId, $args): array
    { $store = $this->storeManager->getStore();
        $currentStoreId = $this->storeManager->getStore()->getId();
        $summaryData = $this->summaryFactory->create()->setStoreId($currentStoreId)->load($productId);
        $reviewCollection = $this->reviewCollectionFactory->create()
            ->addAttributeToSelect('*')
            ->addStoreFilter($currentStoreId)
            ->addFieldToFilter('entity_id', $productId)
            ->addStatusFilter(
                Review::STATUS_APPROVED
            )
            ->setDateOrder();
        $offset = isset($args['current_page']) ? $args['current_page'] : 0;
        $curr_page = 1;
        $limit = isset($args['limit']) ? $args['limit'] : 5;
        if ($offset != 'null' && $offset != '') {
            $curr_page = $offset;
        }
        $offset = ($curr_page - 1) * $limit;
        $reviewCollection->getSelect()->limit($limit, $offset);
        $i = 0;
        $count = 0;
        $ratingvalue = 0;
        $urlSuffix = $this->getProductUrlSuffix();
        $data = [];
        $ratingCodes = [];
        $ratingStarsPer = [];
        $ratingCollection = $this->ratingCollectionFactory->create();
        foreach ($ratingCollection as $rating) {
            $ratingCodes[$rating->getId()] = $rating->getRatingCode();
        }
        $starOneCount = 0;
        $startTwoCount = 0;
        $startThreeCount = 0;
        $startFourCount = 0;
        $startFiveCount = 0;
        foreach ($reviewCollection as $review) {
            $count = $count + 1;
            $currentDate = date('Y-m-d');
            $reviewDate = date('d-M-Y', strtotime($review->getReviewCreatedAt()));
            $diff = date_diff(date_create($reviewDate), date_create($currentDate));
            // Get the difference in days, weeks, months, and years
            $daysOld = $diff->days;
            $weeksOld = floor($daysOld / 7);
            $monthsOld = $diff->y * 12 + $diff->m;
            $yearsOld = $diff->y;

            $reviewShow = "";
            // Manage the review based on its age
            if ($daysOld == 0) {
                $reviewShow = "Today";
            } elseif ($daysOld <= 6) {
                $reviewShow = "$daysOld day ago";
            } elseif ($weeksOld <= 4) {
                $reviewShow = "$weeksOld week ago";
            } elseif ($monthsOld <= 12) {
                $reviewShow = "$monthsOld month ago";
            } elseif ($yearsOld >= 1) {
                $reviewShow = "$yearsOld year ago";
            }

            $data[$i]['created_at'] = $reviewShow;
            if ($review->getTitle() != "") {
                $data[$i]['review'] = $review->getTitle();
            }
            // print_r($data[$i]['review'] = $review->getTitle());
            $data[$i]['review_id'] = $review->getReviewId();
            $data[$i]['product_name'] = $review->getName();
            $data[$i]['product_img'] = $store->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA) . 'catalog/product' . $review->getThumbnail();
            $data[$i]['status'] = $this->getStatusCode($review->getStatusId());
            $ratingData = $this->ratingVoteCollectionFactory->create()
                ->addFieldToFilter('review_id', $review->getReviewId());
            $ratingResponse = [];
            foreach ($ratingData as $rating) {
                $ratingResponse[] = [
                    'rating_code' => isset($ratingCodes[$rating->getRatingId()]) ? $ratingCodes[$rating->getRatingId()] : "",
                    'rating_percent' => $rating->getPercent(),
                ];
                if ($rating->getValue() == 1) {
                    $starOneCount++;
                } elseif ($rating->getValue() == 2) {
                    $startTwoCount++;
                } elseif ($rating->getValue() == 3) {
                    $startThreeCount++;
                } elseif ($rating->getValue() == 4) {
                    $startFourCount++;
                } elseif ($rating->getValue() == 5) {
                    $startFiveCount++;
                }
                $ratingStarsPer[1] = $starOneCount > 0 ? $starOneCount : 0;
                $ratingStarsPer[2] = $startTwoCount > 0 ? $startTwoCount : 0;
                $ratingStarsPer[3] = $startThreeCount > 0 ? $startThreeCount : 0;
                $ratingStarsPer[4] = $startFourCount > 0 ? $startFourCount : 0;
                $ratingStarsPer[5] = $startFiveCount > 0 ? $startFiveCount : 0;
            }
            $ratingCount = (int) $ratingData->getSize();
            $ratingSum = array_sum($ratingData->getColumnValues('percent'));
            $data[$i]['rating'] = json_encode($ratingResponse);
            $data[$i]['detail'] = $review->getDetail();
            $data[$i]['nickname'] = $review->getNickname();
            $data[$i]['url_key'] = $review->getUrlKey() . $urlSuffix;
            if ($ratingCount) {
                $ratingvalue = $ratingvalue + round(((int) $ratingSum / (int) $ratingCount), 1);
            }

            $i++;
        }
        return [
            "data" => $data,
            "ratingStarCount" => json_encode($ratingStarsPer),
            "totalRating" => $summaryData->getReviewsCount(),
            "avgRating" => $summaryData->getRatingSummary(),
            "totalStarts" => round(($summaryData->getRatingSummary() / 20), 1),
            "current_page" => (Int) $curr_page,
            "limit" => (Int) $limit,
            'total_count' => round($summaryData->getReviewsCount() / $limit),
        ];
    }

    public function getStatusCode($statusID)
    {
        $status = "";
        if ($statusID) {
            switch ($statusID) {
                case "1":
                    return $status = "Approved";
                    break;
                case "2":
                    return $status = "Pending";
                    break;
                case "3":
                    return $status = "Not Approved";
                    break;
            }
        } else {
            return $status;
        }
    }
}
