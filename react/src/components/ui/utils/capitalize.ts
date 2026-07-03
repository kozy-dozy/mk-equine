export default function capitalize(input: string) {
    return input
        .toLowerCase()
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
}
