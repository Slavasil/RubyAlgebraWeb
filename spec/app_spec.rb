require 'spec_helper'
require 'rack/test'
require_relative '../app' 

RSpec.describe 'RubyAlgebra API' do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  it 'returns normalized polynomial via POST /normalize' do
    header "Host", "localhost"
    post '/normalize', { polynomial: 'x^2 + 5x' }.to_json, { 'CONTENT_TYPE' => 'application/json' }
    expect(last_response).to be_ok
    response = JSON.parse(last_response.body)
    expect(response['success']).to be true
    expect(response['result']).to eq('x^2 + 5x')
  end
end