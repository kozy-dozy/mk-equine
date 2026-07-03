export function getExtensionFromFile(file: File) {
    const nameExt = file.name.split('.').pop()
    if (nameExt && nameExt.length <= 5) return nameExt.toLowerCase()
    if (file.type === 'image/png') return 'png'
    if (file.type === 'image/jpeg') return 'jpg'
    return 'bin'
}

export function getFirstFileFromUploadArg(arg: any): File | null {
    if (!arg) return null
    if (Array.isArray(arg) && arg[0] instanceof File) return arg[0]
    if (Array.isArray(arg.files) && arg.files[0] instanceof File)
        return arg.files[0]
    if (arg.file instanceof File) return arg.file
    const maybe = arg?.target?.files?.[0]
    if (maybe instanceof File) return maybe
    return null
}
