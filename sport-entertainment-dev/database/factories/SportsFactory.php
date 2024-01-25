<?php

namespace Database\Factories;

use App\Enums\StatusEnums;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sports>
 */
class SportsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'is_active' => $this->faker->randomElement([StatusEnums::ACTIVE, StatusEnums::INACTIVE])
        ];
    }
}
