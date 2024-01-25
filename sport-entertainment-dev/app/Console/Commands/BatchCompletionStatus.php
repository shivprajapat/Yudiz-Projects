<?php

namespace App\Console\Commands;

use App\Models\Batch;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class BatchCompletionStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:batch-completion-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'When the batch end date is over then the batch is automatically completed.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $batches = Batch::where('completion_status', '=', '0')->get();
        if ($batches->isNotEmpty()) {
            foreach ($batches as  $batch) {
                // Log::channel("custom_log")->info($batch->end_date);
                if ($batch->end_date <= Carbon::now()->format("d/m/Y")) {
                    $batch->update(["completion_status" => "1"]);
                    // Log::channel("custom_log")->info("update");
                }
            }
        }
    }
}
