import { useEffect, useRef } from 'react';
import AutoNumeric from 'autonumeric';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

interface VndInputProps {
    name: string;
    control: Control<any>;
    label?: string;
}

export default function VndInput({ name, control }: VndInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const anRef = useRef<AutoNumeric | null>(null);

    // Lắng nghe giá trị từ react-hook-form (DB set vào)
    const value = useWatch({ control, name });

    useEffect(() => {
        if (!inputRef.current) return;

        anRef.current = new AutoNumeric(inputRef.current, {
            digitGroupSeparator: '.',
            decimalCharacter: ',',
            decimalPlaces: 0,
            currencySymbolPlacement: 's',
        });

        return () => {
            anRef.current?.remove();
        };
    }, []);
    useEffect(() => {
        if (anRef.current && typeof value === 'number') {
            anRef.current.set(value);
        }
    }, [value]);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div>
                    <input
                        ref={inputRef}
                        type="text"
                        onInput={() => {
                            if (!anRef.current) return;
                            field.onChange(anRef.current.getNumber());
                        }}
                        className="border px-3 py-2 rounded w-full mt-1"
                    />

                    {fieldState.error && (
                        <p className="text-red-500 text-sm">{fieldState.error.message}</p>
                    )}
                </div>
            )}
        />
    );
}
