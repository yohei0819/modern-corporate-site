FROM php:8.3-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www/backend

# Copy composer files first for caching
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copy application
COPY backend/ .

# Generate autoloader
RUN composer dump-autoload --optimize

# Permissions
RUN chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
