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
          w-full px-4 py-2 text-left bg-white border border-neutral-200 rounded-lg 
          focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none
          transition-colors duration-200 flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-neutral-300 cursor-pointer'}
          ${isOpen ? 'border-blue-400 ring-2 ring-blue-100' : ''}
        `}
      >
        <span className={`block truncate ${value ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {selectedLabel}
        </span>
        <ChevronDown 
          size={16} 
          className={`ml-2 transition-transform duration-200 text-neutral-400 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`
                px-4 py-2 cursor-pointer transition-colors duration-150
                flex items-center justify-between
                ${value === option.value 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-neutral-900 hover:bg-neutral-50'
                }
                ${option === options[0] ? 'rounded-t-lg' : ''}
                ${option === options[options.length - 1] ? 'rounded-b-lg' : ''}
              `}
            >
              <span className="block truncate">{option.label}</span>
              {value === option.value && (
                <Check size={16} className="text-blue-600 ml-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
