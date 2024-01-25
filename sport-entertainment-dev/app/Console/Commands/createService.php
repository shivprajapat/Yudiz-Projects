<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class createService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:service {serviceName}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'create own services class';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // dd($this->arguments()); //taking the arguments
        $className = $this->arguments()['serviceName'];
        if ($className === '' || is_null($className) || empty($className)) {
            $this->error('Please enter service name after make:service!');
        }

        File::exists(app_path("Http/Services")) ? true : File::makeDirectory(app_path("Http/Services"));
        if (file_exists(app_path("Http/Services"))) {

            $appPath = app_path("Http/Services");
            $phpFileName = $className . ".php";
            $fullPath  =  $appPath . "/" . $phpFileName;

            if (!file_exists($fullPath)) {
                $createdFileName = "<?php\n\nnamespace App\\Http\\Services; \n\nclass " . $className . "\n{\n\n}";
                file_put_contents($fullPath, $createdFileName);
                $this->info('Services Files Created Successfully.');
            } else {
                $this->error('Services Files Already Exists Please Try Using Another File.');
            }
        } else {
            $this->error('Services Folder Is Not Created.');
        }
    }
}
