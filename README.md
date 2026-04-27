# Sinatra RubyAlgebra Project

This is a minimal Sinatra application that uses the ruby_algebra gem.

## Setup

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Run the application:
   ```bash
   bundle exec ruby app.rb
   ```
   or
   ```bash
   bundle exec rackup
   ```

3. Visit http://localhost:4567 in your browser.

## Endpoints

- `GET /` - Returns a greeting message
- `GET /algebra` - Demonstrates usage of the ruby_algebra gem

## Dependencies

- Sinatra
- ruby_algebra (from https://gitea.slavasil.ru/Slavasil/RubyAlgebra.git)
- Puma (web server)
- Rackup
