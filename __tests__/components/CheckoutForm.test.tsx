import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

describe('CheckoutForm', () => {
  it('renders all fields', () => {
    render(<CheckoutForm onSubmit={jest.fn()} isLoading={false} />)
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/0241234567/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/delivery/i)).toBeInTheDocument()
  })

  it('calls onSubmit with form values', () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} isLoading={false} />)
    fireEvent.change(screen.getByPlaceholderText(/your name/i), {
      target: { value: 'Kwame' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /order via whatsapp/i }).closest('form')!)
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ customer_name: 'Kwame' })
    )
  })

  it('shows loading state', () => {
    render(<CheckoutForm onSubmit={jest.fn()} isLoading={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText(/creating order/i)).toBeInTheDocument()
  })
})
