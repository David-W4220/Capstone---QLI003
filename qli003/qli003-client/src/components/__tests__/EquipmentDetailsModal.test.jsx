import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentDetailsModal from '../modals/EquipmentDetailsModal';

const sampleEquipment = {
  ID: 1,
  Name: 'Test Widget',
  Description: 'This is a test widget.',
  Item_Cnt: 5,
  Threshold: 2,
  Alpha_Loc: 'A1',
  ReodrLk_Pri_Qty: 'http://example.com',
  BuyQty: '10'
};

describe('EquipmentDetailsModal', () => {
  test('renders equipment details when open and calls onClose', () => {
    const onClose = jest.fn();

    render(<EquipmentDetailsModal equipment={sampleEquipment} isOpen={true} onClose={onClose} />);

    // Title and fields
    expect(screen.getByText(/Test Widget/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test widget\./)).toBeInTheDocument();
    expect(screen.getByText(/Current Stock/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText(/Location/)).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();

  // Close button exists (uses multiplication sign '×' in markup)
  const closeBtn = screen.getByText('×');
  fireEvent.click(closeBtn);
  expect(onClose).toHaveBeenCalled();
  });

  test('does not render when equipment is null', () => {
    const { container } = render(<EquipmentDetailsModal equipment={null} isOpen={true} onClose={() => {}} />);
    // component returns null when no equipment provided
    expect(container).toBeEmptyDOMElement();
  });
});
