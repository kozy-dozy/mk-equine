import ApiService from './ApiService'

export type HomeCategoryContent = {
    imageUrl: string
    label: string
    href: string
}

export type SiteContentHome = {
    heroImageUrl: string
    categories: HomeCategoryContent[]
}

export type GetSiteContentAdminResponse = {
    home: SiteContentHome
}

export type HomeCategory = {
    imageUrl: string
    label: string
    href: string
}

export type HomeContent = {
    heroImageUrl: string
    categories: HomeCategory[]
}

export type GetHomeContentResponse = {
    home: HomeContent
}

export async function apiGetSiteContentAdmin<
    T = GetSiteContentAdminResponse,
>() {
    return ApiService.fetchData<T>({
        url: '/site-content/admin',
        method: 'GET',
    })
}

export async function apiUpdateHomeHero<T = { heroImageUrl: string }>(data: {
    heroImageUrl: string
}) {
    return ApiService.fetchData<T, typeof data>({
        url: '/site-content/admin/home-hero',
        method: 'PUT',
        data,
    })
}

export async function apiUpdateHomeCategories<
    T = { categories: HomeCategoryContent[] },
>(data: { categories: HomeCategoryContent[] }) {
    return ApiService.fetchData<T, typeof data>({
        url: '/site-content/admin/home-categories',
        method: 'PUT',
        data,
    })
}

export async function apiGetHomeContent<T = GetHomeContentResponse>() {
    return ApiService.fetchData<T>({
        url: '/site-content/home',
        method: 'GET',
    })
}
