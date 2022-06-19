import useSWRImmutable from 'swr/immutable'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

const iconSearcher = url => axios.post(url).then(res => res.data)
const categoriesSearcher = url => axios.get(url).then(res => res.data.split(','))
const debouncedIconSearcher = AwesomeDebouncePromise(iconSearcher, 1000)

export function useIconSearch(query) {
  const params = new URLSearchParams(query)

  const { data, error } = useSWRImmutable(query && query.value ? `/api/search?${params.toString()}` : undefined, debouncedIconSearcher)
  return {
    icons: data,
    isLoading: !error && !data && query.value,
    isError: error
  }
}

export function useCategories() {
  const { data, error } = useSWRImmutable(`/api/categories`, categoriesSearcher)
  return {
    categories: data,
    isCategoriesLoading: !error && !data,
    isCategoriesError: error
  }
}
