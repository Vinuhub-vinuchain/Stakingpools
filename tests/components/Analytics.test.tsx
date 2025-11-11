import { render, screen } from '@testing-library/react';
import Analytics from '../../src/components/Analytics';
import { ChakraProvider } from '@chakra-ui/react';

describe('Analytics', () => {
  it('renders analytics cards', () => {
    render(
      <ChakraProvider>
        <Analytics />
      </ChakraProvider>
    );
    expect(screen.getByText('Advanced Staking Analytics')).toBeInTheDocument();
    expect(screen.getByText('Total TVL')).toBeInTheDocument();
    expect(screen.getByText('Average APR')).toBeInTheDocument();
    expect(screen.getByText('Total Stakers')).toBeInTheDocument();
  });
});
