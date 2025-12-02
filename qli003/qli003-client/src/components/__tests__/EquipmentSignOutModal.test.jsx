import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquipmentCheckOutModal from '../modals/EquipmentCheckOutModal';

const equipmentList = [
  { ID: 1, Name: 'Widget A', Item_Cnt: 3 },
  { ID: 2, Name: 'Widget B', Item_Cnt: 0 }
];

describe('EquipmentSignOutModal', () => {
  beforeEach(() => {
    // reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('requires a name before allowing selection or sign out', async () => {
    const onClose = jest.fn();
    const onSignOut = jest.fn();

    render(
      <EquipmentCheckOutModal
        selectedEquipment={equipmentList[0]}
        isOpen={true}
        onClose={onClose}
        onSignOut={onSignOut}
        API_URL="http://localhost:5097/api/Equipment"
      />
    );

    // Name input should be present and initially empty
    const nameInput = screen.getByPlaceholderText(/Enter your full name/i);
    expect(nameInput).toBeInTheDocument();

  // Quantity input should be present and reflect available stock
  // number inputs have role "spinbutton" so query by role which works even
  // if the label isn't properly associated in markup
  const qty = screen.getByRole('spinbutton');
  expect(qty).toBeInTheDocument();

  // Submit button should be disabled until name is provided
  const submitBtn = screen.getByRole('button', { name: /Check Out/i });
  expect(submitBtn).toBeDisabled();

    // Enter name to enable submit
    await userEvent.type(nameInput, 'Alice');
    expect(submitBtn).not.toBeDisabled();

    // Mock fetch responses: first POST for transaction, then PUT for equipment update
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true });

    // Submit the form
    await userEvent.click(submitBtn);

  // Wait for success message
  await waitFor(() => expect(screen.getByText(/successfully signed out/i)).toBeInTheDocument());

  // The component calls onSignOut after a short timeout (1500ms), so wait
  await waitFor(() => expect(onSignOut).toHaveBeenCalled(), { timeout: 2500 });

  });
});
