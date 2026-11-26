import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const items = [
  { id: 'a', label: 'Description', content: 'Description panel' },
  { id: 'b', label: 'Specifications', content: 'Specs panel' },
  { id: 'c', label: 'Warranty', content: 'Warranty panel' },
];

describe('Tabs', () => {
  it('switches panels on click and with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Product information" items={items} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Description panel');

    await user.click(screen.getByRole('tab', { name: 'Specifications' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Specs panel');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Warranty' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Warranty panel');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Description' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
