import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomDropdown = ({ 
  options = [], 
  value = '', 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef(null);

  // Find selected option label
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value);
    setSelectedLabel(selectedOption ? selectedOption.label : placeholder);
  }, [value, options, placeholder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 text-left bg-white border border-neutral-200 rounded-lg 
          focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none
          transition-all duration-200 flex items-center justify-between
          text-sm font-medium min-h-[42px]
          ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : 'hover:border-neutral-300 cursor-pointer hover:bg-neutral-50'}
          ${isOpen ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm' : 'shadow-sm'}
        `}
      >
        <span className={`block truncate ${
          value && value !== '' ? 'text-neutral-900' : 'text-neutral-500'
        }`}>
          {selectedLabel}
        </span>
        <ChevronDown 
          size={18} 
          className={`ml-2 transition-transform duration-200 text-neutral-500 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`
                px-4 py-3 cursor-pointer transition-colors duration-150
                flex items-center justify-between text-sm
                ${value === option.value 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-neutral-900 hover:bg-neutral-50'
                }
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                ${index < options.length - 1 ? 'border-b border-neutral-100' : ''}
              `}
            >
              <span className="block truncate">{option.label}</span>
              {value === option.value && (
                <Check size={16} className="text-blue-600 ml-2 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
