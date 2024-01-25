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

namespace Mageplaza\SizeChart\Model\Api;

use Exception;
use Magento\Framework\Api\Search\SearchCriteriaBuilder;
use Magento\Framework\Api\SearchCriteria\CollectionProcessorInterface;
use Magento\Framework\Api\SearchCriteriaInterface;
use Magento\Framework\Exception\InputException;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Exception\StateException;
use Magento\Framework\Exception\ValidatorException;
use Magento\Store\Model\StoreRepository;
use Mageplaza\SizeChart\Api\Data\RuleSearchResultInterface;
use Mageplaza\SizeChart\Api\Data\RuleSearchResultInterfaceFactory;
use Mageplaza\SizeChart\Api\RuleManagementInterface;
use Mageplaza\SizeChart\Helper\Data as HelperData;
use Mageplaza\SizeChart\Model\Config\Source\DemoTemplate;
use Mageplaza\SizeChart\Model\Config\Source\DisplayType;
use Mageplaza\SizeChart\Model\ResourceModel\Rule as RuleResource;
use Mageplaza\SizeChart\Model\ResourceModel\Rule\CollectionFactory;
use Mageplaza\SizeChart\Model\RuleFactory;

/**
 * Class RuleManagement
 * @package Mageplaza\SizeChart\Model\Api
 */
class RuleManagement implements RuleManagementInterface
{
    /**
     * @var RuleFactory
     */
    protected $ruleFactory;

    /**
     * @var RuleResource
     */
    protected $ruleResource;

    /**
     * @var HelperData
     */
    protected $helperData;

    /**
     * @var CollectionFactory
     */
    protected $collectionFactory;

    /**
     * @var SearchCriteriaBuilder
     */
    protected $searchCriteriaBuilder;

    /**
     * @var CollectionProcessorInterface
     */
    protected $collectionProcessor;

    /**
     * @var RuleManagementInterface
     */
    protected $ruleSearchResultsInterfaceFactory;

    /**
     * @var DemoTemplate
     */
    protected $demoTemplates;

    /**
     * @var DisplayType
     */
    protected $displayType;

    /**
     * @var StoreRepository
     */
    protected $store;

    /**
     * RuleManagement constructor.
     *
     * @param RuleFactory $ruleFactory
     * @param RuleResource $ruleResource
     * @param HelperData $helperData
     * @param CollectionFactory $collectionFactory
     * @param SearchCriteriaBuilder $searchCriteriaBuilder
     * @param CollectionProcessorInterface $collectionProcessor
     * @param RuleSearchResultInterfaceFactory $ruleSearchResultsInterfaceFactory
     * @param DemoTemplate $demoTemplates
     * @param DisplayType $displayType
     * @param StoreRepository $store
     */
    public function __construct(
        RuleFactory $ruleFactory,
        RuleResource $ruleResource,
        HelperData $helperData,
        CollectionFactory $collectionFactory,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        CollectionProcessorInterface $collectionProcessor,
        RuleSearchResultInterfaceFactory $ruleSearchResultsInterfaceFactory,
        DemoTemplate $demoTemplates,
        DisplayType $displayType,
        StoreRepository $store
    ) {
        $this->ruleFactory = $ruleFactory;
        $this->ruleResource = $ruleResource;
        $this->helperData = $helperData;
        $this->collectionFactory = $collectionFactory;
        $this->searchCriteriaBuilder = $searchCriteriaBuilder;
        $this->collectionProcessor = $collectionProcessor;
        $this->ruleSearchResultsInterfaceFactory = $ruleSearchResultsInterfaceFactory;
        $this->demoTemplates = $demoTemplates;
        $this->displayType = $displayType;
        $this->store = $store;
    }

    /**
     * @inheritdoc
     * @throws StateException
     * @throws NoSuchEntityException
     * @throws LocalizedException
     */
    public function deleteRule($id)
    {
        if (!$this->helperData->isEnabled()) {
            throw new LocalizedException(__('Module is disabled.'));
        }

        $ruleModel = $this->ruleFactory->create();
        $this->ruleResource->load($ruleModel, $id);

        if (!$ruleModel->getId()) {
            throw new NoSuchEntityException(__('The %1 rule doesn\'t exist.', $id));
        }

        try {
            $this->ruleResource->delete($ruleModel);
        } catch (Exception $e) {
            throw new StateException(__('The rule can\'t be delete.'));
        }

        return true;
    }

    /**
     * @inheritdoc
     * @throws ValidatorException
     * @throws LocalizedException
     */
    public function addRule($rules)
    {
        if (!$this->helperData->isEnabled()) {
            throw new LocalizedException(__('Module is disabled.'));
        }

        if ($rules->getRuleId()) {
            $ruleModel = $this->getRuleById($rules->getRuleId());
        } else {
            $ruleModel = $this->ruleFactory->create();
        }

        $ruleData = $rules->getData();
        $requiredField = ['name', 'store_ids', 'priority', 'rule_content', 'attribute_code'];
        $missing = [];

        foreach ($requiredField as $key) {
            if (!array_key_exists($key, $ruleData) || !isset($ruleData[$key])) {
                $missing[] = $key;
            }

            if ($key === 'priority' && $ruleData[$key] !== '0' && ((int)$ruleData[$key]) <= 0) {
                throw new InputException(__('%1 should be a number and greater than 0.', $key));
            }
        }

        if ($missing) {
            throw new ValidatorException(__('%1 is required.', implode(',', $missing)));
        }

        $this->checkStore($ruleData['store_ids']);

        if (isset($ruleData['enabled']) && !in_array($ruleData['enabled'], [0, 1], true)) {
            throw new InputException(__('"enabled" should be 0 or 1.'));
        }

        if (isset($ruleData['demo_templates'])) {
            $this->checkDemoTemplates($ruleData['demo_templates']);
        }

        if (isset($ruleData['display_type'])) {
            $this->checkDisplayType($ruleData['display_type']);
        }

        $ruleModel->addData($ruleData);

        try {
            $this->ruleResource->save($ruleModel);
        } catch (Exception $e) {
            throw new StateException(__('The rule can\'t be saved.'));
        }

        return $ruleModel;
    }

    /**
     * @inheritdoc
     * @throws NoSuchEntityException
     */
    public function getRuleById($id)
    {
        $ruleModel = $this->ruleFactory->create();
        $this->ruleResource->load($ruleModel, $id);

        if (!$ruleModel->getId()) {
            throw new NoSuchEntityException(
                __('The rule that was requested doesn\'t exist. Verify the rule and try again.')
            );
        }

        return $ruleModel;
    }

    /**
     * @inheritdoc
     * @throws LocalizedException
     */
    public function getList(SearchCriteriaInterface $searchCriteria = null)
    {
        if (!$this->helperData->isEnabled()) {
            throw new LocalizedException(__('Module is disabled.'));
        }

        $ruleCollection = $this->collectionFactory->create();

        if ($searchCriteria === null) {
            $searchCriteria = $this->searchCriteriaBuilder->create();
        } else {
            $this->collectionProcessor->process($searchCriteria, $ruleCollection);
        }

        /** @var RuleSearchResultInterface $searchResult */
        $searchResult = $this->ruleSearchResultsInterfaceFactory->create();
        $searchResult->setItems($ruleCollection->getItems());
        $searchResult->setTotalCount($ruleCollection->getSize());
        $searchResult->setSearchCriteria($searchCriteria);

        return $searchResult;
    }

    /**
     * @param string $store
     *
     * @return bool
     * @throws LocalizedException
     */
    public function checkStore($store)
    {
        $stores = explode(',', $store);

        foreach ($stores as $item) {
            if ($item === '0') {
                continue;
            }

            $this->store->getById($item);
        }

        return true;
    }

    /**
     * @param string $demo
     *
     * @return bool
     * @throws InputException
     */
    public function checkDemoTemplates($demo)
    {
        $arr = $this->demoTemplates->toArray();

        if (!isset($arr[$demo])) {
            throw new InputException(__('demo_templates is invalid.'));
        }

        return true;
    }

    /**
     * @param string $types
     *
     * @return bool
     * @throws InputException
     */
    public function checkDisplayType($types)
    {
        $arr = $this->displayType->toArray();
        $data = explode(',', $types);

        foreach ($data as $item) {
            if (!isset($arr[$item])) {
                throw new InputException(__('display_type is invalid.'));
            }
        }

        return true;
    }
}
