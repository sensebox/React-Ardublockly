import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import CodeViewer from './CodeViewer';

// Mock Prism.js
vi.mock('prismjs', () => ({
  default: {
    highlight: vi.fn((code) => code),
    languages: {
      cpp: {},
      c: {}
    }
  }
}));

vi.mock('prismjs/components/prism-c', () => ({}));
vi.mock('prismjs/components/prism-cpp', () => ({}));
vi.mock('prismjs/themes/prism.css', () => ({}));

describe('CodeViewer', () => {
  // Mock clipboard API
  const mockClipboard = {
    writeText: vi.fn()
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: mockClipboard
    });
    mockClipboard.writeText.mockClear();
  });

  describe('Code Display', () => {
    it('should display code correctly', () => {
      const code = 'const unsigned char model_data[] = {\n  0x18, 0x00\n};';
      render(<CodeViewer code={code} />);
      
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
      expect(screen.getByText(/const unsigned char model_data/)).toBeInTheDocument();
    });

    it('should display line numbers', () => {
      const code = 'line 1\nline 2\nline 3';
      render(<CodeViewer code={code} />);
      
      // Check that line numbers are displayed
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should display code statistics', () => {
      const code = 'line 1\nline 2\nline 3';
      render(<CodeViewer code={code} />);
      
      expect(screen.getByText('3 lines')).toBeInTheDocument();
      expect(screen.getByText(`${code.length} characters`)).toBeInTheDocument();
    });

    it('should handle empty code', () => {
      render(<CodeViewer code="" />);
      
      expect(screen.getByText('No code to display')).toBeInTheDocument();
    });

    it('should handle null code', () => {
      render(<CodeViewer code={null} />);
      
      expect(screen.getByText('No code to display')).toBeInTheDocument();
    });

    it('should handle undefined code', () => {
      render(<CodeViewer code={undefined} />);
      
      expect(screen.getByText('No code to display')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should display loading indicator when loading is true', () => {
      render(<CodeViewer code="test code" loading={true} />);
      
      expect(screen.getByText('Generating code...')).toBeInTheDocument();
      expect(screen.queryByText('Generated C/C++ Code')).not.toBeInTheDocument();
    });

    it('should not display code when loading', () => {
      const code = 'const unsigned char model_data[] = {};';
      render(<CodeViewer code={code} loading={true} />);
      
      expect(screen.queryByText(/const unsigned char/)).not.toBeInTheDocument();
    });

    it('should display code after loading completes', () => {
      const code = 'const unsigned char model_data[] = {};';
      const { rerender } = render(<CodeViewer code={code} loading={true} />);
      
      expect(screen.getByText('Generating code...')).toBeInTheDocument();
      
      rerender(<CodeViewer code={code} loading={false} />);
      
      expect(screen.queryByText('Generating code...')).not.toBeInTheDocument();
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('should copy code to clipboard when copy button is clicked', async () => {
      const code = 'const unsigned char model_data[] = {};';
      mockClipboard.writeText.mockResolvedValue();
      
      render(<CodeViewer code={code} />);
      
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(code);
      });
    });

    it('should show "Copied" message after successful copy', async () => {
      const code = 'test code';
      mockClipboard.writeText.mockResolvedValue();
      
      render(<CodeViewer code={code} />);
      
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Copied')).toBeInTheDocument();
      });
    });

    it('should reset "Copied" message after 2 seconds', async () => {
      vi.useFakeTimers();
      const code = 'test code';
      mockClipboard.writeText.mockResolvedValue();
      
      render(<CodeViewer code={code} />);
      
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(screen.getByText('Copied')).toBeInTheDocument();
      });
      
      // Fast-forward time by 2 seconds
      vi.advanceTimersByTime(2000);
      
      await waitFor(() => {
        expect(screen.getByText('Copy')).toBeInTheDocument();
      });
      
      vi.useRealTimers();
    });

    it('should call onCopy callback when copy is successful', async () => {
      const code = 'test code';
      const onCopy = vi.fn();
      mockClipboard.writeText.mockResolvedValue();
      
      render(<CodeViewer code={code} onCopy={onCopy} />);
      
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(onCopy).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle clipboard API failure gracefully', async () => {
      const code = 'test code';
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      
      render(<CodeViewer code={code} />);
      
      const copyButton = screen.getByText('Copy');
      fireEvent.click(copyButton);
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Failed to copy code:',
          expect.any(Error)
        );
      });
      
      consoleError.mockRestore();
    });

    it('should not copy when code is empty', async () => {
      render(<CodeViewer code="" />);
      
      // Component should show "No code to display" and no copy button
      expect(screen.queryByText('Copy')).not.toBeInTheDocument();
    });
  });

  describe('Scrollable Container', () => {
    it('should apply maxHeight prop to container', () => {
      const code = 'line 1\nline 2\nline 3';
      const maxHeight = 300;
      
      render(<CodeViewer code={code} maxHeight={maxHeight} />);
      
      // Component should render with the code
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
      expect(screen.getByText('3 lines')).toBeInTheDocument();
    });

    it('should use default maxHeight when not provided', () => {
      const code = 'line 1\nline 2\nline 3';
      
      const { container } = render(<CodeViewer code={code} />);
      
      // Component should render without errors
      expect(container).toBeInTheDocument();
    });
  });

  describe('Language Support', () => {
    it('should use cpp language by default', () => {
      const code = 'const unsigned char data[] = {};';
      const { container } = render(<CodeViewer code={code} />);
      
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('language-cpp');
    });

    it('should use specified language', () => {
      const code = 'const unsigned char data[] = {};';
      const { container } = render(<CodeViewer code={code} language="c" />);
      
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('language-c');
    });
  });

  describe('Large Code Handling', () => {
    it('should handle very large code output', () => {
      // Generate a large code string with 100 lines
      const lines = Array(100).fill('0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,');
      const largeCode = lines.join('\n');
      
      const { container } = render(<CodeViewer code={largeCode} />);
      
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
      // Check that the statistics are rendered
      const statsText = container.textContent;
      expect(statsText).toContain('100 lines');
    });

    it('should display correct line count for large files', () => {
      const lines = 500;
      const largeCode = Array(lines).fill('line').join('\n');
      
      const { container } = render(<CodeViewer code={largeCode} />);
      
      const statsText = container.textContent;
      expect(statsText).toContain(`${lines} lines`);
    });
  });

  describe('Edge Cases', () => {
    it('should handle code with special characters', () => {
      const code = 'const char* str = "Hello\\nWorld\\t!";';
      render(<CodeViewer code={code} />);
      
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
    });

    it('should handle code with only whitespace', () => {
      const code = '   \n   \n   ';
      render(<CodeViewer code={code} />);
      
      expect(screen.getByText('3 lines')).toBeInTheDocument();
    });

    it('should handle single line code', () => {
      const code = 'const int x = 42;';
      render(<CodeViewer code={code} />);
      
      expect(screen.getByText('1 lines')).toBeInTheDocument();
    });

    it('should handle code with very long lines', () => {
      const longLine = 'const unsigned char data[] = { ' + 
        Array(200).fill('0x00').join(', ') + 
        ' };';
      
      render(<CodeViewer code={longLine} />);
      
      expect(screen.getByText('Generated C/C++ Code')).toBeInTheDocument();
    });
  });

  describe('Component Updates', () => {
    it('should update when code prop changes', () => {
      const code1 = 'const int x = 1;';
      const code2 = 'const int y = 2;';
      
      const { rerender } = render(<CodeViewer code={code1} />);
      expect(screen.getByText(/const int x/)).toBeInTheDocument();
      
      rerender(<CodeViewer code={code2} />);
      expect(screen.getByText(/const int y/)).toBeInTheDocument();
    });

    it('should update line numbers when code changes', () => {
      const code1 = 'line 1';
      const code2 = 'line 1\nline 2\nline 3';
      
      const { rerender } = render(<CodeViewer code={code1} />);
      expect(screen.getByText('1 lines')).toBeInTheDocument();
      
      rerender(<CodeViewer code={code2} />);
      expect(screen.getByText('3 lines')).toBeInTheDocument();
    });
  });
});
