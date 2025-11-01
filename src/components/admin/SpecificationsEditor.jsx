import { useEffect, useState } from 'react';

const SpecificationsEditor = ({ specifications = [], onChange }) => {
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    setSpecs(specifications);
  }, [specifications]);

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    onChange(newSpecs);
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = specs.map((spec, i) => {
      if (i === index) {
        return { ...spec, [field]: value };
      }
      return spec;
    });
    setSpecs(newSpecs);
    onChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Specifications</h3>
        <button
          type="button"
          onClick={handleAddSpec}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Specification
        </button>
      </div>
      
      {specs.map((spec, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1">
            <input
              type="text"
              value={spec.key}
              onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
              placeholder="Key (e.g., Material)"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={spec.value}
              onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
              placeholder="Value (e.g., Stainless Steel)"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveSpec(index)}
            className="px-2 py-1 text-sm text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default SpecificationsEditor;