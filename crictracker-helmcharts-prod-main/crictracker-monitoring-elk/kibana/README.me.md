Deploy this Helm repo with 7.17 Version for Elastic Kibana and logstash version.


Here is  the command for helm install and upgrade 

helm install  kibana kibana/  -f kibana/values.yaml -n logging

helm upgrade  kibana kibana/  -f kibana/values.yaml -n logging


Ingress is not configured with values.yaml, because kibana provides is nginx class ingress, where we want to work with alb controller ingress. 
