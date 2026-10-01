import type { ParameterDefinition } from '../types';

export function MethodParameters({ definitions, values, onChange, disabled = false }: {
  definitions: ParameterDefinition[]; values: Record<string, string | number | boolean>;
  onChange: (values: Record<string, string | number | boolean>) => void; disabled?: boolean;
}) {
  if (!definitions.length) return null;
  return <fieldset className="method-parameters" disabled={disabled}><legend>Parameters</legend>
    {definitions.map(item => <label key={item.name}>{item.label || item.name}
      {item.type === 'boolean' ? <input type="checkbox" checked={Boolean(values[item.name] ?? item.defaultValue)}
        onChange={event => onChange({ ...values, [item.name]: event.target.checked })} />
        : item.type === 'choice' ? <select required={item.required}
          value={String(values[item.name] ?? item.defaultValue)}
          onChange={event => onChange({ ...values, [item.name]: event.target.value })}>
          {item.choices?.map(choice => <option key={choice}>{choice}</option>)}
        </select> : <input type={item.type === 'number' ? 'number' : 'text'}
          required={item.required}
          value={item.type === 'number' && !Number.isFinite(values[item.name] ?? item.defaultValue) ? '' : String(values[item.name] ?? item.defaultValue)}
          onChange={event => onChange({ ...values, [item.name]: item.type === 'number' ? event.target.value === '' ? NaN : Number(event.target.value) : event.target.value })} />}
    </label>)}
  </fieldset>;
}
