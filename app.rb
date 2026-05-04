require 'sinatra'
require 'json'
require 'ruby_algebra'

set :host_authorization, { permitted_hosts: ["localhost", "127.0.0.1", "ruby.slavasil.ru"] }

before do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*', 
          'Access-Control-Allow-Methods' => ['POST', 'GET', 'OPTIONS'],
          'Access-Control-Allow-Headers' => 'Content-Type'
end

options '*' do
  200
end

helpers do
  def parse_poly(string)
    RubyAlgebra::Parser.parse_polynomial(RubyAlgebra::Parser::Tokenizer.new(string))
  end
end

# 1. Нормализация (парсинг и возврат строки)
post '/normalize' do
  data = JSON.parse(request.body.read)
  poly = parse_poly(data['polynomial'])
  { success: true, result: poly.to_s }.to_json
rescue => e
  { success: false, error: e.message }.to_json
end

# 2. Дифференцирование
post '/differentiate' do
  data = JSON.parse(request.body.read)
  poly = parse_poly(data['polynomial'])
  # В твоем файле polynomial.rb метод называется .diff
  result = poly.diff(data['variable'])
  { success: true, result: result.to_s }.to_json
rescue => e
  { success: false, error: e.message }.to_json
end

# 3. Сложение
post '/add' do
  data = JSON.parse(request.body.read)
  polys = data['terms'].map { |t| parse_poly(t) }
  result = polys.reduce(:+)
  { success: true, result: result.to_s }.to_json
rescue => e
  { success: false, error: e.message }.to_json
end

# 4. Вычитание
post '/subtract' do
  data = JSON.parse(request.body.read)
  p1 = parse_poly(data['minuend'])
  p2 = parse_poly(data['subtrahend'])
  result = p1 - p2
  { success: true, result: result.to_s }.to_json
rescue => e
  { success: false, error: e.message }.to_json
end

# 5. Умножение
post '/multiply' do
  data = JSON.parse(request.body.read)
  factors = data['factors'].map { |f| parse_poly(f) }
  result = factors.reduce(:*)
  { success: true, result: result.to_s }.to_json
rescue => e
  { success: false, error: e.message }.to_json
end
