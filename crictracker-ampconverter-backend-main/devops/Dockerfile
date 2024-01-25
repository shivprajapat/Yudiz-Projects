FROM php:8.0.23-apache

RUN apt update && apt install git zip -y 
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer

COPY . /var/www/html/

RUN composer update

EXPOSE 80

CMD apachectl -D FOREGROUND
