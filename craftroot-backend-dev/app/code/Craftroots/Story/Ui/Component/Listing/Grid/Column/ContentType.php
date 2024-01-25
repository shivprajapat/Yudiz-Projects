<?php

namespace Craftroots\Story\Ui\Component\Listing\Column;

class ContentType implements \Magento\Framework\Option\ArrayInterface
{
    /**
     * Options getter
     *
     * @return array
     */
    public function toOptionArray()
    {
        return [
            ['value' => 0, 'label' => __('Video')],
            ['value' => 1, 'label' => __('Full Image')],
            ['value' => 2, 'label' => __('Left Image & Right Description')],
            ['value' => 3, 'label' => __('Right Image & Left Description')]
        ];
    }
}