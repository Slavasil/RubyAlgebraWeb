require 'spec_helper'
require 'ruby_algebra'

RSpec.describe RubyAlgebra::Polynomial do
  it 'correctly converts to string' do
    poly = RubyAlgebra::Parser.parse("x^2 + 2*x + 1")
    expect(poly.to_s).to eq("x^2 + 2x + 1")
  end

  it 'calculates the derivative correctly' do
    poly = RubyAlgebra::Parser.parse("x^2 + 5*x")
    derivative = poly.diff('x')
    expect(derivative.to_s).to eq("2x + 5")
  end
end