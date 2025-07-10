import React from 'react'

const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input
        className="w-full px-2 py-2.5 border border-gray-500/30 rounded ouline-none text-gray-500 focus:border-primary transition"
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
);

export default InputField;