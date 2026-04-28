require 'ruby_algebra'

def parse_test_expr(str)
  tokenizer = RubyAlgebra::Parser::Tokenizer.new(str)
  RubyAlgebra::Parser.parse_polynomial(tokenizer)
end

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
  config.shared_context_metadata_behavior = :apply_to_host_groups
end
RSpec.describe RubyAlgebra::Polynomial do
  it 'correctly converts to string' do
    poly = parse_test_expr("x^2 + 2*x + 1")
    expect(poly.to_s).to eq("x^2 + 2x + 1")
  end

  it 'calculates the derivative correctly' do
    poly = parse_test_expr("x^2 + 5*x")
    derivative = poly.diff('x')
    expect(derivative.to_s).to eq("2x + 5")
  end
end