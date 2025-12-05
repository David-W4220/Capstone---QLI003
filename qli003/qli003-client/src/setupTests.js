// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide a lightweight mock for react-modal so tests run without the package
// This mock exposes a default functional component that renders children
// when `isOpen` is truthy, and a noop `setAppElement` function so imports
// that call Modal.setAppElement(...) do not fail.
jest.mock('react-modal', () => {
	const React = require('react');
	function MockModal({ children, isOpen }) {
		return isOpen ? React.createElement('div', { 'data-testid': 'mock-modal' }, children) : null;
	}
	MockModal.setAppElement = () => {};
	return MockModal;
});
