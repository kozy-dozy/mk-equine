export function onlyNumbers(value: unknown) {
    return String(value ?? '').replace(/\D/g, '')
}

export function formatCardNumberDisplay(value: unknown) {
    return onlyNumbers(value)
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim()
}

export function formatCardNumberValue(value: unknown) {
    return onlyNumbers(value).slice(0, 16)
}

export function formatExp(value: unknown) {
    const digits = onlyNumbers(value).slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function formatCvc(value: unknown) {
    return onlyNumbers(value).slice(0, 4)
}

export function buildCardNumberOnChange(
    fieldName: string,
    setFieldValue: (field: string, value: any) => void,
) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = String(e.target.value ?? '')
        const digits = formatCardNumberValue(raw)
        setFieldValue(fieldName, digits)
    }
}

export function buildExpOnChange(
    fieldName: string,
    setFieldValue: (field: string, value: any) => void,
) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = String(e.target.value ?? '')
        const next = formatExp(raw)
        setFieldValue(fieldName, next)
    }
}

export function buildCvcOnChange(
    fieldName: string,
    setFieldValue: (field: string, value: any) => void,
) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = String(e.target.value ?? '')
        const next = formatCvc(raw)
        setFieldValue(fieldName, next)
    }
}
