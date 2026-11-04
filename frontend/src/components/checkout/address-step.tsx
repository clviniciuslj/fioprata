"use client";

import { useState, type FormEvent } from "react";
import { isUF, type Address } from "@/lib/api/contract";
import { formatPostalCode } from "@/lib/format";
import { UF_OPTIONS } from "@/lib/uf-names";
import { validateAddress } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/field";

export type AddressDraft = Omit<Address, "state"> & { state: Address["state"] | "" };

export function emptyAddress(recipient = "", state: Address["state"] | "" = ""): AddressDraft {
  return { recipient, postalCode: "", street: "", number: "", complement: "", district: "", city: "", state };
}

interface Props {
  initial: AddressDraft;
  onSubmit: (address: Address) => void;
}

export function AddressStep({ initial, onSubmit }: Props) {
  const [draft, setDraft] = useState<AddressDraft>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const field = (name: keyof AddressDraft) => ({
    name,
    value: draft[name] ?? "",
    error: errors[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, [name]: e.target.value })),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const address = { ...draft, state: draft.state } as Address;
    const found = validateAddress(address);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(address);
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-6">
      <TextField label="Quem vai receber" autoComplete="name" className="sm:col-span-6" {...field("recipient")} />
      <TextField
        label="CEP"
        inputMode="numeric"
        autoComplete="postal-code"
        placeholder="00000-000"
        className="sm:col-span-2"
        name="postalCode"
        value={formatPostalCode(draft.postalCode)}
        error={errors.postalCode}
        onChange={(e) => setDraft((d) => ({ ...d, postalCode: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
      />
      <TextField label="Rua" autoComplete="address-line1" className="sm:col-span-4" {...field("street")} />
      <TextField label="Número" className="sm:col-span-2" {...field("number")} />
      <TextField label="Complemento (opcional)" autoComplete="address-line2" className="sm:col-span-4" {...field("complement")} />
      <TextField label="Bairro" className="sm:col-span-3" {...field("district")} />
      <TextField label="Cidade" autoComplete="address-level2" className="sm:col-span-3" {...field("city")} />
      <SelectField
        label="Estado"
        className="sm:col-span-3"
        name="state"
        value={draft.state}
        error={errors.state}
        onChange={(e) => setDraft((d) => ({ ...d, state: isUF(e.target.value) ? e.target.value : "" }))}
      >
        <option value="">Escolha o estado</option>
        {UF_OPTIONS.map(([uf, name]) => (
          <option key={uf} value={uf}>
            {name}
          </option>
        ))}
      </SelectField>
      <div className="sm:col-span-6">
        <Button type="submit" size="lg">
          Continuar para a revisão
        </Button>
      </div>
    </form>
  );
}
