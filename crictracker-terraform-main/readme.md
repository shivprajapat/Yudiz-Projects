#Commentted the ALB controller as it is not deploying upto date alb 

- Set ips in file waf_ip_sets.tf
- Create WAF rules mannaually. WAF is created by terraform
- Create alb controller manually


**Development guide**

Initial development
- clone the repository 
- pull the submodules with following command
    ```git submodule update --recursive --init```

If submodules existed previously than simply update
    ```git submodule update```

Note:- Please maintain versions on submodules on every change
