import { render, screen } from '@testing-library/react';
import CreatePool from '../../src/components/CreatePool';
import { ChakraProvider } from '@chakra-ui/react';

describe('CreatePool', () => {
  it('renders create pool form', () => {
    render(
      <ChakraProvider>
        <CreatePool />
      </ChakraProvider>
    );
    expect(screen.getByText('Create Pool')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ERC20 Token Address')).toBeInTheDocument();
  });
});
