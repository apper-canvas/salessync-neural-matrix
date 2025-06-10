import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, id, type = 'text', children, className, required, as: Component = 'input', ...props }) => {
    let RenderedComponent;
    if (Component === 'input') {
        RenderedComponent = Input;
    } else if (Component === 'select') {
        RenderedComponent = Select;
    } else if (Component === 'textarea') {
        RenderedComponent = Textarea;
    } else {
        RenderedComponent = Component; // Allow custom components
    }

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1">
                {label} {required && '*'}
            </label>
            <RenderedComponent id={id} type={type} required={required} {...props}>
                {children}
            </RenderedComponent>
        </div>
    );
};

export default FormField;