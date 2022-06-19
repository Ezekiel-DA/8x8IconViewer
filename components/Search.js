import { Input, InputGroup, InputLeftElement, IconButton } from '@chakra-ui/react'
import { SmallCloseIcon, SearchIcon } from '@chakra-ui/icons'

import Categories from './categories'

export default function Search({ children, categories, isLoading, searchQuery, onClearSearch, onNameSearch, onCategorySelection }) {
  return (
    <div className='header'>
      <Categories
        values={categories}
        onSelect={onCategorySelection}
        isLoading={isLoading}
      />
      <div className='search'>
        <InputGroup>
          <InputLeftElement
            pointerEvents='none'
            children={<SearchIcon color='gray.600' />}
          />
          <Input
            variant="filled"
            // isDisabled={isLoading}
            className="searchField"
            value={searchQuery.param === 'name' ? searchQuery.value : ''}
            onChange={evt => onNameSearch(evt.target.value)}
          />
          <IconButton
            isDisabled={isLoading}
            className="clear-searchField"
            variant='unstyled'
            onClick={onClearSearch}
            icon={<SmallCloseIcon color='gray.300' />}
          />
        </InputGroup>
      </div>
      {children}
    </div>
  )
}
